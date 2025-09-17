import _ from "lodash"
import vscode from "vscode"

import { extendsName } from "../constants/common"

export const getConfiguration = <T>(keys: string[]): T => {
  const configuration = vscode.workspace.getConfiguration(extendsName)
  return _.chain(keys)
    .map((key) => [key, configuration.get(key)])
    .fromPairs()
    .value() as T
}

export const getEditorConfig = () => {
  const editorConfig = vscode.workspace.getConfiguration("editor")
  return {
    fontFamily: editorConfig.get<string>("fontFamily")!,
    fontSize: editorConfig.get<number>("fontSize") || 14
  }
}
