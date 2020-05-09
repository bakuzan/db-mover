import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import { FileInfo } from './interface/FileInfo';

const readdir = promisify(fs.readdir);
const excludes = [
  'node_modules',
  'build',
  'lib',
  'src',
  'tests',
  '__tests__',
  'tools'
];

async function readFiles(
  directory: string,
  includeDirectories = false
): Promise<FileInfo[]> {
  const files = await readdir(directory, {
    withFileTypes: true
  });

  return files
    .filter((item) => includeDirectories || item.isFile())
    .map((item) => ({
      name: item.name,
      path: path.join(directory, item.name)
    }));
}

export default async function find(
  directory: string,
  filter: RegExp,
  callback: (fileInfo: FileInfo) => Promise<void>
) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory '${directory}' does not exist!`);
    process.exit(0);
  }

  const files = await readFiles(directory, true);

  for (const info of files) {
    const filename = info.path;
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      const moreFiles = await readFiles(filename);
      files.push(...moreFiles);
    } else if (filter.test(filename)) {
      await callback(info);
    }
  }
}
