import fs from "fs"
import path from "path"
import vscode from "vscode"
import * as oniguruma from "vscode-oniguruma"
import * as vsctm from "vscode-textmate"

const reloadGrammar = () => {
  try {
    const wasmBin = fs.readFileSync(
      path.join(__dirname, "../../../node_modules/vscode-oniguruma/release/onig.wasm")
    ).buffer
    console.log("%c [ wasmBin ]-10", "font-size:13px; background:pink; color:#bf2c9f;", wasmBin)

    const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => {
      console.log('onig.wasm then')
      return {
        createOnigScanner(patterns: any) {
          return new oniguruma.OnigScanner(patterns)
        },
        createOnigString(s: any) {
          return new oniguruma.OnigString(s)
        }
      }
    })

    const registry = new vsctm.Registry({
      onigLib: vscodeOnigurumaLib,
      getInjections: (scopeName) => {
        let extensions = vscode.extensions.all.filter(
          (x) => x.packageJSON && x.packageJSON.contributes && x.packageJSON.contributes.grammars
        )
        let grammars = extensions.flatMap((e) => {
          return e.packageJSON.contributes.grammars
        })
        return grammars
          .filter((g) => g.injectTo && g.injectTo.some((s: any) => s === scopeName))
          .map((g) => g.scopeName)
      },
      loadGrammar: async (scopeName) => {
        try {
          let extensions = vscode.extensions.all.filter(
            (x) => x.packageJSON && x.packageJSON.contributes && x.packageJSON.contributes.grammars
          )
          let grammars = extensions.flatMap((e) => {
            return e.packageJSON.contributes.grammars.map((g: any) => {
              return { extensionPath: e.extensionPath, ...g }
            })
          })
          const matchingGrammars = grammars.filter((g) => g.scopeName === scopeName)
          if (matchingGrammars.length > 0) {
            const grammar = matchingGrammars[0]
            const filePath = path.join(grammar.extensionPath, grammar.path)
            let content = await fs.promises.readFile(filePath, "utf-8")
            // @ts-ignore
            return vsctm.parseRawGrammar(content, filePath)
          }
        } catch (err) {
          console.error(`HyperScopes: Unable to load grammar for scope ${scopeName}.`, err)
        }
        return undefined
      }
    })

    return registry
  } catch (err) {
    console.error(err)
  }
}

export default reloadGrammar
