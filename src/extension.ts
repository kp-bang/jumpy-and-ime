import * as vscode from "vscode"

import commands from "./commands"
import controlCenterRun from "./event-source/control-center"
import hcopesBoosterService from "./services/hscopes-booster-service"
import imService from "./services/im-service"
import smartImeService from "./services/smart-ime"

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "jumpy-and-ime" is now active!')

  // const disposable = vscode.commands.registerCommand(Commands.test, () => {
  //   vscode.window.showInformationMessage("测试")
  // })
  // context.subscriptions.push(disposable)

  // im服务
  imService(context)
  // 智能IME
  smartImeService(context)
  // hscopes服务
  hcopesBoosterService(context)

  commands.forEach((command) => command(context))

  controlCenterRun()
}

export function deactivate() {
  vscode.workspace
    .getConfiguration("workbench")
    .update("colorCustomizations", { "editorCursor.foreground": undefined }, vscode.ConfigurationTarget.Global)
}
