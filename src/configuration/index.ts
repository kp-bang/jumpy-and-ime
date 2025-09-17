import vscode from "vscode"
import _ from "lodash"
import { action, makeObservable } from "mobx"

import { getJumpyConfiguration } from "./jumpy"
import { getEditorConfig } from "./utils"
import { getImConfiguration } from "./im"
import { getSmartIMEConfiguration } from "./smart-ime"
import { extendsName } from "../constants/common"

class Configuration {
  editorConfig = getEditorConfig()
  jumpy = getJumpyConfiguration()
  im = getImConfiguration()
  smartIme = getSmartIMEConfiguration()

  constructor() {
    makeObservable(this)
  }

  @action
  private update() {
    this.editorConfig = getEditorConfig()
    this.jumpy = getJumpyConfiguration()
    this.im = getImConfiguration()
    this.smartIme = getSmartIMEConfiguration()
  }

  setContext(context: vscode.ExtensionContext) {
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (!e.affectsConfiguration(extendsName)) return

        this.update()
      })
    )
  }
}

const configuration = new Configuration()

export default configuration
