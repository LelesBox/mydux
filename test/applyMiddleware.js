import { createStore, applyMiddleware } from '../src'
import promiseMiddleware from '../src/middlewares/promise'
import thunk from '../src/middlewares/thunk'

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
  console.log('开始接受之前的状态', store.getState())
  next(action)
  console.log('结束接受之后的状态', store.getState())
}

var store = createStore(
  reducer,
  initState,
  applyMiddleware(thunk, promiseMiddleware, logger)
 )

store.subsribe(function () {
  console.log('we got new state: ', store.getState())
})

// Promise
store.dispatch(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      type: 'Sync',
      playload: 23333
    })
  }, 2000)
}))

// thunk
store.dispatch((dispatch) => {
  setTimeout(() => {
    dispatch({
      type: 'Sync',
      playload: 11111111
    })
  }, 2000)
})
