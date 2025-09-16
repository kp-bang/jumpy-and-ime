import vscode from "vscode"

import { Commands } from "../constants/common"
import { jumpyEscape$ } from "../event-source/jumpy"

const jumpyEscapeCommand = (context: vscode.ExtensionContext) => {
  const { subscriptions } = context

  const disposable = vscode.commands.registerCommand(Commands.jumpyEscape, async () => {
    jumpyEscape$.next()
  })

  subscriptions.push(disposable)
}

export default jumpyEscapeCommand
