// Verifies public/ against the seed list: reports anything missing, too
// small, not part of the known seed, or a disguised SPA-fallback clone —
// then re-downloads any missing (and genuinely real) file.
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { SEED_FILES } from './seed-files.mjs'
import { localPathFor, reorganizeReferences } from './reorganize.mjs'

const ORIGIN = 'https://xox.makemepulse.com'
const OUT = fileURLToPath(new URL('../../public', import.meta.url))

// Loose floors just to catch truncated downloads — some real files here are
// genuinely tiny (e.g. arrow icon chunks are ~357 bytes, B0-DFxftU9o.png is
// a 147-byte 1x1 placeholder), so these aren't meant to be tight bounds.
const MIN_SIZE = {
  '.js': 300,
  '.css': 400,
  '.html': 400,
  '.woff2': 500,
  '.glb': 500,
  '.mp3': 20000,
  '.json': 200,
  '.png': 100,
  '.jpg': 100,
  '.svg': 100,
  '.webmanifest': 50,
  '.ico': 100,
}

const missing = []
const bad = []
for (const rel of SEED_FILES) {
  const p = join(OUT, localPathFor(rel))
  if (!existsSync(p)) {
    missing.push(rel)
    continue
  }
  const size = statSync(p).size
  const ext = '.' + rel.split('.').pop()
  const min = MIN_SIZE[ext] ?? 0
  if (size < min) bad.push([rel, size])
}

console.log(`seed entries: ${SEED_FILES.length}`)
console.log(`missing: ${missing.length}`)
missing.forEach((m) => console.log('  MISSING', m))
console.log(`too small: ${bad.length}`)
bad.forEach(([m, s]) => console.log('  SMALL', m, s))

// Guard against regressions: the origin serves its SPA fallback (index.html)
// with 200 OK for any unknown path, which is exactly how public/ previously
// filled up with hundreds of garbage files (see crawl.mjs).
// Flag anything on disk that (a) isn't part of the known seed, or (b) is a
// byte-for-byte clone of index.html under a different name.
const indexPath = join(OUT, 'index.html')
const indexBuf = existsSync(indexPath) ? readFileSync(indexPath) : null
const known = new Set(['index.html', ...SEED_FILES.map(localPathFor)])
const stray = []
const clones = []

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      walk(p)
      continue
    }
    const rel = relative(OUT, p).split('\\').join('/')
    if (!known.has(rel)) stray.push(rel)
    if (indexBuf && rel !== 'index.html') {
      const buf = readFileSync(p)
      if (buf.length === indexBuf.length && buf.equals(indexBuf)) clones.push(rel)
    }
  }
}
if (existsSync(OUT)) walk(OUT)

console.log(`stray files (not in seed list): ${stray.length}`)
stray.forEach((s) => console.log('  STRAY', s))
console.log(`SPA-fallback clones (bogus files): ${clones.length}`)
clones.forEach((c) => console.log('  CLONE', c))

// download missing ones (skip anything that resolves to the SPA fallback
// instead of a real file, e.g. a seed entry that no longer exists)
let fails = 0
for (const rel of missing) {
  const url = `${ORIGIN}/${rel}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const isFallbackClone =
      indexBuf && rel !== 'index.html' && buf.length === indexBuf.length && buf.equals(indexBuf)
    if (isFallbackClone) {
      console.log(
        '  SKIP',
        rel,
        '-> resolves to SPA fallback, not a real asset (remove it from SEED_FILES)'
      )
      continue
    }
    const localRel = localPathFor(rel)
    const out = join(OUT, localRel)
    await mkdir(dirname(out), { recursive: true })
    const contentType = res.headers.get('content-type') || ''
    const isText =
      contentType.includes('text') ||
      contentType.includes('javascript') ||
      contentType.includes('json') ||
      contentType.includes('xml') ||
      contentType.includes('svg') ||
      contentType.includes('manifest')
    await writeFile(out, isText ? reorganizeReferences(rel, buf.toString('utf8')) : buf)
    console.log('  FETCHED', rel, '->', localRel)
  } catch (e) {
    fails++
    console.log('  FAILED', rel, e.message)
  }
}
console.log(`download failures: ${fails}`)
