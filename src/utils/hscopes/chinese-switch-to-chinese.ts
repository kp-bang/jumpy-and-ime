import { Position, Range, TextDocument } from "vscode"

import { chineseCharacterPattern } from "../../constants/hscopes"

function chineseSwitchToChinese(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 1) {
    return false
  }

  const prePosition = cursorPosition.translate(0, -1)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  return chineseCharacterPattern.test(preChars)
}

export default chineseSwitchToChinese
