import path from "path"
import vscode from "vscode"

import configuration from "../configuration"

// smart-ime，当前文件是否符合配置的后缀
const isIncludeAssociationExt = () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return true

  const document = editor.document
  const filePath = document.fileName
  const fileExtension = path.extname(filePath).toLowerCase()

  const associationExts = configuration.smartIme.smartImeAssociationExt.split(",")
  return associationExts.some((associateExt) => `.${associateExt}` === fileExtension)
}

export default isIncludeAssociationExt
