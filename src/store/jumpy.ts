import vscode from "vscode"
import { action, observable } from "mobx"

export default class JumpyStore {
  // 跳转目标处的快捷键
  @observable
  accessor jumpWordCommitted = ""

  decorations: (vscode.DecorationOptions & { index: number; code: string })[] | undefined

  @action
  input(value: string) {
    if (!value.length) return
    this.jumpWordCommitted += value
  }

  @action
  reset() {
    this.jumpWordCommitted = ""
    this.decorations = undefined
  }
}
