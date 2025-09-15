import { IMEnum } from "../../constants/im"
import globalStore from "../../store/global"
import { switchIM } from "../im"

export async function handleScopesChange(curScopes: string[]) {
  // 是否切换到中文的标记
  let isSwitch = false
  let isSwitchToChinese = false

  function getMatches(scopesSwitch: string[]): Record<string, boolean> {
    return scopesSwitch.reduce(
      (matches, scopePrefix) => {
        // 前缀匹配
        matches[scopePrefix] = curScopes.some((curScope) => curScope.startsWith(scopePrefix))
        return matches
      },
      {} as Record<string, boolean>
    )
  }
  let newLeaveScopesSwitchToChineseMatches = getMatches(globalStore.hscopes.leaveScopesSwitchToChinese)
  let newLeaveScopesSwitchToEnglishMatches = getMatches(globalStore.hscopes.leaveScopesSwitchToEnglish)
  let newEnterScopesSwitchToChineseMatches = getMatches(globalStore.hscopes.enterScopesSwitchToChinese)
  let newEnterScopesSwitchToEnglishMatches = getMatches(globalStore.hscopes.enterScopesSwitchToEnglish)

  const isLeaveScopesToChinese = globalStore.hscopes.leaveScopesSwitchToChinese.some(
    (scopePrefix) =>
      globalStore.hscopes.leaveScopesSwitchToChineseMatches[scopePrefix] &&
      !newLeaveScopesSwitchToChineseMatches[scopePrefix]
  )
  const isLeaveScopesToEnglish = globalStore.hscopes.leaveScopesSwitchToEnglish.some(
    (scopePrefix) =>
      globalStore.hscopes.leaveScopesSwitchToEnglishMatches[scopePrefix] &&
      !newLeaveScopesSwitchToEnglishMatches[scopePrefix]
  )
  const isEnterScopesToChinese = globalStore.hscopes.enterScopesSwitchToChinese.some(
    (scopePrefix) =>
      !globalStore.hscopes.enterScopesSwitchToChineseMatches[scopePrefix] &&
      newEnterScopesSwitchToChineseMatches[scopePrefix]
  )

  const isEnterScopesToEnglish = globalStore.hscopes.enterScopesSwitchToEnglish.some(
    (scopePrefix) =>
      !globalStore.hscopes.enterScopesSwitchToEnglishMatches[scopePrefix] &&
      newEnterScopesSwitchToEnglishMatches[scopePrefix]
  )

  globalStore.hscopes.leaveScopesSwitchToChineseMatches = newLeaveScopesSwitchToChineseMatches
  globalStore.hscopes.leaveScopesSwitchToEnglishMatches = newLeaveScopesSwitchToEnglishMatches
  globalStore.hscopes.enterScopesSwitchToChineseMatches = newEnterScopesSwitchToChineseMatches
  globalStore.hscopes.enterScopesSwitchToEnglishMatches = newEnterScopesSwitchToEnglishMatches

  if (isLeaveScopesToChinese) {
    isSwitch = true
    isSwitchToChinese = true
  }

  if (isLeaveScopesToEnglish) {
    isSwitch = true
    isSwitchToChinese = false
  }
  if (isEnterScopesToChinese) {
    isSwitch = true
    isSwitchToChinese = true
  }
  if (isEnterScopesToEnglish) {
    isSwitch = true
    isSwitchToChinese = false
  }
  if (isSwitch) {
    if (isSwitchToChinese) {
      switchIM(IMEnum.CN)
    } else {
      switchIM(IMEnum.EN)
    }
  }
}
