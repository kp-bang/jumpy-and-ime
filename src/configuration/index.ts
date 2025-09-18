import _ from "lodash"
import { makeAutoObservable, reaction } from "mobx"
import vscode from "vscode"

import { extendsName } from "../constants/common"
import { IMEnum } from "../constants/im"
import { setCursor } from "../utils/cursor"
import { getImConfiguration } from "./im"
import { getJumpyConfiguration } from "./jumpy"
import { getSmartIMEConfiguration } from "./smart-ime"
import { getEditorConfig } from "./utils"

class Configuration {
  editorConfig = getEditorConfig()
  jumpy = getJumpyConfiguration()
  im = getImConfiguration()
  smartIme = getSmartIMEConfiguration()

  constructor() {
    makeAutoObservable(this)
  }

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

reaction(
  () => configuration.smartIme.smartImeEnable,
  (smartImeEnable) => {
    if (smartImeEnable) return

    // 从根本上关闭了smartIme功能，就把光标恢复默认状态
    setCursor(IMEnum.EN)
  }
)
