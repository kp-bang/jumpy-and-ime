import { Position, Range, TextDocument } from "vscode"

import { chineseAndSpaceSwitchToEnglishPattern } from "../../constants/hscopes"
import { IMEnum } from "../../constants/im"
import { switchIM } from "../im"

async function chineseAndSpaceSwitch(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 2) {
    return
  }
  const prePosition = cursorPosition.translate(0, -2)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  if (chineseAndSpaceSwitchToEnglishPattern.test(preChars)) {
    switchIM(IMEnum.EN)
  }
}

export default chineseAndSpaceSwitch
