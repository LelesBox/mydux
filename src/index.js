import promise from '../src/middlewares/promise'
import thunk from '../src/middlewares/thunk'

export var promiseMiddleware = promise
export var thunkMiddlware = thunk

export var createStore = function (reducer, initState = {}, applyMiddleware) {
  if (typeof initState === 'function') {
    applyMiddleware = initState
    initState = {}
  }
  var state = initState
  var listeners = []
  var _dispatch = function _dispatch (action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  var dispatch = function dispatch (action) {
    if (Array.isArray(action) || toString.call(action) === '[object Array]') {
      action.forEach(_action => dispatch(_action))
      return
    }
    if (applyMiddleware) {
      applyMiddleware({
        dispatch: _dispatch,
        getState
      }, action)
    } else {
      _dispatch(action)
    }
  }

  var subsribe = function subsribe (listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }
  var getState = function getState () {
    return state
  }
  return {
    dispatch,
    subsribe,
    getState
  }
}
// 返回一个大大的reducer
// 有个约定就是，reducer的属性名需要与state的属性名一致
export var combineReducer = function combineReducer (reducers) {
  return (state, action) => {
    Object.keys(reducers).forEach(key => {
      state[key] = reducers[key](state[key], action)
    })
    return state
  }
}

// export var applyMiddleware = function applyMiddleware (middleware1， middleware2) {
export var applyMiddleware = function applyMiddleware (...middlewares) {
  return (store, action) => {
    // middleware1(middleware2(dispatch))(action)
    var mds = middlewares.map(m => m(store))
    mds.reduceRight((previous, current) => {
      return current(previous)
    }, store.dispatch)(action)
  }
}
