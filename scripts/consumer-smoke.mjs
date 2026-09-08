import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const a = process.argv[2]
if (!a) throw new Error('usage: node scripts/consumer-smoke.mjs /absolute/path/package.tgz')
const d = mkdtempSync(join(tmpdir(), 'aihu-editor-consumer-'))
execFileSync('npm', ['init', '-y'], { cwd: d, stdio: 'ignore' })
execFileSync(
  'npm',
  ['install', '--ignore-scripts', '--no-package-lock', '--no-audit', '--no-fund', resolve(a)],
  { cwd: d, stdio: 'inherit' },
)
execFileSync(
  process.execPath,
  [
    '--input-type=module',
    '-e',
    "const mod = await import('@aihu/editor'); if (typeof mod !== 'object') throw new Error('editor import failed')",
  ],
  { cwd: d, stdio: 'inherit' },
)
console.log(`isolated consumer passed against ${a}`)
