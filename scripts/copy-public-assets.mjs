import { mkdir, cp, stat } from 'fs/promises'
import { resolve } from 'path'

const projectRoot = resolve(process.cwd())
const sourceDirs = [
  { from: resolve(projectRoot, 'assets', 'tmp'), to: resolve(projectRoot, 'public', 'assets', 'tmp') },
  { from: resolve(projectRoot, 'assets', 'mockup'), to: resolve(projectRoot, 'public', 'assets', 'mockup') }
]

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true })
}

async function copyDir(from, to) {
  if (!(await exists(from))) {
    return
  }
  await ensureDir(to)
  await cp(from, to, { recursive: true, force: true })
}

async function main() {
  await Promise.all(sourceDirs.map(({ from, to }) => copyDir(from, to)))
}

main().catch((error) => {
  console.error('[copy-public-assets] Failed:', error)
  process.exit(1)
})
