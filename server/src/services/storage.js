/**
 * server/src/services/storage.js
 * Simple JSON file storage. Swap for DB later.
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname }               from 'path'
import { fileURLToPath }               from 'url'

const __dir    = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dir, '../../data')

const filePath = (name) => join(DATA_DIR, `${name}.json`)

export async function readJSON(name) {
  try {
    const raw = await readFile(filePath(name), 'utf8')
    return JSON.parse(raw)
  } catch {
    return []  // file doesn't exist yet — return empty array
  }
}

export async function writeJSON(name, data) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(filePath(name), JSON.stringify(data, null, 2))
}
