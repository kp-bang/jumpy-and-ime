import _ from "lodash"
import vscode from "vscode"
import { Registry } from "vscode-textmate"

import DocumentController from "../utils/hscopes/document-controller"

class HscopesStore {
  documentsMap = new Map<vscode.Uri, DocumentController>()

  registry: Registry | undefined
}

export default HscopesStore
