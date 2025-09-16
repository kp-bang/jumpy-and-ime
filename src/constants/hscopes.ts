export const chineseCharacterPattern = /[^\x00-\xff]/

// 如“你 ”
export const chineseAndSpaceSwitchToEnglishPattern = /^[^\x00-\xff] $/
// 如 “a  ”
export const englishAndDoubleSpaceSwitchToChinesePattern = /[a-zA-Z$@_]  $/
