import fs from 'fs';
import path from 'path';
import report from 'vfile-reporter';
import { unified } from 'unified';
import { rehype } from 'rehype';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import rehypeParse from 'rehype-parse';
import remarkRehype from 'remark-rehype';
import remarkHtml from 'remark-html';
import rehypeRemark from 'rehype-remark';
import rehypeDocument from 'rehype-document';
import rehypeStringify from 'rehype-stringify';
import remarkStringify from 'remark-stringify';

import { test } from 'tap';

import codeFigure from './index.js';


const __dirname = path.resolve();

const mdFilePath = path.join(__dirname, 'test.md');

const mdBuffer = fs.readFileSync(mdFilePath);
const mdBufferTwo = fs.readFileSync(mdFilePath);

async function mdMD(buffer) {
  return await unified()
    .use(remarkParse)
    .use(codeFigure)
    .use(remarkStringify)
    .process(buffer)
    .then((file) => {
      console.error(report(file));
      return file;
    });
}

async function mdHTML(buffer) {
  return await unified()
    .use(remarkParse)
    .use(codeFigure)
    .use(remarkHtml, {sanitize: false})
    .process(buffer)
    .then((file) => {
      console.error(report(file));
      return file;
    });
}

async function testMD(file) {
  const writeFilePath = path.join(__dirname, 'md-md-test.md');
  fs.writeFileSync(writeFilePath, String(await(file)));
  console.log('MD file in test.js: ', String(await file));
}

async function testHTML(file) {
  const writeFilePath = path.join(__dirname, 'md-html-test.html');
  fs.writeFileSync(writeFilePath, String(await(file)));
  console.log('HTML file in test.js: ', String(await file));
}

testMD(mdMD(mdBuffer));
testHTML(mdHTML(mdBufferTwo));