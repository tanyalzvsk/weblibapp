function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function generateRandomColorLight(): string {
  var r = Math.floor(Math.random() * 120);
  var g = Math.floor(Math.random() * 120);
  var b = Math.floor(Math.random() * 120);

  var hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  const possibleColors = ['#2B1313CC', '#4B4B4BE6', '#6F1E51CC'];

  return possibleColors[Math.floor(Math.random() * possibleColors.length)];

  return hex;
}


export function generateRandomColorDark(): string {
  var r = Math.floor(Math.random() * 120);
  var g = Math.floor(Math.random() * 120);
  var b = Math.floor(Math.random() * 120);

  var hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  const possibleColors = ['#fd79a866', '#a29bfe66', '#fab1a066'];

  return possibleColors[Math.floor(Math.random() * possibleColors.length)];

  return hex;
}
