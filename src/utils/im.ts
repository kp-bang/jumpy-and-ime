import { close, DataType, define, open } from "ffi-rs"

import { IMEnum } from "../constants/im"
import { setCursor } from "./cursor"

const dll = define({
  MessageBoxW: {
    library: "user32",
    retType: DataType.I32,
    paramsType: [DataType.I32, DataType.U8Array, DataType.U8Array, DataType.I32],
    freeResultMemory: true
  },
  SendMessageW: {
    library: "user32",
    retType: DataType.I32,
    paramsType: [DataType.I32, DataType.I32, DataType.I32, DataType.I32]
  },
  GetForegroundWindow: {
    library: "user32",
    retType: DataType.I32,
    paramsType: []
  },
  ImmGetDefaultIMEWnd: {
    library: "imm32",
    retType: DataType.I32,
    paramsType: [DataType.I32]
  }
})

let currentIME: IMEnum
export const switchIM = (type: IMEnum) => {
  if (currentIME === type) {
    console.log("switchIM不变")
    return
  }
  currentIME = type
  open({
    library: "user32",
    path: "user32"
  })

  open({
    library: "imm32",
    path: "imm32"
  })

  var hwnd = dll.GetForegroundWindow([])

  var defaultIMEWnd = dll.ImmGetDefaultIMEWnd([hwnd])
  dll.SendMessageW([defaultIMEWnd, 0x283, 0x002, type])

  close("user32")
  close("imm32")

  setCursor(type)
}

const dll2 = define({
  SendMessageW: {
    library: "user32",
    retType: DataType.I32,
    paramsType: [DataType.I32, DataType.I32, DataType.I32]
  }
})

// 修改第三个参数为0x001就可以查询当前输入法的中英文状态了
export const obtainIM = () => {
  open({
    library: "user32",
    path: "user32"
  })

  open({
    library: "imm32",
    path: "imm32"
  })

  var hwnd = dll.GetForegroundWindow([])
  var defaultIMEWnd = dll.ImmGetDefaultIMEWnd([hwnd])
  /**
   * https://learn.microsoft.com/en-us/previous-versions/windows/embedded/ms905959(v=msdn.10)
   * 0x001，即IMC_GETCONVERSIONMODE
   * 此消息由应用程序发送到 IME 窗口以获取当前转换模式。该窗口从当前 input 上下文中检索当前 conversion mode。
   */
  const result = dll2.SendMessageW([defaultIMEWnd, 0x283, 0x001])

  close("user32")
  close("imm32")

  return result
}
