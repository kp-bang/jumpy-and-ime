import _ from "lodash"

/**
 *
 * @param scopes 存储的scopes
 * @param curScopes 当前更新的scopes
 * @returns 删除的，和增加的scopes
 */
const splitScopes = (scopes: string[], curScopes: string[]) => {
  const intersectScopes = _.intersection(scopes, curScopes)
  const deletedScopes = _.difference(scopes, intersectScopes)
  const addedScopes = _.difference(curScopes, intersectScopes)

  return { deletedScopes, addedScopes }
}

export default splitScopes
