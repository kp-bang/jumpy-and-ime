import vscode from "vscode"

import configuration from "../configuration"
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
      if (!configuration.smartIme.smartImeEnable || !editor) return

      const document = editor.document
      const lineCount = document.lineCount

      // 判断当前文本内容是否有 DISABLE_SMART_IME
      for (let i = 0; i < lineCount; i++) {
        const lineText = document.lineAt(i).text
        if (lineText.includes("DISABLE_SMART_IME")) {
          globalStore.smartIme.smartImeDisabled = true

          if (configuration.smartIme.warnDisabled) {
            vscode.window.showInformationMessage(
              "当前文档存在 DISABLE_SMART_IME 字符串，Smart IME 已禁用（可在设置中关闭提示）"
            )
          }
          return
        }
      }
      if (configuration.smartIme.disabledOnEnglishTextOverN > 0) {
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
        if (!hasChinese && count > configuration.smartIme.disabledOnEnglishTextOverN) {
          globalStore.smartIme.smartImeDisabled = true
          // 提示禁用
          if (configuration.smartIme.warnDisabled) {
            vscode.window.showInformationMessage(
              `当前纯英文文档字符数超过 ${configuration.smartIme.disabledOnEnglishTextOverN}，Smart IME 已禁用，加入中文字符后重新打开文档即可启用（可在设置中关闭提示）`
            )
          }
          return
        }
      }
      globalStore.smartIme.smartImeDisabled = false
    })
  )

  // 光标移动
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((e) => {
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
