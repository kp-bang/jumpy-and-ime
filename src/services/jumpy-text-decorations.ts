import _ from "lodash"
import { combineLatest, map, startWith, timer } from "rxjs"
import vscode from "vscode"

import configuration from "../configuration"
import jumpyConstants from "../constants/jumpy"
import { jumpyJumpWordCommittedUpdate$ } from "../event-source/jumpy"
import globalStore from "../store/global"
import { getVisibleLines } from "../utils/lines"

interface JumpyPosition {
  code: string
  // 行数
  line: number
  // 单词分割起始处
  startCharacter: number
}

const jumpyTextDecorationsService = () => {
  const editor = vscode.window.activeTextEditor

  const lines = getVisibleLines(editor!)

  const wordRegexp = configuration.jumpy.wordRegexp || "\\w{2,}"
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

  const { twoLetterSequence, darkDataUriCache, lightDataUriCache } = jumpyConstants

  const allDecorations = _.chain(Array.from({ length: Math.min(twoLetterSequence.length, splitWords.length) }))
    .map<vscode.DecorationOptions & { index: number; filterIndex: number; code: string }>((_undefined, index) => {
      const code = twoLetterSequence[index]
      const { line, startCharacter } = splitWords[index]
      return {
        index, // 混合的部分，根据奇偶来错开展示
        filterIndex: index,
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

  // 根据jumpWordCommitted过滤掉多余的快捷代码展示
  const filterDecorations$ = jumpyJumpWordCommittedUpdate$.pipe(
    startWith(""),
    map((jumpWordCommitted) => {
      return allDecorations
        .filter((decoration) => {
          if (jumpWordCommitted) {
            return decoration.code.startsWith(jumpWordCommitted)
          }
          return true
        })
        .map((decoration, index) => {
          decoration.filterIndex = index // 更新filterIndex
          return decoration
        })
    })
  )

  // 防重叠闪烁
  const rerender$ = combineLatest([timer(0, 1000), filterDecorations$]).pipe(
    map(([count, filterDecorations]) => {
      // 筛选出有交叉部分的dec，只把有重叠部分的dec闪烁显示
      const [fixedDecorations, mixedDecorations] = _.partition(filterDecorations, (d) => {
        const preD = filterDecorations[d.filterIndex - 1]
        const nextD = filterDecorations[d.filterIndex + 1]

        if (d.filterIndex === 0) {
          return !judgeIntersection(d, nextD)
        }

        if (d.filterIndex === filterDecorations.length - 1) {
          return !judgeIntersection(preD, d)
        }

        return !judgeIntersection(preD, d) && !judgeIntersection(d, nextD)
      })

      return [
        ...fixedDecorations,
        ...mixedDecorations.filter((_, index) => {
          return count % 2 === index % 2
        })
      ]
    })
  )
  const rerenderSubscript = rerender$.subscribe((decorations) => {
    editor?.setDecorations(jumpyConstants.decorationType, decorations)
  })

  globalStore.jumpy.subscriptions.push(() => rerenderSubscript.unsubscribe())

  return allDecorations
}

export default jumpyTextDecorationsService
