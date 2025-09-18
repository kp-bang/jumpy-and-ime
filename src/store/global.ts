import { action, makeObservable, reaction } from "mobx"

import { jumpyJumpCodeComplete$, jumpyJumpWordCommittedUpdate$ } from "../event-source/jumpy"
import HscopesStore from "./hscopes"
import IMStore from "./im"
import JumpyStore from "./jumpy"
import SmartImeStore from "./smart-ime"

class GlobalStore {
  jumpy = new JumpyStore()
  im = new IMStore()
  smartIme = new SmartImeStore()
  hscopes = new HscopesStore()

  constructor() {
    makeObservable(this, {
      reset: action
    })
  }

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
    jumpyJumpWordCommittedUpdate$.next(code)

    if (code.length !== 2) return
    const decoration = globalStore.jumpy.decorations?.find((decoration) => decoration.code === code)
    jumpyJumpCodeComplete$.next(decoration)
  }
)
