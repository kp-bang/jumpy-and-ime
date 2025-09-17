import vscode from "vscode"

import configuration from "../configuration"
import { Commands } from "../constants/common"
import jumpLines from "../utils/jumpy-lines"

const jumpyLinesCommand = (context: vscode.ExtensionContext) => {
  const jumpyUp5LinesDisposable = vscode.commands.registerCommand(Commands.jumpyUpLines, () => {
    const length = configuration.jumpy.movingStepLength
    jumpLines(-parseInt(`${length}`))
  })
  context.subscriptions.push(jumpyUp5LinesDisposable)

  const jumpyDown5LinesDisposable = vscode.commands.registerCommand(Commands.jumpyDownLines, () => {
    const length = configuration.jumpy.movingStepLength
    jumpLines(parseInt(`${length}`))
  })
  context.subscriptions.push(jumpyDown5LinesDisposable)
}

export default jumpyLinesCommand
