import { createStore } from '../src'

var initState = {
  a: 1,
  b: 2,
  c: 3,
  s: null,
  playload: null,
  REDUCE_1: 'REDUCE_1',
  REDUCE_2: 'REDUCE_2'
}

var reducer = function (state, action) {
  switch (action.type) {
    case 'TEST':
      return Object.assign(state, { playload: action.playload, s: 'TEST' })
    case 'LEE':
      return Object.assign(state, { playload: action.playload, s: 'LEE' })
    default:
      return state
  }
}

var store = createStore(reducer, initState)

var unsubscribe = store.subsribe(function () {
  console.log('we got new state: ', store.getState())
})

var idx = 0
var interval = setInterval(function () {
  store.dispatch({
    type: 'TEST',
    playload: idx++
  })
  store.dispatch({
    type: 'LEE',
    playload: idx++
  })
  if (idx > 5) {
    unsubscribe()
    store.dispatch({
      type: 'TEST',
      playload: '不会出现'
    })
    clearInterval(interval)
  }
}, 500)
