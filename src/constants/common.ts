export const extendsName = "jumpy-and-ime"

export enum Commands {
  test = `${extendsName}.test`,
  jumpyWord = `${extendsName}.jumpy-word`,
  jumpyExit = `${extendsName}.jumpy-exit`,
  jumpyUp5lines = `${extendsName}.jumpy-up-5lines`,
  jumpyDown5lines = `${extendsName}.jumpy-down-5lines`
}

export enum Context {
  isJumpyMode = `${extendsName}.isJumpyMode`
}
