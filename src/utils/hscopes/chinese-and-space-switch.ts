import { Position, Range, TextDocument } from "vscode"

import { chineseAndSpaceSwitchToEnglishPattern } from "../../constants/hscopes"

function chineseAndSpaceSwitch(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 2) {
    return false
  }
  const prePosition = cursorPosition.translate(0, -2)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  if (chineseAndSpaceSwitchToEnglishPattern.test(preChars)) {
    return true
  }
  return false
}

export default chineseAndSpaceSwitch
