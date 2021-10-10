import report from 'vfile-reporter';
import { readSync } from 'to-vfile';
import { remark } from 'remark';
import remarkStringify from 'remark-stringify';

import codeFigure from '../index.js';



export async function mdMark() {
  return await remark()
    .use(codeFigure)
    .use(remarkStringify)
    .process(readSync('./tests/fixtures/test.md'))
    .then(async (file) => {
      console.error(report(file));
      console.log(String(await file));
      return String(await file);
    })
  }

  // mdMark();