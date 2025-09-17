import { filter, Subject } from "rxjs"
import vscode from "vscode"

import configuration from "../configuration"
import globalStore from "../store/global"

export const jumpyWordCommand$ = new Subject<void>()
// jumpy模式进入事件源
export const jumpyJumpyEnter$ = jumpyWordCommand$.pipe(
  filter(() => configuration.jumpy.jumpyEnable && !globalStore.jumpy.isJumpyMode)
)

export const jumpyJumpWordCommittedUpdate$ = new Subject<string>()
export const jumpyEscape$ = new Subject<void>()

// jumpy模式退出事件源
export const jumpyJumpyExit$ = new Subject<void>()

// jumpy跳转代码输入完成
export const jumpyJumpCodeComplete$ = new Subject<
  (vscode.DecorationOptions & { index: number; code: string }) | undefined
>()
