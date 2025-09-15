import { observable } from "mobx"
import vscode from "vscode"

type CS = keyof typeof vscode.TextEditorCursorStyle

class IMStore {
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
