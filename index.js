'use strict'

const _ = require('lodash')
const rx = require('rx')
const bacon = require('baconjs')

const fetch = require('isomorphic-fetch')

const list1 = [1, 2, 3, 4, 5, 6]
const list2 = [4, 5, 6]

const l = _.chain(list1)
  .map(v => 2 * v)
  .zipWith(list2.concat(list2), (x, y) => x + y)
  .value()

console.log(l)
