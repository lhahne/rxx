'use strict'

const rx = require('rx')

const fetch = require('isomorphic-fetch')

const fromPromise = rx.Observable.fromPromise

const station = 'HKI'
const stationInfo = fromPromise(fetch(`http://rata.digitraffic.fi/api/v1/metadata/stations`))
                  .flatMap(response => fromPromise(response.json()))
                  .flatMap(data => rx.Observable.from(data))
                  .filter(o => o.stationShortCode === station)
                  //.map(stations => _.find(stations, {stationShortCode: station}))

const trainStationInfo = fromPromise(fetch(`http://rata.digitraffic.fi/api/v1/live-trains?station=${station}`))
  .flatMap(response => fromPromise(response.json()))
  .zip(stationInfo)
  .map(data => ({
    trains: data[0],
    station: data[1]
  }))


import Cycle from '@cycle/core';
import {div, pre, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  const sinks = {
    DOM: trainStationInfo
      .map(info =>
        div([
          pre(JSON.stringify(info.station))
        ]))
  };
  return sinks;
}

Cycle.run(main, { DOM: makeDOMDriver('#container') });
