import { observable } from "mobx"
import { TextEditorCursorStyle } from "vscode"

class SmartImeStore {
  // 是否禁用smartIme
  @observable
  accessor smartImeDisabled = false

  // 是否关闭提示
  @observable
  accessor warnDisabled = false

  // 文件超过n个字无英文则关闭
  @observable
  accessor disabledOnEnglishTextOverN = 100

  // 在vim下关闭
  @observable
  accessor disabledOnVim = true

  // 支持vim切换，记录原来的光标类型
  @observable
  accessor originalCursorStyle: TextEditorCursorStyle | undefined
  // 切换vim输入，记录原来的启用
  @observable
  accessor originalSmartImeDisabled = false
}

export default SmartImeStore
