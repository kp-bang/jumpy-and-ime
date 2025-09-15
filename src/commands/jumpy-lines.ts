import vscode from "vscode"

import { Commands } from "../constants/common"
import jumpLines from "../utils/jumpy-lines"

const jumpyLinesCommand = (context: vscode.ExtensionContext) => {
  const jumpyUp5LinesDisposable = vscode.commands.registerCommand(Commands.jumpyUp5lines, () => {
    jumpLines(-5)
  })
  context.subscriptions.push(jumpyUp5LinesDisposable)

  const jumpyDown5LinesDisposable = vscode.commands.registerCommand(Commands.jumpyDown5lines, () => {
    jumpLines(5)
  })
  context.subscriptions.push(jumpyDown5LinesDisposable)
}

export default jumpyLinesCommand
