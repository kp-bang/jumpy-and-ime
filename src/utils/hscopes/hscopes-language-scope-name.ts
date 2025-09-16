import vscode from "vscode"

function getLanguageScopeName(languageId: string) {
  try {
    const languages = vscode.extensions.all
      .filter((x) => x.packageJSON?.contributes?.grammars)
      .reduce((a, b) => [...a, ...b.packageJSON.contributes.grammars], [] as any[])
    const matchingLanguages = languages.filter((g) => g.language === languageId)
    if (matchingLanguages.length > 0) {
      // console.info(`Mapping language ${languageId} to initial scope ${matchingLanguages[0].scopeName}`);
      return matchingLanguages[0].scopeName
    }
  } catch (err) {
    console.log("HyperScopes: Unable to get language scope name", err)
  }
  return undefined
}

export default getLanguageScopeName
