import _ from "lodash"
import vscode from "vscode"
import { Registry } from "vscode-textmate"

import DocumentController from "../utils/hscopes/document-controller"

class HscopesStore {
  documentsMap = new Map<vscode.Uri, DocumentController>()

  registry: Registry | undefined

  // 检测到中文时切换输入法到中文
  enableChineseSwitchToChinese = true
  // 检测到中文时切换输入法到中文的触发间隔
  // enableChineseSwitchToChineseInterval = 2000
  // 检测到中文+空格时切换输入法到英文
  enableChineseAndSpaceSwitchToEnglish = true
  // 检测到当前行前有中文，且光标前是非中文+双空格时切换输入法到中文并删掉一个空格
  enableEnglishAndDoubleSpaceSwitchToChinese = true

  // 进入特判的scopes
  private specialScopes = ["comment", "string"]

  // 明确要跳转到cn的scopes
  private cnScopes = ["comment"]

  private baseMatch(targetScopes: string[], changedScopes?: string[]) {
    return (
      _.intersectionWith(targetScopes, changedScopes || [], (targetScope, enterScope) =>
        enterScope.startsWith(targetScope)
      ).length > 0
    )
  }

  matchSpecialScopes(curScopes?: string[]) {
    return this.baseMatch(this.specialScopes, curScopes)
  }

  matchCnScopes(curScopes?: string[]) {
    return this.baseMatch(this.cnScopes, curScopes)
  }
}

export default HscopesStore
