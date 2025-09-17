import _ from "lodash"

import { getConfiguration } from "./utils"

export interface JumpyConfiguration {
  jumpyEnable: boolean
  movingStepLength: number
  wordRegexp: string
  maxCodeCount: number
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
    "darkThemeBackground",
    "darkThemeForeground",
    "lightThemeBackground",
    "lightThemeForeground"
  ])
}
