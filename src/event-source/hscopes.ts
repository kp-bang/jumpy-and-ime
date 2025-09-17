import { filter, map, Subject } from "rxjs"
import vscode from "vscode"

import configuration from "../configuration"
import globalStore from "../store/global"
import getScopeAt from "../utils/hscopes/get-scope-at"
import splitScopes from "../utils/hscopes/splite-scopes"

// 光标移动、变化，可以计算当前scopes
export const hscopesCursorMove$ = new Subject<void>()

// 特别的定制情况，统一走事件
// 前一个是中文，当前不是拼音输入法，则转成拼音输入法
export const hscopesPreChChar$ = new Subject<void>()
// 前两个字符是中文+空格，当前不是英文输入法，则转成英文输入法
export const hscopesPreChCharSpace$ = new Subject<void>()
// 前两个自发是英文+2空格，当前不是拼音输入法，则转成拼音输入法
export const hscopesPreEnCharSpaceSpace$ = new Subject<void>()

// 最新的scopes，依次是enterScopes，leaveScopes和当前scopes
export const hscopesUpdateScopes$ = hscopesCursorMove$.pipe(
  filter(
    () =>
      configuration.smartIme.smartImeEnable && !globalStore.jumpy.isJumpyMode && !globalStore.smartIme.smartImeDisabled
  ),
  map<void, undefined | [string[], string[], string[]]>(() => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const document = editor?.document
    const position = editor?.selections[0]?.active

    const token = getScopeAt(document, position)
    if (!token) return
    const [deletedScopes, addedScopes] = splitScopes(token.scopes)

    return [addedScopes, deletedScopes, token.scopes]
  })
)
