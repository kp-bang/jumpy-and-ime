import _, { clamp, last, range } from "lodash"
import vscode from "vscode"

export function getVisibleLines(editor: vscode.TextEditor) {
  const { document } = editor
  const { visibleRanges } = editor

  const lines = _.chain(visibleRanges)
    .map((range, index) => {
      const block = {
        start: range.start.line,
        end: range.end.line
      }
      if (index === 0) {
        block.start = clamp(range.start.line - 30, 0, range.start.line) // 向上多取30行
      }
      if (index === visibleRanges.length - 1) {
        block.end = clamp(last(visibleRanges)!.end.line + 30, last(visibleRanges)!.end.line, document.lineCount) // 向下多取30行
      }
      return block
    })
    .map((block) => {
      return range(block.start, block.end)
    })
    .flatten()
    .map((line) => {
      const textLine = document.lineAt(line)
      return {
        isEmptyOrWhitespace: textLine.isEmptyOrWhitespace,
        line,
        text: `${textLine.text}\r\n`
      }
    })
    .filter((line) => !line.isEmptyOrWhitespace)
    .value()

  return lines
}
