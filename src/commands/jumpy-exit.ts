import vscode from "vscode"

import { Commands } from "../constants/common"
import { jumpyJumpyExit$ } from "../event-source/jumpy"

const jumpyExitCommand = (context: vscode.ExtensionContext) => {
  const { subscriptions } = context

  const disposable = vscode.commands.registerCommand(Commands.jumpyExit, async () => {
    jumpyJumpyExit$.next()
  })

  subscriptions.push(disposable)
}

export default jumpyExitCommand
