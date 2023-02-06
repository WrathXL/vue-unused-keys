import vueCompiler from '@vue/compiler-sfc'
import esprima from 'esprima'

function vueToJavascript(code) {
  const { descriptor } = vueCompiler.parse(code)
  const javascript = []
  if (descriptor.template) {
    const { code: templateCode } = vueCompiler.compileTemplate({
      source: descriptor.template.content,
      id: ''
    })
    javascript.push(templateCode)
  }
  if (descriptor.script || descriptor.scriptSetup) {
    const scriptCode = vueCompiler.compileScript(descriptor, {
      reactivityTransform: true
    }).content
    javascript.push(scriptCode)
  }

  return javascript
}

function getStringValues(code) {
  const tokens = esprima.tokenize(code)
  const strings = tokens
    .filter((token) => token.type === 'String')
    .map((token) => token.value)
  return strings
}

function parseCode(code) {
  if (code.extension === 'vue') {
    return vueToJavascript(code.content)
  }
  return [code.content]
}

export function listString(codes) {
  const parsedCodes = codes.reduce((acc, curVal) => {
    return acc.concat(parseCode(curVal))
  }, [])

  const codesString = parsedCodes.reduce(
    (acc, curVal) => acc.concat(getStringValues(curVal)),
    []
  )

  return codesString
}
