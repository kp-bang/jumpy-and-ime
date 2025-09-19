import _ from "lodash"

import { getConfiguration } from "./utils"

export interface JumpyConfiguration {
  jumpyEnable: boolean
  movingStepLength: number
  wordRegexp: string
  maxCodeCount: number
  fontFamily: string
  fontSize: number
  darkThemeBackground: string
  darkThemeForeground: string
  lightThemeBackground: string
  lightThemeForeground: string
}

export const getJumpyConfiguration = () => {
  return getConfiguration<JumpyConfiguration>([
    "jumpyEnable",
    "movingStepLength",
    "wordRegexp",
    "maxCodeCount",
    "fontFamily",
    "fontSize",
    "darkThemeBackground",
    "darkThemeForeground",
    "lightThemeBackground",
    "lightThemeForeground"
  ])
}
