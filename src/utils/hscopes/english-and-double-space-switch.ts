import { Position, Range, TextDocument } from "vscode"

import { englishAndDoubleSpaceSwitchToChinesePattern } from "../../constants/hscopes"

function englishAndDoubleSpaceSwitch(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 4) {
    return false
  }
  // 获取当前行光标之前的内容
  const lineText = document.getText(new Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character))
  // 如果当前行没有中文, 则不处理
  if (!/[\u4e00-\u9fa5]/.test(lineText)) {
    return false
  }
  // 非中文+双空格
  const prePosition = cursorPosition.translate(0, -3)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  if (englishAndDoubleSpaceSwitchToChinesePattern.test(preChars)) {
    return true
  }
  return false
}

export default englishAndDoubleSpaceSwitch
