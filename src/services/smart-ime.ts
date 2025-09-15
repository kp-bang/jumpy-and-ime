import vscode, { TextEditorCursorStyle } from "vscode"

import { chineseCharacterPattern } from "../constants/hscopes"
import globalStore from "../store/global"
import chineseAndSpaceSwitch from "../utils/hscopes/chinese-and-space-switch"
import chineseSwitchToChinese from "../utils/hscopes/chinese-switch-to-chinese"
import englishAndDoubleSpaceSwitch from "../utils/hscopes/english-and-double-space-switch"
import getScopeAt from "../utils/hscopes/get-scope-at"
import { handleScopesChange } from "../utils/hscopes/handle-scopes-change"

// 用于 scope 判断
const hscopes = vscode.extensions.getExtension("bang.hscopes-booster")
const smartImeService = (context: vscode.ExtensionContext) => {
  // 激活 hscopes
  hscopes?.activate()

  // 监听当前 editor 变化事件
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (!editor) return

    const document = editor.document
    const lineCount = document.lineCount

    // 判断当前文本内容是否有 DISABLE_SMART_IME
    for (let i = 0; i < lineCount; i++) {
      const lineText = document.lineAt(i).text
      if (lineText.includes("DISABLE_SMART_IME")) {
        globalStore.smartIme.smartImeDisabled = true

        if (globalStore.smartIme.warnDisabled) {
          vscode.window.showInformationMessage(
            "当前文档存在 DISABLE_SMART_IME 字符串，Smart IME 已禁用（可在设置中关闭提示）"
          )
        }
        return
      }
    }
    if (globalStore.smartIme.disabledOnEnglishTextOverN > 0) {
      // 一行一行地读取文本
      let count = 0
      let hasChinese = false
      for (let i = 0; i < lineCount; i++) {
        // 检测当前行是否有中文
        const lineText = document.lineAt(i).text
        if (!hasChinese && chineseCharacterPattern.test(lineText)) {
          hasChinese = true
          break
        }
        count += lineText.length
      }
      // 如果没有中文且字符数超过阈值, 则禁用
      if (!hasChinese && count > globalStore.smartIme.disabledOnEnglishTextOverN) {
        globalStore.smartIme.smartImeDisabled = true
        // 提示禁用
        if (globalStore.smartIme.warnDisabled) {
          vscode.window.showInformationMessage(
            `当前纯英文文档字符数超过 ${globalStore.smartIme.disabledOnEnglishTextOverN}，Smart IME 已禁用，加入中文字符后重新打开文档即可启用（可在设置中关闭提示）`
          )
        }
        return
      }
    }
    globalStore.smartIme.smartImeDisabled = false
  })

  // 在vim下禁用
  vscode.window.onDidChangeTextEditorOptions(async (e) => {
    if (globalStore.smartIme.disabledOnVim) {
      if (globalStore.smartIme.originalCursorStyle !== e.options.cursorStyle) {
        // normal模式，关闭smartIme
        if (e.options.cursorStyle === TextEditorCursorStyle.Block) {
          globalStore.smartIme.originalSmartImeDisabled = globalStore.smartIme.smartImeDisabled
          globalStore.smartIme.smartImeDisabled = true
        } else {
          globalStore.smartIme.smartImeDisabled = globalStore.smartIme.originalSmartImeDisabled
        }
        globalStore.smartIme.originalCursorStyle = e.options.cursorStyle
      }
    }
  })

  // 监听 vscode 光标变化事件
  vscode.window.onDidChangeTextEditorSelection((e) => {
    if (globalStore.smartIme.smartImeDisabled) return

    // 如果是选中了非空白字符, 则不处理
    if (!e.selections[0].isEmpty) return

    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const document = editor.document
    const position = e.selections[0].active
    // 如果前一个字符是中文, 则切换输入法
    if (globalStore.hscopes.enableChineseSwitchToChinese) {
      chineseSwitchToChinese(document, position)
    }
    // 如果前两个字符是中文加空格, 则切换输入法
    if (globalStore.hscopes.enableChineseAndSpaceSwitchToEnglish) {
      chineseAndSpaceSwitch(document, position)
    }
    // 英文加双空格, 则切换输入法
    if (globalStore.hscopes.enableEnglishAndDoubleSpaceSwitchToChinese) {
      englishAndDoubleSpaceSwitch(document, position)
    }

    const token = (
      hscopes?.exports as {
        getScopeAt(document: vscode.TextDocument, position: vscode.Position): any | null
      }
    ).getScopeAt(document, position)
    const start = Date.now()
    // const token = getScopeAt(document, position) // 本项目的很卡，待调试
    // console.log("%c [ token ]-103", "font-size:13px; background:pink; color:#bf2c9f;", Date.now() - start, token)
    if (!token) {
      return
    }
    handleScopesChange(token.scopes)
    setTimeout(() => {
      console.log('-----------------------')
    }, 0);
  })
}

export default smartImeService
