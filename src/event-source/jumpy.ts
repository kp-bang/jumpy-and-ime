import { Subject } from "rxjs"
import vscode from "vscode"

// jumpy模式进入事件源
export const jumpyJumpyEnter$ = new Subject<(vscode.DecorationOptions & { index: number; code: string })[]>()

// jumpy模式退出事件源
export const jumpyJumpyExit$ = new Subject<void>()

// jumpy跳转代码输入完成
export const jumpyJumpCodeComplete$ = new Subject<
  (vscode.DecorationOptions & { index: number; code: string }) | undefined
>()
