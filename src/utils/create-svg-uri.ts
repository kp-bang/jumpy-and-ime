import vscode from "vscode"

export interface Decoration {
  bgColor: string
  fgColor: string
  fontFamily: string
  fontSize: number
}

export const getSvgDataUri = (code: string, dec: Decoration) => {
  const width = dec.fontSize + 4
  const height = dec.fontSize + 0

  // prettier-ignore
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${dec.fontSize}" height="${height}" width="${width}">`;
  // prettier-ignore
  svg += `<rect width="${width}" height="${height}" rx="4" ry="4" style="fill: ${dec.bgColor};"></rect>`;
  // prettier-ignore
  svg += `<text font-family="${dec.fontFamily}" font-size="${dec.fontSize}px" textLength="${width - 2}" textAdjust="spacing" fill="${dec.fgColor}" x="1" y="${dec.fontSize - 2}" alignment-baseline="baseline">`;
  svg += code
  svg += `</text></svg>`

  return vscode.Uri.parse(`data:image/svg+xml;utf8,${svg}`)
}
