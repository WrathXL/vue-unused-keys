import Fs from 'fs'
import Path from 'path'
import { isHiddenFile } from 'is-hidden-file'
import { listString } from './src/parser.js'

const EXTENSIONS = ['js', 'ts', 'vue']
const IGNORE = ['node_modules']
const ROOT = './test-data/ActiveContracts.vue'

function fileExtension(file) {
  return file.split('.').at(-1)
}

function DirectoryVisitor(root, files) {
  if (IGNORE.find((ignore) => root.includes(ignore)) || isHiddenFile(root))
    return

  if (!Fs.statSync(root).isDirectory()) {
    if (EXTENSIONS.includes(fileExtension(root))) {
      files.push(root)
    }
    return
  }

  const items = Fs.readdirSync(root)
  items.forEach((item) => DirectoryVisitor(Path.join(root, item), files))
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
// Fs.writeFileSync('test.txt', JSON.stringify(allStrings))
console.log(allStrings)
