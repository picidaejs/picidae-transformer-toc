/**
 * @file: node
 * @author: Cuttle Cong
 * @date: 2018/1/25
 * @description: 
 */
var util = require('./lib/util-doc/lib/index')
var slug = require('remark-slug')

function opts(options) {
  var settings = options || {};
  return Object.assign({
    test: '<TABLE_OF_CONTENTS>',
    maxDepth: 5,
    tight: true
  }, settings)
}

exports.markdownTransformer = function (options, gift) {
  options = opts(options)
  if (!options.test) {
    return gift.data
  }

  return gift.data.replace(new RegExp('^(' + options.test + ')', 'mi'),
    new Array(parseInt(options.maxDepth) + 1).join('#') + ' $1'
  )
}

exports.remarkTransformer = function (options) {
  var settings = opts(options);
  var heading = settings.test;
  var depth = settings.maxDepth;
  var tight = settings.tight;

  this.use(slug);

  return transformer

  /* Adds an example section based on a valid example
   * JavaScript document to a `Usage` section. */
  function transformer(node) {
    var result = util(node, {
      heading: heading,
      maxDepth: depth,
      tight: tight
    });

    if (!result.map || result.index === -1) {
      return;
    }

    if (!heading) {
      result.index = result.endIndex = 0
    }
    else {
      // REMOVE PLACEHOLDER
      result.endIndex = result.index
      if (result.index > 0) {
        result.index--
      }
    }
    /* Replace markdown. */
    node.children = [].concat(
      node.children.slice(0, result.index),
      {
        type: 'html',
        value: '<div class="picidae-toc">'
      },
      result.map,
      {
        type: 'html',
        value: '</div>'
      },
      node.children.slice(result.endIndex)
    );
  }
  // return function (node) {
  //   var result = search(node, options)
  //
  // }
}