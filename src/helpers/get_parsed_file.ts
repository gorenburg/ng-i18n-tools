import fs from 'fs'
import path from 'path'

export default function getParsedFileData(filepath: string): { [key: string]: any } {
  if (!fs.existsSync(filepath)) {
    console.log(`File read error: ${filepath}`)
  }

  const file = fs.readFileSync(path.normalize(filepath), 'utf8')
  return JSON.parse(file)
}
