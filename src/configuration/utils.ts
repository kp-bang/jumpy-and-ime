import _ from "lodash"
import vscode from "vscode"

import { extendsName } from "../constants/common"

const configuration = vscode.workspace.getConfiguration(extendsName)

export const getConfiguration = <T>(keys: string[]): T =>
  _.chain(keys)
    .map((key) => [key, configuration.get(key)])
    .fromPairs()
    .value() as T

const editorConfig = vscode.workspace.getConfiguration("editor")

export const getEditorConfig = () => {
  return {
    fontFamily: editorConfig.get<string>("fontFamily")!,
    fontSize: editorConfig.get<number>("fontSize") || 14
  }
}
