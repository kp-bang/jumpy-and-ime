import vscode from "vscode"
import { Registry } from "vscode-textmate"

import DocumentController from "../utils/hscopes/document-controller"

class HscopesStore {
  documentsMap = new Map<vscode.Uri, DocumentController>()

  registry: Registry | undefined

  // 检测到中文时切换输入法到中文
  enableChineseSwitchToChinese = true
  // 检测到中文时切换输入法到中文的触发间隔
  enableChineseSwitchToChineseInterval = 2000
  // 检测到中文+空格时切换输入法到英文
  enableChineseAndSpaceSwitchToEnglish = true
  // 检测到当前行前有中文，且光标前是非中文+双空格时切换输入法到中文并删掉一个空格
  enableEnglishAndDoubleSpaceSwitchToChinese = false
  // 进入某些 scopes 时切换输入法到中文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  enterScopesSwitchToChinese = ["comment"] as string[]
  // 进入某些 scopes 时切换输入法到英文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  enterScopesSwitchToEnglish = ["markup.math", "meta.math"] as string[]
  // 离开某些 scopes 时切换输入法到中文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  leaveScopesSwitchToChinese = ["markup.math", "meta.math"] as string[]
  // 离开某些 scopes 时切换输入法到英文，用逗号分割，前缀匹配，例如 `comment,string` 就可以匹配 Python 的 `comment.line.number-sign.python`（注释）和 `string.quoted.single.python`（字符串），请使用 `Developer: Inspect Editor Tokens and Scopes` 命令查看 scopes
  leaveScopesSwitchToEnglish = ["comment", "string"] as string[]

  // 变化
  enterScopesSwitchToChineseMatches = {} as Record<string, boolean>
  enterScopesSwitchToEnglishMatches = {} as Record<string, boolean>
  leaveScopesSwitchToChineseMatches = {} as Record<string, boolean>
  leaveScopesSwitchToEnglishMatches = {} as Record<string, boolean>
}

export default HscopesStore
