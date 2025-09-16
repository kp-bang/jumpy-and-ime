import vscode from "vscode"

import globalStore from "../../store/global"

const getScopeAt = (document: vscode.TextDocument, position: vscode.Position) => {
  try {
    const thisDocController = globalStore.hscopes.documentsMap.get(document.uri)
    if (thisDocController) {
      return thisDocController.getScopeAt(position)
    }
  } catch (err) {
    console.error("HyperScopes: Unable to get Scope at position: ", position, "\n", err)
  }
  return null
}

export default getScopeAt
