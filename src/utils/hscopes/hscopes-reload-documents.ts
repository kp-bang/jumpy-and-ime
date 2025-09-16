import vscode from "vscode"

import globalStore from "../../store/global"
import openDocument from "./open-document"

function unloadDocuments() {
  const documentsMap = globalStore.hscopes.documentsMap

  for (const thisDocController of documentsMap.values()) {
    thisDocController.dispose()
  }
  documentsMap.clear()
}

function reloadDocuments() {
  unloadDocuments()
  vscode.workspace.textDocuments.forEach((doc) => openDocument(doc))
}

export default reloadDocuments
