import _, { clamp, Dictionary, range } from "lodash"
import { autorun } from "mobx"
import vscode from "vscode"

import configuration from "../configuration"
import { getSvgDataUri } from "../utils/create-svg-uri"

class JumpyConstants {
  // 快捷键字母组合，如aa、ab、ac到zx、zy、zz
  twoLetterSequence!: string[]

  darkDataUriCache!: Dictionary<vscode.Uri>
  lightDataUriCache!: Dictionary<vscode.Uri>
  decorationType!: vscode.TextEditorDecorationType

  constructor() {
    autorun(() => {
      this.updateJumpyConstant()
    })
  }

  private updateJumpyConstant = () => {
    this.twoLetterSequence = _.chain(range(97, 123))
      .map((i) => {
        const codes = range(97, 123).map((j) => {
          return `${String.fromCharCode(i)}${String.fromCharCode(j)}`
        })
        return codes
      })
      .flatten()
      .take(clamp(configuration.jumpy.maxCodeCount, 26, 26 * 26))
      .value()

    const darkDecoration = {
      bgColor: configuration.jumpy.darkThemeBackground,
      fgColor: configuration.jumpy.darkThemeForeground,
      fontFamily: configuration.jumpy.fontFamily || configuration.editorConfig.fontFamily,
      fontSize: configuration.jumpy.fontSize || configuration.editorConfig.fontSize
    }
    const lightDecoration = {
      bgColor: configuration.jumpy.lightThemeBackground,
      fgColor: configuration.jumpy.lightThemeForeground,
      fontFamily: configuration.jumpy.fontFamily || configuration.editorConfig.fontFamily,
      fontSize: configuration.jumpy.fontSize || configuration.editorConfig.fontSize
    }

    ;[this.darkDataUriCache, this.lightDataUriCache] = _.chain([darkDecoration, lightDecoration])
      .map((decoration) => {
        return _.chain(this.twoLetterSequence)
          .map((code) => {
            return [code, getSvgDataUri(code, decoration)]
          })
          .fromPairs()
          .value()
      })
      .value()

    const width = configuration.editorConfig.fontSize + 4
    const height = configuration.editorConfig.fontSize + 4
    const left = -width // 使用负的margin把图片往左拉回去，这样就不会有实际占位，代码文本不会抖动

    this.decorationType = vscode.window.createTextEditorDecorationType({
      after: {
        // margin: `0 ${right}px 0 0`,
        margin: `0 0 0 ${left}px`,
        height: `${height}px`,
        width: `${width}px`
      }
    })
  }
}

const jumpyConstants = new JumpyConstants()

export default jumpyConstants
