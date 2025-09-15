import { isNil } from "lodash"
import vscode from "vscode"

import { IMEnum } from "../constants/im"
import { jumpyJumpyEnter$, jumpyJumpyExit$ } from "../event-source/jumpy"
import globalStore from "../store/global"
import { setCursor } from "../utils/cursor"
import { obtainIM, switchIM } from "../utils/im"

const imService = (context: vscode.ExtensionContext) => {
  // 更新当前cursor
  const currentIM = obtainIM()
  setCursor(currentIM)

  // context.subscriptions.push(
  //   vscode.window.onDidChangeWindowState((e: vscode.WindowState) => {
  //     if (!e.focused) return

  //     const im = obtainIM()
  //     console.log("windowStateChange im", im)
  //     setCursor(im)
  //   })
  // )

  // context.subscriptions.push(
  //   vscode.window.onDidChangeActiveTextEditor(async (e: vscode.TextEditor | undefined) => {
  //     if (!e) return

  //     const im = obtainIM()
  //     console.log("activeTextEditorChange im", im)
  //     setCursor(im)
  //   })
  // )

  // context.subscriptions.push(
  //   vscode.window.onDidChangeTextEditorOptions((e: vscode.TextEditorOptionsChangeEvent) => {
  //     const IM = globalStore.im
  //     if (IM.ccEnable && !IM.csEnable) return

  //     const im = obtainIM()
  //     console.log("textEditorOptionsChange im", im)
  //     setCursor(im)
  //   })
  // )

  // 进入jumpy模式，就转成英文
  const jumpyJumpyEnterSubscript = jumpyJumpyEnter$.subscribe(() => {
    const im = obtainIM()
    console.log("jumpyJumpyEnter im", im)
    if (im !== IMEnum.EN) {
      globalStore.jumpy.originalIM = im
      switchIM(IMEnum.EN)
    }
  })

  // 退出jumpy模式，恢复原本的输入法
  const jumpyJumpyExitSubscript = jumpyJumpyExit$.subscribe(() => {
    const originalIM = globalStore.jumpy.originalIM
    if (!isNil(originalIM) && originalIM !== IMEnum.EN) {
      switchIM(originalIM)
    }
    globalStore.jumpy.originalIM = undefined
  })

  // 退出时注销
  context.subscriptions.push(
    { dispose: jumpyJumpyEnterSubscript.unsubscribe },
    { dispose: jumpyJumpyExitSubscript.unsubscribe }
  )
}

export default imService
