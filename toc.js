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

var HEADING = {
  zh: '目录',
  en: 'Table of Contents'
}

function toc(options) {
  var settings = options || {}
  var heading = settings.heading || HEADING.en
  var depth = settings.maxDepth || 3
  var tight = settings.tight
  // var strict = settings.strict || false
  var wrappedHead = wrap(heading)

  this.use(slug)

  return transformer

  /* Adds an example section based on a valid example
   * JavaScript document to a `Usage` section. */
  function transformer(node) {
    var firstHeadIndex = node.children.findIndex(function (node) {
      return node.type === 'heading'
    })
    if (firstHeadIndex < 0) {
      return
    }
    var cloNode = Object.assign({}, node, {
      children: [
        {
          type: 'heading', depth: node.children[firstHeadIndex].depth, children: [{ value: wrappedHead, type: 'text' }]
        }
      ].concat(node.children.slice(firstHeadIndex))
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
      {
        'type': 'html',
        'value': '<div class="picidae-toc-title">' + escape(heading) + '</div>'
      },
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
