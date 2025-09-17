import _ from "lodash"
import vscode from "vscode"

import { getConfiguration } from "./utils"

type CS = keyof typeof vscode.TextEditorCursorStyle

interface ImConfiguration {
  "cursorStyle.enable": boolean
  "cursorStyle.English": CS
  "cursorStyle.Chinese": CS
  "cursorColor.enable": boolean
  "cursorColor.English": string
  "cursorColor.Chinese": string
}

export const getImConfiguration = () => {
  return getConfiguration<ImConfiguration>([
    "cursorStyle.enable",
    "cursorStyle.English",
    "cursorStyle.Chinese",
    "cursorColor.enable",
    "cursorColor.English",
    "cursorColor.Chinese"
  ])
}
