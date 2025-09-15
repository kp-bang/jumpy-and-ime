import * as vscode from "vscode"

import commands from "./commands"
import { Commands } from "./constants/common"
import imService from "./services/im-service"

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "jumpy-and-ime" is now active!')

  const disposable = vscode.commands.registerCommand(Commands.test, () => {
    vscode.window.showInformationMessage("测试")
  })
  context.subscriptions.push(disposable)

  // im服务
  imService(context)

  commands.forEach((command) => command(context))
}

export function deactivate() {
  vscode.workspace
    .getConfiguration("workbench")
    .update("colorCustomizations", { "editorCursor.foreground": undefined }, vscode.ConfigurationTarget.Workspace)
}
