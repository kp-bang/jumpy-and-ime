import fs from "fs"
import _ from "lodash"
import { map, timer } from "rxjs"
import vscode from "vscode"

import { extendsName } from "../constants/common"
import { darkDataUriCache, decorationType, lightDataUriCache, twoLetterSequence } from "../constants/jumpy"
import { jumpyJumpyExit$ } from "../event-source/jumpy"
import { getVisibleLines } from "../utils/lines"

interface JumpyPosition {
  code: string
  // 行数
  line: number
  // 单词分割起始处
  startCharacter: number
}

const jumpyTextDecorationsService = (context: vscode.ExtensionContext) => {
  const editor = vscode.window.activeTextEditor

  const lines = getVisibleLines(editor!)

  const configuration = vscode.workspace.getConfiguration(extendsName)
  // const defaultRegexp = "\\w{2,}" // TODO:
  const defaultRegexp = fs.readFileSync(
    `C:\\Users\\Lizhixian\\Desktop\\myself\\jumpy-and-ime\\src\\services\\regexp-text.txt`,
    "utf8"
  )

  const wordRegexp = configuration ? configuration.get<string>("wordRegexp", defaultRegexp) : defaultRegexp
  const regexp = new RegExp(wordRegexp, "g")

  const splitWords = _.chain(lines)
    .map(({ line, text }) => {
      const positions: Omit<JumpyPosition, "code">[] = []

      let word = regexp.exec(text)
      while (!!word) {
        positions.push({
          line,
          startCharacter: word.index
        })
        word = regexp.exec(text)
      }

      return positions
    })
    .flatten()
    .value()

  const decorations = _.chain(Array.from({ length: Math.min(twoLetterSequence.length, splitWords.length) }))
    .map<vscode.DecorationOptions & { index: number; code: string }>((_undefined, index) => {
      const code = twoLetterSequence[index]
      const { line, startCharacter } = splitWords[index]
      return {
        index,
        code,
        range: new vscode.Range(line, startCharacter, line, startCharacter + code.length),
        renderOptions: {
          dark: {
            after: {
              // color: "black",
              // backgroundColor: "#d4d4d8",
              // contentText: code
              contentIconPath: darkDataUriCache[code]
            }
          },
          light: {
            after: {
              // color: "white",
              // backgroundColor: "black",
              // contentText: code
              contentIconPath: lightDataUriCache[code]
            }
          }
        }
      }
    })
    .value()
  console.log("%c [ decorations ]-81", "font-size:13px; background:pink; color:#bf2c9f;", decorations)

  const [evenDecorations, oddDecorations] = _.partition(decorations, (d) => d.index % 2 === 0)

  // 防重叠闪烁
  const rerender$ = timer(0, 1000).pipe(
    map((count) => {
      if (count % 2 === 0) return evenDecorations
      return oddDecorations
    })
  )
  const rerenderSubscript = rerender$.subscribe((decorations) => {
    editor?.setDecorations(decorationType, decorations)
  })

  // 退出清空
  const jumpyJumpyExitSubscript = jumpyJumpyExit$.subscribe(() => {
    editor?.setDecorations(decorationType, [])
    rerenderSubscript.unsubscribe()
    jumpyJumpyExitSubscript.unsubscribe()
  })

  return decorations
}

export default jumpyTextDecorationsService
