import vscode from "vscode"

import { jumpyJumpyExit$ } from "../event-source/jumpy"
import globalStore from "../store/global"

const jumpyWatchTypeService = (context: vscode.ExtensionContext) => {
  // const enIm = imeApi.getEnglishIM()
  // originalIM = imeApi.obtainIM()
  // if (enIm !== originalIM) {
  //   imeApi.switchToEnglishIM()
  // }

  /**
   * 在jumpy模式下监听输入
   * 因为vscode会卡拼音输入法
   * 所以这里动态监听和取消type事件
   */
  const jumpyTypeDisposable = vscode.commands.registerCommand("type", (args) => {
    const text: string = args.text
    if (text.search(/[a-z]/i) === -1) {
      jumpyJumpyExit$.next()
      return
    }

    globalStore.jumpy.input(text)
  })

  // 退出清空
  const jumpyJumpyExitSubscript = jumpyJumpyExit$.subscribe(() => {
    jumpyTypeDisposable.dispose()
    jumpyJumpyExitSubscript.unsubscribe()
  })
}

export default jumpyWatchTypeService
