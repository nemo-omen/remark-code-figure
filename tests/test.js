import { test } from 'tape';
import { remark } from 'remark'; 
import { u } from 'unist-builder';
import {removePosition} from 'unist-util-remove-position'
import remarkStringify from 'remark-stringify';
import { readSync } from 'to-vfile';
import codeFigure from '../index.js';
import { mdMark } from './mdMark.js';

test('remarkCodeFigure', (t) => {
  t.deepEqual(
    removePosition(
      remark()
        .use(codeFigure)
        .runSync(remark.parse(`# Heading\n\n~~~js test\nconsole.log("Hello, world!")\n~~~`)),
      true
    ),
    u('root', [
      u(
        'heading',
        {depth: 1},
        [u('text', 'Heading')]
      )
    ])
  )
});