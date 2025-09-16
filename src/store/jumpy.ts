import vscode from "vscode"
import { action, observable } from "mobx"

export default class JumpyStore {
  @observable
  accessor isJumpyMode = false
  // 跳转目标处的快捷键
  @observable
  accessor jumpWordCommitted = ""

  decorations: (vscode.DecorationOptions & { index: number; code: string })[] | undefined

  // 进入jumpy模式中产生的订阅，把待注销的事柄存到队列，事件结束后执行
  subscriptions: (() => void)[] = []

  @action
  input(value: string) {
    if (!value.length) return
    this.jumpWordCommitted += value
  }

  @action
  reset = () => {
    this.jumpWordCommitted = ""
    this.decorations = undefined
    this.subscriptions.forEach((cb) => cb())
    console.log("this.subscriptions", this.subscriptions)
    this.subscriptions.length = 0
  }
}
