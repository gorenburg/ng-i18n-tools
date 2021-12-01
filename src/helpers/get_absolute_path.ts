import path from 'path'

/**
 * Gets the given path as an absolute path.
 *
 * If the path is relative, it will be resolved against the current working directory.
 *
 * @param givenPath Given path
 * @returns Absolute path
 */
export default function getAbsolutePath(givenPath: string): string {
  if (path.isAbsolute(givenPath)) {
    return path.normalize(givenPath)
  } else {
    return path.resolve(process.cwd(), givenPath)
  }
}
