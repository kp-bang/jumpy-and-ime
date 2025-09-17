import * as vscode from "vscode"

const jumpLines = (offset: number = 0) => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return
  const { document } = editor

  const selections = editor.selections.map((sel) => {
    const active = sel.active
    let newLine: number
    if (offset < 0) {
      // 向上
      newLine = Math.max(active.line - Math.abs(offset), 0)
    } else {
      // 向下
      newLine = Math.min(active.line + offset, document.lineCount - 1)
    }
    const newPos = new vscode.Position(newLine, active.character)
    return new vscode.Selection(newPos, newPos) // 光标移动，无选区
  })
  editor.selections = selections

  const reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter
  vscode.window.activeTextEditor?.revealRange(vscode.window.activeTextEditor.selection, reviewType)
}

export default jumpLines
