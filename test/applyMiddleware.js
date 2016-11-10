import { createStore, applyMiddleware } from '../src'

var initState = {
  a: 1,
  b: 2,
  c: 3,
  REDUCE_1: 10
}

var reducer = function (state, action) {
  switch (action.type) {
    case 'REDUCE_1':
      state.REDUCE_1++
      return state
    case 'Sync':
      state.REDUCE_1 += action.playload
      return state
    default:
      return state
  }
}

// 注意action是否可以修改咧，比如支持promise的action
var logger = (store) => next => action => {
  // console.log(action)
  console.log('开始接受之前的状态', store.getState())
  next(action)
  console.log('结束接受之后的状态', store.getState())
}

var promiseMiddleware = store => next => action => {
  if (action.playload.then) {
    action.playload.then(
      result => {
        next(result)
      },
      error => {
        store.dispatch({...action, playload: error})
        return Promise.reject(error)
      })
  } else {
    next(action)
  }
}

var store = createStore(
  reducer,
  initState,
  applyMiddleware(promiseMiddleware, logger)
 )

store.subsribe(function () {
  console.log('we got new state: ', store.getState())
})

store.$dispatch({
  playload: new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        type: 'Sync',
        playload: 23333
      })
    }, 2000)
  })
})
// var idx = 0
// var interval = setInterval(function () {
//   var i = idx++
//
//   if (idx > 2) {
//     clearInterval(interval)
//   }
// }, 500)
