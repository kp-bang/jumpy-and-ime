import vscode from "vscode"

import { IMEnum } from "../../constants/im"
import globalStore from "../../store/global"
import chineseAndSpaceSwitch from "../../utils/hscopes/chinese-and-space-switch"
import chineseSwitchToChinese from "../../utils/hscopes/chinese-switch-to-chinese"
import englishAndDoubleSpaceSwitch from "../../utils/hscopes/english-and-double-space-switch"
import { switchIM } from "../../utils/im"
import { hscopesUpdateScopes$ } from "../hscopes"

const hscopesControlRun = () => {
  // 上下文变化，计算切换输入法
  hscopesUpdateScopes$.subscribe(async (params) => {
    const [addedScopes, deletedScopes, scopes] = params || []
    // console.log("%c [ allScopes ]-30", "font-size:13px; background:pink; color:#bf2c9f;", scopes)

    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const document = editor?.document
    const position = editor?.selections[0]?.active

    /**
     * 重新理解scopes和输入法的关系
     * 在代码中主体绝对是en，何时需要cn？
     * ——注释、string文案
     *
     * cn在源码中才是特例
     *
     * 在该程序中，scopes绝对是基座，是一切的起始
     * 在X scopes下就转为cn输入法，非x scopes下还原为en输入法是最简洁，最有用的
     * 所以正则特例生效的前提是建立在当前的注释、string scopes上的
     */

    // 特例，关注当前全量scopes
    if (globalStore.hscopes.matchSpecialScopes(scopes)) {
      // console.log("进特批")
      /**
       * 这应该是一个确定性的程序
       * 简单的使用正则判断光标附近的文本，判断应该使用什么输入法过于粗略
       * 还会产生双层设置问题，正则命中转换了，scopes变化命中再转换一次，会产生无法预料的结果
       *
       * 所以命中即退出
       */

      // 如果前一个字符是中文, 则切换cn输入法
      // console.log("chineseSwitchToChinese(document, position)", chineseSwitchToChinese(document, position))
      if (globalStore.hscopes.enableChineseSwitchToChinese && chineseSwitchToChinese(document, position)) {
        switchIM(IMEnum.CN)
        return
      }

      // 如果前两个字符是中文加空格, 则切en换输入法
      // console.log("chineseAndSpaceSwitch(document, position)", chineseAndSpaceSwitch(document, position))
      if (globalStore.hscopes.enableChineseAndSpaceSwitchToEnglish && chineseAndSpaceSwitch(document, position)) {
        switchIM(IMEnum.EN)
        return
      }

      // 英文加双空格, 则切换cn输入法
      // console.log("englishAndDoubleSpaceSwitch(document, position)", englishAndDoubleSpaceSwitch(document, position))
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

    // 用增量scopes来判断，在scopes不变的情况下不会反复设置cn
    if (globalStore.hscopes.matchCnScopes(addedScopes)) {
      // console.log("switchIMCN")
      switchIM(IMEnum.CN)
    } else {
      // 当前的scopes没有需要cn输入法的了
      if (!globalStore.hscopes.matchCnScopes(scopes) && !globalStore.hscopes.matchSpecialScopes(scopes)) {
        // console.log("switchIMEN")
        switchIM(IMEnum.EN)
      }
    }
  })
}

export default hscopesControlRun
