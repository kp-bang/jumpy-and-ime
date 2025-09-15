import { Position, Range, TextDocument } from "vscode"

import { chineseCharacterPattern } from "../../constants/hscopes"
import { IMEnum } from "../../constants/im"
import globalStore from "../../store/global"
import { switchIM } from "../im"

let lastChineseSwitchToChineseTime = 0

async function chineseSwitchToChinese(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 1) {
    return
  }

  const prePosition = cursorPosition.translate(0, -1)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  if (chineseCharacterPattern.test(preChars)) {
    // 设置触发间隔
    if (Date.now() - lastChineseSwitchToChineseTime < globalStore.hscopes.enableChineseSwitchToChineseInterval) {
      return
    }
    lastChineseSwitchToChineseTime = Date.now()
    console.log("chineseSwitchToChinese cn")
    switchIM(IMEnum.CN)
  }
}

export default chineseSwitchToChinese
