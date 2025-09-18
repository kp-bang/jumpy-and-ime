import { action, makeObservable, observable } from "mobx"
import vscode from "vscode"

export default class JumpyStore {
  isJumpyMode = false
  // 跳转目标处的快捷键
  jumpWordCommitted = ""

  decorations: (vscode.DecorationOptions & { index: number; code: string })[] | undefined

  // 进入jumpy模式中产生的订阅，把待注销的事柄存到队列，事件结束后执行
  subscriptions: (() => void)[] = []

  constructor() {
    makeObservable(this, {
      isJumpyMode: observable,
      jumpWordCommitted: observable,
      input: action,
      reset: action
    })
  }

  input(value: string) {
    if (!value.length) return
    this.jumpWordCommitted += value
  }

  reset = () => {
    this.jumpWordCommitted = ""
    this.decorations = undefined
    this.subscriptions.forEach((cb) => cb())
    this.subscriptions.length = 0
  }
}
