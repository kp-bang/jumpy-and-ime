import vscode from "vscode"

export function isVimOn() {
  return vscode.extensions.all.some((ext) => {
    return ext.id.includes("vim") && ext.isActive
  })
}
