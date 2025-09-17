export const extendsName = "jumpy-and-ime"

export enum Commands {
  test = `${extendsName}.test`,
  jumpyWord = `${extendsName}.jumpy-word`,
  jumpyEscape = `${extendsName}.jumpy-escape`,
  jumpyExit = `${extendsName}.jumpy-exit`,
  jumpyUpLines = `${extendsName}.jumpy-up-lines`,
  jumpyDownLines = `${extendsName}.jumpy-down-lines`
}

export enum Context {
  isJumpyMode = `${extendsName}.isJumpyMode`
}
