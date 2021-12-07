import fs from 'fs'
import path from 'path'

export default function getParsedFileData(filepath: string): { [key: string]: any } {
  const fileDest = path.normalize(filepath)
  if (!fs.existsSync(fileDest)) {
    console.log(`File read error: ${fileDest}`)
  }

  const file = fs.readFileSync(fileDest, 'utf8')
  return JSON.parse(file)
}
