import { HexMap } from "./constants";

const generateRandomNum = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generateRandomHexNum = () => {
  const length = 20;
  const hexNum = [];
  for(let i = 0; i < length; i++) {
    hexNum.push(HexMap[Math.floor(Math.random() * 16)]);
  }

  return hexNum.join('');
}

const xorHex = (str1: string, str2: string) => {
  const byteA = hexToBytes(str1);
  const byteB = hexToBytes(str2);
  const result = [];
  for(let i = 0; i < byteA.length; i++) {
    result.push(byteA[i] ^ byteB[i]);
  }
  return bytesToHex(result);

}

// Note: implementation from crypto-js
// Convert a hex string to a byte array
const hexToBytes = (hex: string) => {
  hex = hex.toString();
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substring(c, c + 2), 16));
  }
  return bytes;
}

// Convert a byte array to a hex string
const bytesToHex = (bytes: number[]) => {
  for (var hex = [], i = 0; i < bytes.length; i++) {
      var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xF).toString(16));
  }
  return hex.join("");
}


export {
  generateRandomNum,
  generateRandomHexNum,
  xorHex,
};

