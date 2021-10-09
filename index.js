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
  }
}