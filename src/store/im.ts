import { observable } from "mobx"
import vscode from "vscode"
import { IMEnum } from "../constants/im"

type CS = keyof typeof vscode.TextEditorCursorStyle

class IMStore {
  // 记录当前的输入法，不一定准确
  @observable
  accessor currentIME: IMEnum | undefined

  @observable
  accessor csEnable = true
  @observable
  accessor ccEnable = true

  @observable
  accessor csEnglish: CS = "Line"
  @observable
  accessor csChinese: CS = "Underline"
  @observable
  accessor ccEnglish: string | undefined
  @observable
  accessor ccChinese: string | undefined = "#FF0000"
}

export default IMStore
