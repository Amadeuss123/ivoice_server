import path from 'path';
import fs from 'fs';

/**
 * 按行保存
 * @param content 要保存的内容，一般是数组形式
 * @param filePath 保存路径
 */
export function saveFile(content: any, filePath: string) {

}
/**
 * 按行读取
 * @param filePath 读取文件路径
 */
export function readFile(filePath: string) {

}

export function getProjectRootDir() {
  return path.resolve(__dirname, '../', '../');
}

export function isFileExists(...filePathList: string[]) {
  const projectRootDir = getProjectRootDir();
  const fileAbsolutePath = path.resolve(projectRootDir, ...filePathList);
  return fs.existsSync(fileAbsolutePath);
}
