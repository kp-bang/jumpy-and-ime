import _ from "lodash"

import { getConfiguration } from "./utils"

interface SmartImeConfiguration {
  smartImeEnable: boolean
  warnDisabled: boolean
  disabledOnEnglishTextOverN: number
  enterScopesFurtherMatch: string
  enableMatchCnCursorToCn: boolean
  enableMatchCnSpaceCursorToEn: boolean
  enableMatchEnDoubleSpaceCursorToCn: boolean
  enterScopesToCnMatch: string
}

export const getSmartIMEConfiguration = () => {
  return getConfiguration<SmartImeConfiguration>([
    "smartImeEnable",
    "warnDisabled",
    "disabledOnEnglishTextOverN",
    "enterScopesFurtherMatch",
    "enableMatchCnCursorToCn",
    "enableMatchCnSpaceCursorToEn",
    "enableMatchEnDoubleSpaceCursorToCn",
    "enterScopesToCnMatch"
  ])
}
