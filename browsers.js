/**
 * @file: browser
 * @author: Cuttle Cong
 * @date: 2018/2/11
 * @description:
 */
import { utils } from 'picidae/exports/html-to-react'

function findParent(node, cond) {
  while (node) {
    if (node.parent && cond(node.parent)) {
      return node.parent
    }
    node = node.parent
  }
  return
}

export default function (options) {
  return function (pageData) {
    return [
      {
        shouldProcessNode(node) {
          const children = node.children
          if (node.name === 'li' && children.find(x => x.type === 'tag' && x.name === 'p')) {
            const p = findParent(node, node => {
              return node.name === 'div'
                     && node.attribs['class'] === 'picidae-toc'
            })
            return !!p
          }
          return false
        },
        processNode(node, children = [], index) {
          let childIndex = -1
          while ((childIndex = children.findIndex(x => x.type === 'p')) >= 0) {
            children = children.slice(0, childIndex)
                               .concat(children[childIndex].props.children)
                               .concat(children.slice(childIndex + 1))
          }
          return utils.createElement(node, index, node.data, children)
        }
      }
    ]
  }
}
