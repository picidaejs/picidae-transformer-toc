/**
 * @file: toc
 * @author: Cuttle Cong
 * @date: 2018/1/25
 * @description:
 */

'use strict'

var slug = require('remark-slug')
var util = require('mdast-util-toc')
var escape = require('html-escape')

module.exports = toc

function wrap(str) {
  return '{{' + str + '}}'
}


function toc(options) {
  var settings = options || {}
  var heading = settings.heading || 'Table of Contents'
  var depth = settings.maxDepth || 3
  var tight = settings.tight
  // var strict = settings.strict || false
  var wrappedHead = wrap('JUST_TMP_PLACEHOLDER')

  this.use(slug)

  return transformer

  /* Adds an example section based on a valid example
   * JavaScript document to a `Usage` section. */
  function transformer(node) {
    var firstHeadIndex = node.children.findIndex(function (node) {
      return node.type === 'heading'
    })
    if (firstHeadIndex < 0) {
      // no heading
      return
    }

    var cloNode = Object.assign({}, node, {
      children: [
        {
          type: 'heading', depth: 1, children: [{ value: wrappedHead, type: 'text' }]
        }
      ].concat(node.children)
    })

    var result = util(cloNode, {
      heading: wrappedHead,
      maxDepth: depth,
      tight: tight
    })
    if (result.index === null || result.index === -1 || !result.map) {
      return
    }

    /* Replace markdown. */
    node.children = [].concat(
      {
        'type': 'html',
        'value': '<div class="picidae-toc">'
      },
      // {
      //   'type': 'html',
      //   'value': '<div class="picidae-toc-title">' + escape(heading) + '</div>'
      // },
      result.map,
      {
        'type': 'html',
        'value': '</div>'
      },
      node.children.slice(0, result.index),
      node.children.slice(result.endIndex)
    )
  }
}
