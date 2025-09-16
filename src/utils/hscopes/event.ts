import _ from "lodash"

import { hscopesUpdateScopes$ } from "../../event-source/hscopes"

class HscopesEvent {
  private scopes: string[] = []

  cursorMoveHandle(curScopes: string[]) {
    const intersectScopes = _.intersection(this.scopes, curScopes)
    const deletedScopes = _.difference(this.scopes, intersectScopes)
    const addedScopes = _.difference(curScopes, intersectScopes)

    this.scopes = curScopes

    hscopesUpdateScopes$.next([addedScopes, deletedScopes, this.scopes])
  }
}

const hscopesEvent = new HscopesEvent()

export default hscopesEvent
