import vscode from "vscode"
import { action, reaction } from "mobx"
import JumpyStore from "./jumpy"
import { jumpyJumpCodeComplete$, jumpyJumpyEnter$, jumpyJumpyExit$ } from "../event-source/jumpy"
import IMStore from "./im"
import SmartImeStore from "./smart-ime"
import HscopesStore from "./hscopes"
import { Context } from "../constants/common"

class GlobalStore {
  jumpy = new JumpyStore()
  im = new IMStore()
  smartIme = new SmartImeStore()
  hscopes = new HscopesStore()

  @action
  reset() {
    this.jumpy.reset()
  }
}

const globalStore = new GlobalStore()

export default globalStore

// 进入jumpy模式
jumpyJumpyEnter$.subscribe((decorations) => {
  vscode.commands.executeCommand("setContext", Context.isJumpyMode, true)
  globalStore.jumpy.isJumpyMode = true
  globalStore.jumpy.decorations = decorations
})
// 退出jumpy模式
jumpyJumpyExit$.subscribe(() => {
  vscode.commands.executeCommand("setContext", Context.isJumpyMode, false)
  globalStore.jumpy.isJumpyMode = false
  globalStore.reset()
})

// 跳转快捷代码输入完成
reaction(
  () => globalStore.jumpy.jumpWordCommitted,
  (code) => {
    if (code.length !== 2) return
    const decoration = globalStore.jumpy.decorations?.find((decoration) => decoration.code === code)
    jumpyJumpCodeComplete$.next(decoration)
  }
)
