import vscode from "vscode"

import { IMEnum } from "../constants/im"
import globalStore from "../store/global"

type CS = keyof typeof vscode.TextEditorCursorStyle

export const setCursor = (currentIM: IMEnum) => {
  const IM = globalStore.im

  let cs: CS, cc: string | undefined
  switch (currentIM) {
    case IMEnum.EN:
      cs = IM.csEnglish
      cc = IM.ccEnglish
      break
    case IMEnum.CN:
      cs = IM.csChinese
      cc = IM.ccChinese
      break
    default:
      vscode.window.showInformationMessage(
        `没有匹配的输入法key值（当前：${currentIM}），请检查是否正确设置了“EnglishIM”和“ChineseIM”。`
      )
      return
  }
  if (IM.csEnable && vscode.window.activeTextEditor) {
    let ATEOptions = vscode.window.activeTextEditor.options
    if (ATEOptions.cursorStyle !== vscode.TextEditorCursorStyle[cs]) {
      vscode.window.activeTextEditor.options = { ...ATEOptions, cursorStyle: vscode.TextEditorCursorStyle[cs] }
    }
  }

  if (IM.ccEnable) {
    let globalColorCustomizations = vscode.workspace.getConfiguration("workbench").inspect("colorCustomizations")
      ?.globalValue as any
    if (!globalColorCustomizations || globalColorCustomizations["editorCursor.foreground"] !== cc) {
      vscode.workspace
        .getConfiguration("workbench")
        .update(
          "colorCustomizations",
          { ...globalColorCustomizations, "editorCursor.foreground": cc, "terminalCursor.foreground": cc },
          vscode.ConfigurationTarget.Workspace
        )
    }
  }
}
