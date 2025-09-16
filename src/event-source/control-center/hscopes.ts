import vscode from "vscode"

import { IMEnum } from "../../constants/im"
import globalStore from "../../store/global"
import chineseAndSpaceSwitch from "../../utils/hscopes/chinese-and-space-switch"
import chineseSwitchToChinese from "../../utils/hscopes/chinese-switch-to-chinese"
import englishAndDoubleSpaceSwitch from "../../utils/hscopes/english-and-double-space-switch"
import hscopesEvent from "../../utils/hscopes/event"
import getScopeAt from "../../utils/hscopes/get-scope-at"
import { switchIM } from "../../utils/im"
import { hscopesCursorMove$, hscopesUpdateScopes$ } from "../hscopes"

const hscopesControlRun = () => {
  // 光标移动导致上下文变化
  hscopesCursorMove$.subscribe(() => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const document = editor?.document
    const position = editor?.selections[0]?.active

    const token = getScopeAt(document, position)
    if (!token) return
    hscopesEvent.cursorMoveHandle(token.scopes)
  })

  // 上下文变化，计算切换输入法
  hscopesUpdateScopes$.subscribe(async (scopes) => {
    const [enterScopes, leaveScopes, allScopes] = scopes
    console.log("%c [ allScopes ]-30", "font-size:13px; background:pink; color:#bf2c9f;", allScopes)

    /**
     * 这应该是一个确定性的程序
     * 简单的使用正则判断光标附近的文本，判断应该使用什么输入法过于粗略
     * 还会产生双层设置问题，正则命中转换了，scopes变化命中再转换一次
     * 会产生无法预料的结果
     *
     * 所以正则特例生效的前提是建立在当前的scopes上
     */

    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const document = editor?.document
    const position = editor?.selections[0]?.active

    const conditions = [
      "string.template.tsx",
      "string.quoted.single.tsx",
      "string.quoted.double.tsx",
      "comment.line.double-slash.tsx",
      "comment.block.documentation.tsx"
    ]

    if (conditions.some((condition) => allScopes.includes(condition))) {
      console.log("特别情况")
      // 如果前一个字符是中文, 则切换输入法
      if (globalStore.hscopes.enableChineseSwitchToChinese && chineseSwitchToChinese(document, position)) {
        switchIM(IMEnum.CN)
        return
      }
      // 如果前两个字符是中文加空格, 则切换输入法
      if (globalStore.hscopes.enableChineseAndSpaceSwitchToEnglish && chineseAndSpaceSwitch(document, position)) {
        switchIM(IMEnum.EN)
        return
      }
      // 英文加双空格, 则切换输入法
      if (
        globalStore.hscopes.enableEnglishAndDoubleSpaceSwitchToChinese &&
        englishAndDoubleSpaceSwitch(document, position)
      ) {
        const deleteRange = new vscode.Range(position.translate(0, -1), position)
        await vscode.window.activeTextEditor?.edit((editBuilder) => {
          editBuilder.delete(deleteRange)
        })
        switchIM(IMEnum.CN)
        return
      }
    }

    // 只有一个scope，同一时间针对一种情况
    if (globalStore.hscopes.matchEnterSwitchToChinese(enterScopes)) {
      switchIM(IMEnum.CN)
    } else if (globalStore.hscopes.matchEnterSwitchToEnglish(enterScopes)) {
      console.log("matchEnterSwitchToEnglish")
      switchIM(IMEnum.EN)
    } else if (globalStore.hscopes.matchLeaveSwitchToChinese(leaveScopes)) {
      console.log("matchLeaveSwitchToChinese")
      switchIM(IMEnum.CN)
    } else if (globalStore.hscopes.matchLeaveSwitchToEnglish(leaveScopes)) {
      switchIM(IMEnum.EN)
    }
  })
}

export default hscopesControlRun
