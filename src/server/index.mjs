// Zero-dependency static server for the mirrored XOX site.
// Serves ../../public byte-for-byte with proper MIME types and gzip support.
import { createServer } from 'node:http'
import { stat } from 'node:fs/promises'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MIME } from './mime-types.mjs'

const ROOT = fileURLToPath(new URL('../../public', import.meta.url))
const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || '127.0.0.1'

const server = createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (pathname === '/' || pathname === '') pathname = '/index.html'

    // prevent path traversal
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
    const filePath = join(ROOT, safe)

    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const info = await stat(filePath)
    if (info.isDirectory()) {
      const index = join(filePath, 'index.html')
      if (existsSync(index)) {
        res.writeHead(200, {
          'Content-Type': MIME['.html'],
          'Content-Length': (await stat(index)).size,
          'Cache-Control': 'no-store',
        })
        createReadStream(index).pipe(res)
        return
      }
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream'
    const acceptGzip = /gzip/.test(req.headers['accept-encoding'] || '')
    const gzPath = filePath + '.gz'

    if (acceptGzip && existsSync(gzPath)) {
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Encoding': 'gzip',
        'Content-Length': (await stat(gzPath)).size,
        'Cache-Control': 'no-store',
      })
      createReadStream(gzPath).pipe(res)
      return
    }

    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    })
    createReadStream(filePath).pipe(res)
  } catch (e) {
    res.writeHead(500)
    res.end('Internal server error')
    console.error(e)
  }
})

server.listen(PORT, HOST, () => {
  console.log(`XOX serving at http://${HOST}:${PORT}/`)
})
