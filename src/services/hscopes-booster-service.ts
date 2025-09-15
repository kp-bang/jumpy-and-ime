import vscode from "vscode"

import globalStore from "../store/global"
import reloadDocuments from "../utils/hscopes/hscopes-reload-documents"
import reloadGrammar from "../utils/hscopes/hscopes-reload-grammar"
import openDocument from "../utils/hscopes/open-document"

const hcopesBoosterService = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(openDocument))

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      const thisDocController = globalStore.hscopes.documentsMap.get(document.uri)
      if (thisDocController) {
        thisDocController.dispose()
        globalStore.hscopes.documentsMap.delete(document.uri)
      }
    })
  )

  // context.subscriptions.push(vscode.commands.registerCommand("hscopes-booster.reload", reloadDocuments)) // 需要吗？

  globalStore.hscopes.registry = reloadGrammar()
  reloadDocuments()
}

export default hcopesBoosterService
