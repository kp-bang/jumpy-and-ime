import vscode from "vscode"

import { Commands } from "../constants/common"
import { jumpyWordCommand$ } from "../event-source/jumpy"

const jumpyWordCommand = (context: vscode.ExtensionContext) => {
  const { subscriptions } = context

  // 在文本上展示跳转快捷文字标签
  const disposable = vscode.commands.registerCommand(Commands.jumpyWord, async () => {
    jumpyWordCommand$.next()
  })

  subscriptions.push(disposable)
}

export default jumpyWordCommand
