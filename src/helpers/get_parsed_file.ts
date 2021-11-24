import fs from 'fs'

export default function getParsedFileData(filepath: string): { [key: string]: any } {
  if (!fs.existsSync(filepath)) {
    console.log(`File read error: ${filepath}`)
  }

  const file = fs.readFileSync(filepath, 'utf8')
  return JSON.parse(file)
}
