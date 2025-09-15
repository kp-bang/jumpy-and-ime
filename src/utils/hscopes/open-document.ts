import vscode from "vscode"

import globalStore from "../../store/global"
import DocumentController from "./document-controller"
import getLanguageScopeName from "./hscopes-language-scope-name"

const openDocument = async (document: vscode.TextDocument) => {
  try {
    const thisDocController = globalStore.hscopes.documentsMap.get(document.uri)
    console.log("是否有缓存", thisDocController)

    const registry = globalStore.hscopes.registry
    if (thisDocController) {
      thisDocController.refresh()
    } else if (registry) {
      const scopeName = getLanguageScopeName(document.languageId)
      console.log("%c [ scopeName ]-17", "font-size:13px; background:pink; color:#bf2c9f;", scopeName)
      if (scopeName) {
        const grammar = await registry.loadGrammar(scopeName)
        globalStore.hscopes.documentsMap.set(document.uri, new DocumentController(document, grammar))
      }
    }
  } catch (err) {
    console.log("HyperScopes: Unable to load document controller", err)
  }
}

export default openDocument
