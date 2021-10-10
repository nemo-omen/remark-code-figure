import { visit } from 'unist-util-visit';


/*
options: 
{
 className: 'code-figure', 
 captionOptions: {
   disable: true | false, 
   position: 'after' | 'before', 
   className: 'code-caption'
 }
}
*/

export default function codeFigure(
options = {
    className:'code-figure', 
    captionOptions: {
      disable: false, 
      position: 'after', 
      className: 'code-caption'
    }
  }) {

  const { className, captionOptions } = options;
  
  return (tree) => {
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

    visit(tree, 'code', (node, index, parent) => {
      wrapCodeNode(node, index, parent,options);
    }


);


function wrapHTMLNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  const captionData = node?.meta;
  let captionElement = null;

  if(captionData) {
    captionElement = {
      type: 'html',
      value: `<figcaption class="${captionOptions.className ? captionOptions.className : 'code-caption'}">${captionData}</figcaption>`
    };
  }

  const figElement = {
    type: 'html',
    value: `<figure class="${className ? className : 'code-figure'}">${captionOptions.position === 'before' ? captionElement.value : ''}${node.value}${captionOptions.position === 'after' ? captionElement.value : ''}\n</figure>`
  };
  parent.children[index] = figElement;
}

function wrapCodeNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  const captionData = node?.meta;
    let captionElement = null;

    if(captionData) {
      captionElement = {
        type: 'html',
        value: `<figcaption class="${captionOptions.className ? captionOptions.className : 'code-caption'}">${captionData}</figcaption>`
      };
    }

    const preElement = {
      type: 'html',
      value: `<pre>
  <code class="language-${node.lang}">

${node.value}

  </code>
</pre>`
    };

    const figElement = {
      type: 'html',
      value: `<figure class="${className ? className : 'code-figure'}">${captionOptions.position === 'before' ? captionElement.value : ''}${preElement.value}${captionOptions.position === 'after' ? captionElement.value : ''}\n</figure>`
    };
    parent.children[index] = figElement;
  };
  }
}

function wrapHastNode(node, index, parent, options) {
  const { className, captionOptions } = options;
  const captionData = null;
  // let captionElement = null;
  visit(node, 'element', (cNode, index, parent) => {
    if(cNode.tagName === 'code' && cNode.data.meta) {
      console.log(cNode.data.meta);
    }
  });

  const captionElement = {
    type: 'element',
    tagName: 'figcaption',
    properties: {
      className: captionOptions.className ? captionOptions.className : 'code-caption',
    },
    children: [
      {
        type: 'text',
        value: captionData ? captionData : ''
      }
    ]
  }

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