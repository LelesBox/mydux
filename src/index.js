export var createStore = function (reducer, initState = {}, applyMiddleware) {
  var state = initState
  var listeners = []
  var dispatch = function (action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  var $dispatch = function (action) {
    applyMiddleware({
      dispatch,
      getState
    }, action)
  }

  var subsribe = function (listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }
  var getState = function () {
    return state
  }
  return {
    dispatch,
    $dispatch,
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
    // 如果倒叙的话就不用这样转了
    var mds = [].concat(middlewares).reverse().map(m => m(store))
    mds.reduce((previous, current) => {
      return current(previous)
    }, store.dispatch)(action)
  }
}
