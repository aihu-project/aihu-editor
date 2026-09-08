import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { $ } from 'bun'

const staging = await mkdtemp(join(tmpdir(), 'aihu-editor-pack-'))
try {
  await $`bun run build`
  const archive = await $`npm pack --json --ignore-scripts`.text()
  const [entry] = JSON.parse(archive) as Array<{ filename: string; files: Array<{ path: string }> }>
  if (!entry?.filename) throw new Error('npm pack returned no archive')
  const archivePath = join(staging, entry.filename)
  await $`mv ${entry.filename} ${archivePath}`
  const files = new Set(entry.files.map((file) => file.path))
  for (const expected of [
    'dist/index.js',
    'dist/index.d.ts',
    'components/aihu-editor.aihu',
    'README.md',
    'LICENSE',
  ]) {
    if (![...files].some((file) => file === expected || file.startsWith(`${expected}/`))) {
      throw new Error(`package archive is missing ${expected}`)
    }
  }
  await readFile(archivePath)
  console.log(`pack check passed: ${entry.filename}`)
} finally {
  await rm(staging, { recursive: true, force: true })
}
