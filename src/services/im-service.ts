import vscode from "vscode"

import { setCursor } from "../utils/cursor"
import { obtainIM } from "../utils/im"

const imService = (context: vscode.ExtensionContext) => {
  // 更新当前cursor
  const currentIM = obtainIM()
  setCursor(currentIM)
}

export default imService
