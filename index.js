import { visit } from 'unist-util-visit';
import { toHtml } from 'hast-util-to-html';
import { u } from 'unist-builder';

const defaults = { 
  className:'code-figure', 
  captionOptions: { 
    disable: false, 
    position: 'after', 
    className: 'code-caption'
  }
}

export default function codeFigure(options = defaults) {

  const { className, captionOptions } = options;
  
  return (tree) => {

    visit(tree, 'code', (node, index, parent) => {
      wrapCodeNode(node, index, parent,options);
    });

    visit(tree, 'element', (node, index, parent) => {
      if(node.tagName === 'pre') {
        wrapHastNode(node, index, parent,options);
      }
    });

    visit(tree, 'html', (node, index, parent) => {
      if(node.lang) {
        wrapHTMLNode(node, index, parent,options);
      }
    });

  };

}

function wrapCodeNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  const captionData = node.meta ? node.meta : null;
  const captionClass = captionOptions.className ? captionOptions.className : 'code-caption';
  const figClass = className ? className : 'code-figure';

  const captionElement = makeCaption(captionData, captionClass);
  const preElement = makePre(node);

  const figChildren = captionOptions.position === 'before' ? [captionElement, preElement] 
  : captionOptions.disable ? [preElement]
  : [preElement, captionElement] 

  const figElement = makeFigure(figChildren, figClass);

  const html = makeHTML(figElement);

  parent.children[index] = html;
}

function wrapHastNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  let captionData = null;
  const captionClass = captionOptions.className ? captionOptions.className : 'code-caption';

  visit(node, 'element', (cNode, index, parent) => {
    if(cNode.tagName === 'code' && cNode.data.meta) {
      captionData = cNode.data.meta;
    }
  });

  const captionElement = makeCaption(captionData ? captionData : null, captionClass);

  const figElement = {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: className ? className : 'code-figure'
    },
    children: captionOptions.position === 'before' ? [captionElement, node]
      : captionOptions.disable ? [node]
      : [node, captionElement]
  }
  parent.children[index] = figElement;
}

function wrapHTMLNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  const captionData = node.meta ? node.meta : null;

  captionElement = {
    type: 'html',
    value: `<figcaption class="${captionOptions.className ? captionOptions.className : 'code-caption'}">${captionData}</figcaption>`
  };

  const figElement = {
    type: 'html',
    value: `<figure class="${className ? className : 'code-figure'}">${captionOptions.position === 'before' ? captionElement.value : ''}${node.value}${captionOptions.position === 'after' ? captionElement.value : ''}\n</figure>`
  };
  parent.children[index] = figElement;
}

function makePre(node) {
  return {
    type: 'element',
      tagName: 'pre',
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {
            className: 'language-' + node.lang
          },
          children: [
            {
              type: 'text', 
              value: node.value
            }
          ]
        }
      ]
  };
}

function makeCaption(captionData, className) {
  return {
    type: 'element',
    tagName: 'figcaption',
    properties: {
      className: className ? className : 'code-caption',
    },
    children: [
      {
        type: 'text',
        value: captionData ? captionData : ''
      }
    ]
  }
}

function makeFigure(children, className) {
  return {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: className
    },
    children: children
  }
}

function makeHTML(element) {
  return {
    type: 'html',
    value: toHtml(element)
  }
}