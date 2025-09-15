import vscode, { Position, Range, TextDocument } from "vscode"

import { englishAndDoubleSpaceSwitchToChinesePattern } from "../../constants/hscopes"
import { IMEnum } from "../../constants/im"
import { obtainIM, switchIM } from "../im"

async function englishAndDoubleSpaceSwitch(document: TextDocument, cursorPosition: Position) {
  if (cursorPosition.character < 4) {
    return
  }
  // 获取当前行光标之前的内容
  const lineText = document.getText(new Range(cursorPosition.line, 0, cursorPosition.line, cursorPosition.character))
  // 如果当前行没有中文, 则不处理
  if (!/[\u4e00-\u9fa5]/.test(lineText)) {
    return
  }
  // 非中文+双空格
  const prePosition = cursorPosition.translate(0, -3)
  const range = new Range(prePosition, cursorPosition)
  const preChars = document.getText(range)
  if (englishAndDoubleSpaceSwitchToChinesePattern.test(preChars)) {
    // 如果当前是英文删掉最后一个字符然后切换到中文输入法
    if (obtainIM() === IMEnum.EN) {
      const deleteRange = new Range(cursorPosition.translate(0, -1), cursorPosition)
      await vscode.window.activeTextEditor?.edit((editBuilder) => {
        editBuilder.delete(deleteRange)
        switchIM(IMEnum.CN)
      })
    }
  }
}

export default englishAndDoubleSpaceSwitch
