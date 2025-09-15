import { action, observable, reaction } from "mobx"
import JumpyStore from "./jumpy"
import { jumpyJumpCodeComplete$, jumpyJumpyEnter$, jumpyJumpyExit$ } from "../event-source/jumpy"
import IMStore from "./im"
import SmartImeStore from "./smart-ime"
import HscopesStore from "./hscopes"

class GlobalStore {
  @observable
  accessor isJumpyMode = false

  jumpy = new JumpyStore()
  im = new IMStore()
  smartIme = new SmartImeStore()
  hscopes = new HscopesStore()

  @action
  reset() {
    this.isJumpyMode = false
    this.jumpy.reset()
  }
}

const globalStore = new GlobalStore()

export default globalStore

// 进入jumpy模式
jumpyJumpyEnter$.subscribe((decorations) => {
  globalStore.isJumpyMode = true
  globalStore.jumpy.decorations = decorations
})
// 退出jumpy模式
jumpyJumpyExit$.subscribe(() => {
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
