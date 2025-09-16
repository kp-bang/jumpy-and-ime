import { action, reaction } from "mobx"
import JumpyStore from "./jumpy"
import IMStore from "./im"
import SmartImeStore from "./smart-ime"
import HscopesStore from "./hscopes"
import { jumpyJumpCodeComplete$ } from "../event-source/jumpy"

class GlobalStore {
  jumpy = new JumpyStore()
  im = new IMStore()
  smartIme = new SmartImeStore()
  hscopes = new HscopesStore()

  @action
  reset = () => {
    this.jumpy.reset()
  }
}

const globalStore = new GlobalStore()

export default globalStore

// 跳转快捷代码输入完成
reaction(
  () => globalStore.jumpy.jumpWordCommitted,
  (code) => {
    if (code.length !== 2) return
    const decoration = globalStore.jumpy.decorations?.find((decoration) => decoration.code === code)
    jumpyJumpCodeComplete$.next(decoration)
  }
)
