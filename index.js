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

const fromArray = rx.Observable.from

fromArray(list1)
  .map(v => 2 * v)
  .zip(fromArray(list2.concat(list2)), (x, y) => x + y)
  .subscribe(f => console.log(f))

const fromPromise = rx.Observable.fromPromise

const station = 'HKI'
const stationInfo = fromPromise(fetch(`http://rata.digitraffic.fi/api/v1/metadata/stations`))
                  .flatMap(response => fromPromise(response.json()))
                  .flatMap(data => rx.Observable.from(data))
                  .filter(o => o.stationShortCode === station)
                  //.map(stations => _.find(stations, {stationShortCode: station}))

fromPromise(fetch(`http://rata.digitraffic.fi/api/v1/live-trains?station=${station}`))
  .flatMap(response => fromPromise(response.json()))
  .zip(stationInfo)
  .map(data => ({
    trains: data[0],
    station: data[1]
  }))
  .subscribe(v => console.log(v))
