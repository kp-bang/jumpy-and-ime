import vscode from "vscode"

import { jumpyJumpCodeComplete$, jumpyJumpyExit$ } from "../event-source/jumpy"

const jumpyJumpService = (context: vscode.ExtensionContext) => {
  // 监听跳转目标
  const jumpyJumpCodeCompleteSubscript = jumpyJumpCodeComplete$.subscribe((decoration) => {
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

  // 退出清空
  const jumpyJumpyExitSubscript = jumpyJumpyExit$.subscribe(() => {
    jumpyJumpCodeCompleteSubscript.unsubscribe()
    jumpyJumpyExitSubscript.unsubscribe()
  })
}

export default jumpyJumpService
