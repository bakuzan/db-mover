import dotenv from 'dotenv';
import path from 'path';

import { FileInfo } from './interface/FileInfo';
import find from './find';
import copy from './copy';
import processSettings from './processSettings';

dotenv.config();

async function copyFilesAround(
  pattern: string,
  fromFolder: string,
  toFolder: string
) {
  let count = 0;

  console.log(`\r\nMoving files matching: ${pattern}`);
  console.log(`From: ${fromFolder}`);
  console.log(`To: ${toFolder}`);

  await find(fromFolder, new RegExp(pattern), async function handler(
    fileInfo: FileInfo
  ) {
    const inputFile = fileInfo.path;
    const outputFile = path.join(toFolder, fileInfo.name);

    await copy(inputFile, outputFile);

    console.log(`\r\nCopied ${inputFile} -> ${outputFile}`);
    count++;
  });

  return count;
}

async function init() {
  const { pattern, mappings } = processSettings();
  let count = 0;

  console.log('File mover starting');

  for (const item of mappings) {
    count += await copyFilesAround(pattern, item.from, item.to);
  }

  console.log(`\r\n${count} files moved.`);
}

init();
