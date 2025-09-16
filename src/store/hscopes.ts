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

  // 进入某些 scopes 时切换输入法到中文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  private enterScopesSwitchToChinese = ["comment"] as string[]
  // 进入某些 scopes 时切换输入法到英文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  private enterScopesSwitchToEnglish = ["markup.math", "meta.math"] as string[]
  // 离开某些 scopes 时切换输入法到中文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  private leaveScopesSwitchToChinese = ["markup.math", "meta.math"] as string[]
  // 离开某些 scopes 时切换输入法到英文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  private leaveScopesSwitchToEnglish = ["comment", "string"] as string[]

  private baseMatch(targetScopes: string[], changedScopes: string[]) {
    return (
      _.intersectionWith(targetScopes, changedScopes, (targetScope, enterScope) => enterScope.startsWith(targetScope))
        .length > 0
    )
  }

  matchEnterSwitchToChinese(enterScopes: string[]) {
    return this.baseMatch(this.enterScopesSwitchToChinese, enterScopes)
  }

  matchEnterSwitchToEnglish(enterScopes: string[]) {
    return this.baseMatch(this.enterScopesSwitchToEnglish, enterScopes)
  }

  matchLeaveSwitchToChinese(leaveScopes: string[]) {
    return this.baseMatch(this.leaveScopesSwitchToChinese, leaveScopes)
  }

  matchLeaveSwitchToEnglish(leaveScopes: string[]) {
    return this.baseMatch(this.leaveScopesSwitchToEnglish, leaveScopes)
  }
}

export default HscopesStore
