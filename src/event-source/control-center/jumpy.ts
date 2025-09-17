import { runInAction } from "mobx"
import vscode from "vscode"

import { Context } from "../../constants/common"
import { IMEnum } from "../../constants/im"
import jumpyConstants from "../../constants/jumpy"
import globalStore from "../../store/global"
import { obtainIM, switchIM } from "../../utils/im"
import { jumpyEscape$, jumpyJumpCodeComplete$, jumpyJumpyEnter$, jumpyJumpyExit$ } from "../jumpy"
import jumpyTextDecorationsService from "../../services/jumpy-text-decorations"
import jumpyWatchTypeService from "../../services/jumpy-watch-type"

const jumpyControlRun = () => {
  // 进入jumpy模式
  jumpyJumpyEnter$.subscribe(() => {
    const im = obtainIM()
    if (im !== IMEnum.EN) {
      switchIM(IMEnum.EN)
    }
    // 展示跳转快捷代码图片
    const decorations = jumpyTextDecorationsService()
    // 监听快捷代码输入

    vscode.commands.executeCommand("setContext", Context.isJumpyMode, true)
    globalStore.jumpy.isJumpyMode = true
    globalStore.jumpy.decorations = decorations

    jumpyWatchTypeService()
  })

  // 监听跳转目标
  jumpyJumpCodeComplete$.subscribe((decoration) => {
    if (!decoration) {
      vscode.window.showInformationMessage("找不到目标，光标跳转失败")
      return
    }

    const { range } = decoration

    if (!vscode.window.activeTextEditor) return

    vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.start)

    const reviewType = vscode.TextEditorRevealType.Default
    vscode.window.activeTextEditor.revealRange(vscode.window.activeTextEditor.selection, reviewType)

    jumpyJumpyExit$.next()
  })

  // escape按下，若已输入1个char，则删除，没有则退出jumpy模式
  jumpyEscape$.subscribe(() => {
    if (globalStore.jumpy.jumpWordCommitted) {
      runInAction(() => (globalStore.jumpy.jumpWordCommitted = ""))
      return
    }

    jumpyJumpyExit$.next()
  })

  // 退出jumpy模式
  jumpyJumpyExit$.subscribe(() => {
    vscode.commands.executeCommand("setContext", Context.isJumpyMode, false)
    globalStore.jumpy.isJumpyMode = false
    vscode.window.activeTextEditor?.setDecorations(jumpyConstants.decorationType, [])
    globalStore.reset()
  })
}

export default jumpyControlRun
