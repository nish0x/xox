// Mirror script: downloads the complete xox.makemepulse.com static build
// into ../../public so the site can be served byte-for-byte identical.
import { mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { SEED_FILES } from './seed-files.mjs'
import { localPathFor, reorganizeReferences } from './reorganize.mjs'

const ORIGIN = 'https://xox.makemepulse.com'
const OUT = fileURLToPath(new URL('../../public', import.meta.url))

const seen = new Set()
const failures = []

// The origin is a CloudFront-fronted SPA: any unknown path (including every
// bogus "reference" the old crawler regex used to invent, e.g. `e.length`
// or `Math.PI` pulled out of minified JS) resolves to a 200 OK copy of
// index.html instead of a 404. That silently produced hundreds of garbage
// files. We fetch index.html once up front and treat byte-identical
// responses to any other path as "not a real asset" rather than writing it.
let indexHtml = null

// Only chase references that end in an extension this site actually ships,
// so member-expression noise like `e.length` or `Math.PI` never matches.
const REAL_EXTENSIONS =
  /\.(js|mjs|css|json|png|jpe?g|webp|svg|glb|gltf|mp3|wav|woff2?|ttf|ico|webmanifest|txt|xml|pdf|ktx2?)$/i

async function fetchBin(url) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const type = res.headers.get('content-type') || ''
  const buf = Buffer.from(await res.arrayBuffer())
  const isText =
    type.includes('text') ||
    type.includes('javascript') ||
    type.includes('json') ||
    type.includes('xml') ||
    type.includes('svg') ||
    type.includes('manifest')
  return { buf, isText }
}

async function downloadRelative(rel) {
  const clean = rel.split('#')[0].split('?')[0]
  if (!clean || clean.startsWith('http') || clean.startsWith('//')) return
  const path = (clean.startsWith('/') ? clean : `/${clean}`).replace(/\/+/g, '/')
  if (seen.has(path)) return
  seen.add(path)

  const url = ORIGIN + path
  try {
    const { buf, isText } = await fetchBin(url)

    // The origin serves its SPA fallback (index.html) with a 200 for any
    // unknown path instead of a 404. A "reference" that resolves to that
    // fallback isn't a real asset — skip it instead of writing a clone.
    if (indexHtml && path !== '/index.html' && buf.equals(indexHtml)) {
      process.stdout.write(`SKIP ${path} -> resolves to SPA fallback, not a real asset\n`)
      return
    }

    // the live site is flat (everything under /assets/); locally we
    // reorganize into subfolders by type, so the two paths can differ
    const relPath = path.slice(1)
    const localRel = localPathFor(relPath)
    const outPath = join(OUT, localRel)
    await mkdir(dirname(outPath), { recursive: true })

    if (path === '/index.html') indexHtml = buf

    if (isText) {
      const text = buf.toString('utf8')
      await writeFile(outPath, reorganizeReferences(relPath, text))
      // crawl references inside text files, restricted to extensions this
      // site actually ships — otherwise minified JS property access like
      // `e.length` or `Math.PI` gets misread as a filename to fetch. This
      // walks the RAW (still-flat) text, since that's what matches the
      // live site's actual URL structure.
      const all =
        text.match(/["'(](\.\.?\/|\.\/|\/)?[A-Za-z0-9_\-./]+\.[A-Za-z0-9_-]{2,6}["')]/g) || []
      for (const m of all) {
        const u = m.replace(/^["'(]+/, '').replace(/["')]+$/, '').replace(/^\.\.?\/+/, '')
        if (u === path.replace(/^\//, '')) continue
        if (!REAL_EXTENSIONS.test(u)) continue
        await downloadRelative('/' + u.replace(/^\/+/, ''))
      }
    } else {
      await writeFile(outPath, buf)
    }
    process.stdout.write(`OK  ${path} -> ${localRel}\n`)
  } catch (e) {
    failures.push({ path, error: e.message })
    process.stdout.write(`FAIL ${path} -> ${e.message}\n`)
  }
}

// fetch index.html first so its bytes are known before anything else runs
// (needed to detect SPA-fallback responses masquerading as real assets)
await downloadRelative('/index.html')

// seed everything else; downloads in parallel with small concurrency
const CONCURRENCY = 8
const queue = [...new Set(SEED_FILES.filter((p) => p !== 'index.html'))]
let idx = 0

async function worker() {
  while (idx < queue.length) {
    const p = queue[idx++]
    await downloadRelative(p)
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker))

console.log(`\nDone. Downloaded ${seen.size} files, ${failures.length} failures`)
if (failures.length) {
  console.log('Failures:')
  failures.forEach((f) => console.log('  ', f.path, f.error))
}
