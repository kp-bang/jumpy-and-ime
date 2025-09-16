import _ from "lodash"

// 维护当前光标处的scopes
let scopes: string[] = []

const splitScopes = (curScopes: string[]) => {
  const intersectScopes = _.intersection(scopes, curScopes)
  const deletedScopes = _.difference(scopes, intersectScopes)
  const addedScopes = _.difference(curScopes, intersectScopes)

  scopes = curScopes

  return [deletedScopes, addedScopes]
}

export default splitScopes
