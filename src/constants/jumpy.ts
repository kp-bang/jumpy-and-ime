import _, { range } from "lodash"
import vscode from "vscode"

import { getSvgDataUri } from "../utils/create-svg-uri"

// 快捷键字母组合，如aa、ab、ac到zx、zy、zz
export const twoLetterSequence = _.chain(range(97, 114))
  .map((i) => {
    const codes = range(97, 114).map((j) => {
      return `${String.fromCharCode(i)}${String.fromCharCode(j)}`
    })
    return codes
  })
  .flatten()
  .value()

const editorConfig = vscode.workspace.getConfiguration("editor")
const fontFamily = editorConfig.get<string>("fontFamily")!
const fontSize = editorConfig.get<number>("fontSize") || 14

const colors = {
  darkBgColor: "white",
  darkFgColor: "black",
  lightBgColor: "back",
  lightFgColor: "white"
}

const darkDecoration = {
  bgColor: colors.darkBgColor,
  fgColor: colors.darkFgColor,
  fontFamily: fontFamily,
  fontSize: fontSize
}
const lightDecoration = {
  bgColor: colors.lightBgColor,
  fgColor: colors.lightFgColor,
  fontFamily: fontFamily,
  fontSize: fontSize
}

export const [darkDataUriCache, lightDataUriCache] = _.chain([darkDecoration, lightDecoration])
  .map((decoration) => {
    return _.chain(twoLetterSequence)
      .map((code) => {
        return [code, getSvgDataUri(code, decoration)]
      })
      .fromPairs()
      .value()
  })
  .value()

const width = fontSize + 4
const height = fontSize + 4
const left = -width
// const right = -width // 使用负的margin把图片往左拉回去，这样就不会有实际占位，代码文本不会抖动

export const decorationType = vscode.window.createTextEditorDecorationType({
  after: {
    // margin: `0 ${right}px 0 0`,
    margin: `0 0 0 ${left}px`,
    height: `${height}px`,
    width: `${width}px`
  }
})
