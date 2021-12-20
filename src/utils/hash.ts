import { xorHex } from "./number";
import SHA1 from "crypto-js/sha1";

/**
 * 
 * @param inComingPassword 客户端传来的经过算法加密后的密码
 * @param storePassword 存储在数据库中的经过两次hash的密码
 * @param verifiedNum 服务器之前返回的随机验证码
 * @returns 
 */
export function comparePassword(inComingPassword: string, storePassword: string, verifiedNum: string) {
  const xorResult = inComingPassword.slice(0, 40);
  const onceHashPassword = xorHex(xorResult, SHA1(verifiedNum).toString());

  return SHA1(onceHashPassword).toString() === storePassword && inComingPassword.slice(40) === storePassword;
}