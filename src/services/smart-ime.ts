import vscode, { TextEditorCursorStyle } from "vscode"

import { chineseCharacterPattern } from "../constants/hscopes"
import { hscopesCursorMove$ } from "../event-source/hscopes"
import globalStore from "../store/global"

const smartImeService = (context: vscode.ExtensionContext) => {
  /**
   * 编辑文件切换，比如从 a.ts 切换到 b.ts
   * 检查文件内容，没有中文就停用smartIme
   */
  context.subscriptions.push(
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
  )

  /**
   * 用户切换了 光标样式（线条/块状）
   * vim模式下禁用
   */
  context.subscriptions.push(
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
  )

  // 光标移动
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((e) => {
      if (globalStore.smartIme.smartImeDisabled) return

      // 如果是选中了非空白字符, 则不处理
      if (!e.selections[0].isEmpty) return

      const editor = vscode.window.activeTextEditor
      if (!editor) return

      hscopesCursorMove$.next()
    })
  )

  // 当 VS Code 窗口的 焦点状态 发生改变时。
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState((e: vscode.WindowState) => {
      if (!e.focused) return

      hscopesCursorMove$.next()
    })
  )
}

export default smartImeService
