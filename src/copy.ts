import fs from 'fs';
import { promisify } from 'util';

const copyFile = promisify(fs.copyFile);

export default async function copy(srcFile: string, targetFile: string) {
  await copyFile(srcFile, targetFile);
}
