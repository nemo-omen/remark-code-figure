# remark-code-figure

A [remark](https://unifiedjs.com/explore/package/remark/) plugin that wraps `code` blocks in `figure` elements with an optional `figcaption`.

## Installation

```bash
npm install remark-code-figure
```

## Usage

`remark-code-figure` can be used with [remark](https://unifiedjs.com/explore/package/remark/) or with [unifiedjs](https://unifiedjs.com). 

We have the following `test.md` file.

~~~markdown
# Example markdown

```js My caption text
console.log("Hello, world!");
```
~~~

Let's look at a few ways this can be processed with tools in the [unified](https://unifiedjs.com) collective.

### To Markdown

You can process markdown input and return the transformed markdown output (the figure element will be written directly into markdown):

```js
import report from 'vfile-reporter'; // for reporting errors
import {readSync, writeSync} from 'to-vfile'; // for reading our markdown file
import { remark } from 'remark';
import remarkStringify from 'remark-stringify';
import codeCaption from 'remark-code-caption';

// our processing function
async function mdToRemark(buffer) {
  return await remark()
    .use(codeFigure)
    .use(remarkStringify)
    .process(readSync('./test.md'))
    .then(async (file) => {
      console.error(report(file));
      writeSync({path: './marked-test.md', value: String(await file)});
    })
}

mdToRemark();
```

This will write `marked-test.md` to the file system for us. That file will look like:

~~~markdown
# Example markdown

<figure class="code-figure">
  <pre>
    <code class="language-js">
      console.log("Hello, world!");
    </code>
  </pre>
  <figcaption class="code-caption">
    My caption text
  </figcaption>
</figure>
~~~

### To HTML

You can also process markdown input into partial html output. Make sure to use `{sanitize: false}` in the `remarkHtml` options or the `figure` element and its children will be stripped from the document. After that, though, you'll want to use [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) to protect yourself from [xss attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).

```js
async function mdHTML() {
  return await unified() // you can also use remark!
    .use(remarkParse) // but leave this line out if you do
    .use(codeFigure)
    .use(remarkHtml, {sanitize: false}) // important!
    .use(rehypeSanitize)
    .process(readSync('./test.md'))
    .then(async (file) => {
      console.error(report(file));
      writeSync({path: './html-test.html', value: String(await file)});
    });
}

mdHTML();
```

Which will give you:

```html
<h1>Test Markdown file</h1>
<figure class="code-figure">
  <pre>
    <code class="language-js">
      console.log("Hello, world");
    </code>
  </pre>
  <figcaption class=code-caption>
    My caption text
  </figcaption>
</figure>
```

## Syntax Highlighting
At the moment, this plugin will work with [remark-shiki](https://github.com/stefanprobst/remark-shiki), but will not work with [remark-prism](https://github.com/sergioramos/remark-prism).

This plugin will work with [@mapbox/rehype-prism](https://github.com/mapbox/rehype-prism) though, you'll just need to call things in the correct order, it's also recommended to use [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) to help ensure your final output is safe from [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting):

```js
import prism from '@mapbox/rehype-prism';

async function mdPrism() {
  return await remark()
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(prism)
    .use(codeFigure)
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeDocument)
    .use(rehypeFormat) // make your html output look nice!
    .use(rehypeStringify)
    .process(readSync('./test.md'))
    .then(async (file) => {
      console.error(report(file));
      writeSync({path: './mdPrism.html', value: String(await file)});
    })
    
  }

mdPrism();
```

If you want to highlight with [remark-shiki](https://github.com/stefanprobst/remark-shiki), you need to install [shiki](https://github.com/shikijs/shiki) as a separate dependency.

You'll also need to call the `shiki.getHighlighter` function:

```js
async function mdShiki() {
  const highlighter = await shiki.getHighlighter({theme: 'nord'});

  return remark()
    .use(remarkShiki, {highlighter})
    .use(codeFigure)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeDocument)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(readSync('./test.md'))
    .then(async(file) => {
      console.error(report(file));
      writeSync({path: './mdShiki.html', value: String(await file)});
    });
}

mdShiki();
```

## Options

Options are passed to `codeFigure` as an object. By default, that object looks like this:

```js
{
 className: 'code-figure', 
 captionOptions: {
   disable: false, 
   position: 'after', 
   className: 'code-caption'
 }
}
```

### `options.className`
Specifies the class name of the `figure` element. Defaults to `code-figure`.
```js
{
  type: string,
  default: 'code-figure'
}
```

### `options.captionOptions.disable`
Specifies whether to disable the `figcaption` element.
```js
{
  type: boolean,
  default: false
}
```

### `options.captionOptions.position`
Specifies the position of the `figcaption` element. Can be either `"before"` or `"after"`.
```js
{
  type: string,
  default: 'after'
}
```

### `options.captionOptions.className`
Specifies the class name for the `figcaption` element. Defaults to `code-caption`.
```js
{
  type: string,
  default: 'code-caption'
}
```