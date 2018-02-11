/**
 * @file: node
 * @author: Cuttle Cong
 * @date: 2018/1/25
 * @description: 
 */
var forceToc = require('./forceToc')
var toc = require('./toc')

exports.markdownTransformer = function (options, gift) {
  options = options || {}
  options.test = options.test || '<TABLE_OF_CONTENTS>'

  if (options.force) {
    return gift.data.replace(new RegExp('^(' + options.test + ')', 'g'), '')
  }

  return gift.data.replace(new RegExp('^(' + options.test + ')', 'mi'), '## $1')
}

exports.remarkTransformer = function (options) {
  options = options || {}
  options = Object.assign({}, options, {
    maxDepth: 3
  })
  options.test = options.test || '<TABLE_OF_CONTENTS>'

  if (options.force) {
    return forceToc.call(this, options)
  }

  options.heading = options.test
  return toc.call(this, options)
}