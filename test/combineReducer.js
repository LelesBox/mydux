import { createStore, combineReducer } from '../src'

var initState = {
  a: 1,
  b: 2,
  c: 3,
  REDUCE_1: 10,
  REDUCE_2: 20,
  REDUCE_3: {
    a: 'sb'
  }
}

var REDUCE_1 = function (state, action) {
  switch (action.type) {
    case 'REDUCE_1':
      return ++state
    default:
      return state
  }
}

var REDUCE_2 = function (state, action) {
  switch (action.type) {
    case 'REDUCE_2':
      return ++state
    default:
      return state
  }
}

var REDUCE_3 = function (state, action) {
  switch (action.type) {
    case 'REDUCE_3':
      return Object.assign(state, {a: 250})
    default:
      return state
  }
}

var reducer = combineReducer({
  REDUCE_1,
  REDUCE_2,
  REDUCE_3
})

var store = createStore(reducer, initState)

var unsubscribe = store.subsribe(function () {
  console.log('we got new state: ', store.getState())
})

var idx = 0
var interval = setInterval(function () {
  var i = idx++
  store.dispatch({
    type: 'REDUCE_1',
    playload: i
  })
  store.dispatch({
    type: 'REDUCE_2',
    playload: i
  })
  if (idx > 5) {
    store.dispatch({
      type: 'REDUCE_3'
    })
    unsubscribe()
    store.dispatch({
      type: 'REDUCE_1',
      playload: '不会出现'
    })
    clearInterval(interval)
  }
}, 500)
