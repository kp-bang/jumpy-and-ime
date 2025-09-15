import * as vscode from "vscode"

const jumpLines = (offset: number = 0) => {
  const editor = vscode.window.activeTextEditor
  const { visibleRanges, document } = editor!

  let visibleMinLine: number | undefined
  let visibleMaxLine: number | undefined

  let visibleLineNumbers = []
  for (const range of visibleRanges) {
    let lineNumber = range.start.line

    while (lineNumber <= range.end.line) {
      visibleLineNumbers.push(lineNumber++)

      if (visibleMinLine === undefined || lineNumber < visibleMinLine) {
        visibleMinLine = lineNumber
      }
      if (visibleMaxLine === undefined || visibleMaxLine < lineNumber) {
        visibleMaxLine = lineNumber
      }
    }
  }

  const centerLineNumberIndex = Math.floor(visibleLineNumbers.length / 2)
  const centerLineNumber = visibleLineNumbers[centerLineNumberIndex]

  const centerLine = document.lineAt(centerLineNumber)

  vscode.window.activeTextEditor!.selection = new vscode.Selection(
    centerLineNumber + offset,
    centerLine.text.length,
    centerLineNumber + offset,
    centerLine.text.length
  )

  const reviewType: vscode.TextEditorRevealType = vscode.TextEditorRevealType.InCenter
  vscode.window.activeTextEditor?.revealRange(vscode.window.activeTextEditor.selection, reviewType)
}

export default jumpLines
