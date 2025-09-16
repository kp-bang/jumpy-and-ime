import vscode from "vscode"

import globalStore from "../../store/global"
import DocumentController from "./document-controller"
import getLanguageScopeName from "./hscopes-language-scope-name"

/**
 * workspace.getConfiguration会触发onDidOpenTextDocument事件
 * 频繁打开、关闭settings.json
 * 如果判断document.uri.scheme为file才执行，那虚拟文件会丢失
 * 暂时硬判settings.json
 */
const openDocument = async (document: vscode.TextDocument) => {
  if (document.uri.scheme !== "file" && document.fileName.endsWith("\\User\\settings.json")) return
  try {
    const thisDocController = globalStore.hscopes.documentsMap.get(document.uri)

    const registry = globalStore.hscopes.registry
    if (thisDocController) {
      thisDocController.refresh()
    } else if (registry) {
      const scopeName = getLanguageScopeName(document.languageId)
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
