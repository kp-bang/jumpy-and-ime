import vscode from "vscode"

import configuration from "../configuration"
import { IMEnum } from "../constants/im"

type CS = keyof typeof vscode.TextEditorCursorStyle

export const setCursor = (currentIM: IMEnum) => {
  const IM = configuration.im

  let cs: CS, cc: string | undefined
  switch (currentIM) {
    case IMEnum.EN:
      cs = IM["cursorStyle.English"]
      cc = IM["cursorColor.English"]
      break
    case IMEnum.CN:
      cs = IM["cursorStyle.Chinese"]
      cc = IM["cursorColor.Chinese"]
      break
    default:
      vscode.window.showInformationMessage(
        `没有匹配的输入法key值（当前：${currentIM}），请检查是否正确设置了“EnglishIM”和“ChineseIM”。`
      )
      return
  }

  // console.log("cursorStyle", cs, "cursorColor", cc)
  if (IM["cursorStyle.enable"] && vscode.window.activeTextEditor) {
    let ATEOptions = vscode.window.activeTextEditor.options
    vscode.window.activeTextEditor.options = { ...ATEOptions, cursorStyle: vscode.TextEditorCursorStyle[cs] }
  }

  if (IM["cursorColor.enable"]) {
    let globalColorCustomizations = vscode.workspace.getConfiguration("workbench").inspect("colorCustomizations")
      ?.globalValue as any

    let newGlobalColorCustomizations = { ...globalColorCustomizations }
    vscode.workspace.getConfiguration("workbench").update(
      "colorCustomizations",
      {
        ...newGlobalColorCustomizations,
        "editorCursor.foreground": cc ? cc : undefined
        // "terminalCursor.foreground": cc
      },
      vscode.ConfigurationTarget.Global
    )
  }
}
