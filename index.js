import { listString } from './src/parser.js'
import Fs from 'fs'
import Path from 'path'
import { isHiddenFile } from 'is-hidden-file'

const EXTENSIONS = ['js', 'ts', 'vue']
const ROOT = '.'

function fileExtension(file) {
  return file.split('.').at(-1)
}

function DirectoryVisitor(root, files) {
  const items = Fs.readdirSync(root)
  items.forEach((item) => {
    const path = Path.join(root, item)
    if (item === 'node_modules' || isHiddenFile(path)) return
    if (Fs.statSync(path).isDirectory()) {
      DirectoryVisitor(path, files)
    } else if (EXTENSIONS.includes(fileExtension(item))) {
      files.push(path)
    }
  })
}

function loadFiles(root) {
  const files = []
  DirectoryVisitor(root, files)
  return files.map((file) => ({
    content: Fs.readFileSync(file, 'utf-8'),
    extension: fileExtension(file)
  }))
}

const codes = loadFiles(ROOT)
const allStrings = listString(codes)

console.log(allStrings)
