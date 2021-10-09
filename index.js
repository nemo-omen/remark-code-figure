
import { selectAll, select } from 'hast-util-select';
import { parseSelector } from 'hast-util-parse-selector';
import { visit } from 'unist-util-visit';



// options: 
// {
//  className: 'code-figure', 
//  captionOptions: {
//    disable: true | false, 
//    position: 'after' | 'before', 
//    className: 'code-caption'
//  }
// }
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
    let captionValue = null;

    visit(tree, 'code', (node, index, parent) => {
      const captionData = node?.meta;
      let captionElement = null;

      if(captionData) {
        captionElement = {
          type: 'html',
          value: `<figcaption class=${captionOptions.className ? captionOptions.className : 'code-caption'}>${captionData}</figcaption>`
        };
      }

      const preElement = {
        type: 'html',
        value: `<pre><code class="language-${node.lang}">${node.value}</code></pre>`
      };

      const figElement = {
        type: 'html',
        value: `<figure class=${className ? className : 'code-figure'}>
${captionOptions.position === 'before' ? captionElement.value : ''}
${preElement.value}
${captionOptions.position === 'after' ? captionElement.value : ''}
</figure>`
      };
      parent.children[index] = figElement;
    });
    
  //   for(const preNode of selectAll('pre', tree)) {
  //     const codeNode = select('code', preNode);
  //     captionValue = extractCaptionValue(codeNode);
  //     let captionElement = null;

  //     visit(tree, preNode, (node, i, parent) => {

        // if(captionValue !== null) {
        //   captionElement = {
        //     type: 'element',
        //     tagName: 'figcaption',
        //     properties: {
        //       className: captionOptions.className ? captionOptions.className : 'code-caption',
        //     },
        //     children: [
        //       { type: 'text', value: captionValue },
        //     ]
        //   };
        // }

  //       const figElement = {
  //         type: 'element',
  //         tagName: 'figure',
  //         properties: {
  //           className: className ? className : 'code-figure'
  //         },
  //         children: captionOptions.disable ? [preNode]
  //           : captionOptions.position === 'before' ? [captionElement, preNode]
  //           : [preNode, captionElement]
  //       }
  //       parent.children[i] = figElement;
  //     });
  //   }
  // }
    }
  }

function extractCaptionValue(codeNode) {
  let meta = null;
  
  if(codeNode.data) {
    meta =  codeNode.data.meta;
  }
  
  return meta;
}