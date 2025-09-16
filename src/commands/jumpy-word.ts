import vscode from "vscode"

import { Commands } from "../constants/common"
import { jumpyJumpyEnter$ } from "../event-source/jumpy"
import jumpyJumpService from "../services/jumpy-jump-service"
import jumpyTextDecorationsService from "../services/jumpy-text-decorations"
import jumpyWatchTypeService from "../services/jumpy-watch-type"
import globalStore from "../store/global"

const jumpyWordCommand = (context: vscode.ExtensionContext) => {
  const { subscriptions } = context

  // 在文本上展示跳转快捷文字标签
  const disposable = vscode.commands.registerCommand(Commands.jumpyWord, async () => {
    if (globalStore.jumpy.isJumpyMode) return
    // 展示跳转快捷代码图片
    const decorations = jumpyTextDecorationsService(context)

    // 进入jumpy模式
    jumpyJumpyEnter$.next(decorations)

    // 监听快捷代码输入
    jumpyWatchTypeService(context)
    // 快捷代码输入完成即跳转
    jumpyJumpService(context)
  })

  subscriptions.push(disposable)
}

export default jumpyWordCommand
