import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import fs from 'fs'
// @ts-ignore
import path from 'path'

function saveSubmissionPlugin() {
  return {
    name: 'save-submission-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/save-submission', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', (chunk: any) => {
          body += chunk.toString()
        })

        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const rootDir = server.config.root
            const dirPath = path.join(rootDir, 'submissions')

            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true })
            }

            const safeDate = String(data.date || 'unknown').replace(/[^a-zA-Z0-9-_]/g, '')
            const fileName = `record_${safeDate}_${Date.now()}.json`
            const filePath = path.join(dirPath, fileName)

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')

            const masterFilePath = path.join(dirPath, 'all_submissions.json')
            let allSubmissions: any[] = []
            if (fs.existsSync(masterFilePath)) {
              allSubmissions = JSON.parse(fs.readFileSync(masterFilePath, 'utf-8'))
            }
            allSubmissions.push(data)
            fs.writeFileSync(masterFilePath, JSON.stringify(allSubmissions, null, 2), 'utf-8')

            console.log(`✅ Saved submission to: ${filePath}`)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, savedTo: `submissions/${fileName}` }))
          } catch (err: any) {
            console.error('❌ Error saving submission:', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err?.message || 'Failed to save JSON' }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), saveSubmissionPlugin()],
})