import fs from "fs"
import _ from "lodash"
import { map, timer } from "rxjs"
import vscode from "vscode"

import { extendsName } from "../constants/common"
import { darkDataUriCache, decorationType, lightDataUriCache, twoLetterSequence } from "../constants/jumpy"
import globalStore from "../store/global"
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

  // 判断相邻的decoration是否有交叉
  const judgeIntersection = (left: vscode.DecorationOptions, right: vscode.DecorationOptions) => {
    const leftStart = left.range.start
    const rightStart = right.range.start
    if (leftStart.line !== rightStart.line) return false
    if (rightStart.character - leftStart.character <= 3) return true
    return false
  }

  // 筛选出有交叉部分的dec，只把有重叠部分的dec闪烁显示
  const [fixedDecorations, mixedDecorations] = _.partition(decorations, (d) => {
    const preD = decorations[d.index - 1]
    const nextD = decorations[d.index + 1]

    if (d.index === 0) {
      return !judgeIntersection(d, nextD)
    }

    if (d.index === decorations.length - 1) {
      return !judgeIntersection(preD, d)
    }

    return !judgeIntersection(preD, d) && !judgeIntersection(d, nextD)
  })

  // 防重叠闪烁
  const rerender$ = timer(0, 1000).pipe(
    map((count) => {
      return [
        ...fixedDecorations,
        ...mixedDecorations.filter((_, index) => {
          return count % 2 === index % 2
        })
      ]
    })
  )
  const rerenderSubscript = rerender$.subscribe((decorations) => {
    editor?.setDecorations(decorationType, decorations)
  })

  globalStore.jumpy.subscriptions.push(() => rerenderSubscript.unsubscribe())

  return decorations
}

export default jumpyTextDecorationsService
