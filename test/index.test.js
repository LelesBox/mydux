import 'babel-polyfill'
import chai from 'chai'
import { createStore, combineReducer, applyMiddleware } from '../src'
import promise from '../src/middlewares/promise'
import thunk from '../src/middlewares/thunk'
let expect = chai.expect

// 测试方法
// 发出一系列的action，生成一个不同状态的state保存到数组
// 最后在对比预期的数组和这个数组的区别
// 那如何知道对比时机呢
// 那就是当store.subsribe调用次数达指定次数后做对比
describe('手写实践redux', () => {
  it('测试普通响应', done => {
    let expectState = {
      a: 12
    }
    function reducer (state, action) {
      switch (action.type) {
        case 'INIT':
          return { a: 1 }
        case 'PLUS_ONE':
          state.a += 1
          return state
        case 'PLUS_ACTION_PLAYLOAD':
          state.a += action.playload
          return state
        default:
          return state
      }
    }
    let store = createStore(reducer)
    const dispatchTimes = 3
    let index = 0
    store.subsribe(() => {
      if (++index === dispatchTimes) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch({
      type: 'INIT'
    })
    store.dispatch({
      type: 'PLUS_ONE'
    })
    store.dispatch({
      type: 'PLUS_ACTION_PLAYLOAD',
      playload: 10
    })
  })
  it('dispatch一个数组action', done => {
    let expectState = {
      a: 12
    }
    function reducer (state, action) {
      switch (action.type) {
        case 'INIT':
          return { a: 1 }
        case 'PLUS_ONE':
          state.a += 1
          return state
        case 'PLUS_ACTION_PLAYLOAD':
          state.a += action.playload
          return state
        default:
          return state
      }
    }
    let store = createStore(reducer)
    let actions = [
      { type: 'INIT' },
      { type: 'PLUS_ONE' },
      {
        type: 'PLUS_ACTION_PLAYLOAD',
        playload: 10
      }
    ]
    const dispatchTimes = actions.length
    let index = 0
    store.subsribe(() => {
      if (++index === dispatchTimes) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch(actions)
  })
  it('测试combineReducer', done => {
    let initState = {
      obj1: {
        a: 1,
        b: 2
      },
      obj2: {
        c: 3
      }
    }
    let expectState = {
      obj1: {
        a: 21,
        b: 2
      },
      obj2: {
        c: 13
      }
    }
    let actions = [
      {
        type: 'A',
        playload: 20
      }, {
        type: 'C',
        playload: 10
      }
    ]
    let dispatchTimes = actions.length
    let index = 0
    function Obj1reducer (state, action) {
      switch (action.type) {
        case 'A':
          state.a += action.playload
          return state
        case 'B':
          state.b += action.playload
          return state
        default:
          return state
      }
    }
    function Obj2reducer (state, action) {
      switch (action.type) {
        case 'C':
          state.c += action.playload
          return state
        default:
          return state
      }
    }
    let reducer = combineReducer({
      obj1: Obj1reducer,
      obj2: Obj2reducer
    })
    var store = createStore(reducer, initState)
    store.subsribe(function () {
      if (++index === dispatchTimes) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch(actions)
  })

  it('使用中间件---编写一个自定义中间件', done => {
    let initState = {
      a: 1,
      b: 2
    }
    let expectState = {
      a: 2,
      b: 2 + 123
    }
    let actions = [
      {
        type: 'A_PLUS_ONE'
      }, {
        type: 'B_PLUS_ACTION_PLAYLOAD',
        playload: 123
      }
    ]
    let reducer = function (state, action) {
      switch (action.type) {
        case 'A_PLUS_ONE':
          state.a++
          return state
        case 'B_PLUS_ACTION_PLAYLOAD':
          state.b += action.playload
          return state
        default:
          return state
      }
    }
    var middleIndex = 0
    let customMiddleware = function (store) {
      return next => action => {
        middleIndex++
        next(action)
      }
    }
    let store = createStore(
      reducer,
      initState,
      applyMiddleware(customMiddleware)
    )
    var index = 0
    store.subsribe(() => {
      if (++index === actions.length) {
        expect(expectState).to.deep.equal(store.getState())
        expect(middleIndex).to.equal(actions.length)
        done()
      }
    })
    store.dispatch(actions)
  })
  it('使用thunk中间件，支持dispatch同步/异步action函数', done => {
    let initState = {
      a: 1,
      b: 2
    }
    let expectState = {
      a: 1 + 1 + 1,
      b: 2 + 123
    }
    let actions = [
      function async (dispatch) {
        setTimeout(() => {
          dispatch({
            type: 'A_PLUS_ONE'
          })
        }, 1000)
      }, {
        type: 'B_PLUS_ACTION_PLAYLOAD',
        playload: 123
      },
      function sync (dispatch) {
        dispatch({
          type: 'A_PLUS_ONE'
        })
      }
    ]
    let reducer = function (state, action) {
      switch (action.type) {
        case 'A_PLUS_ONE':
          state.a++
          return state
        case 'B_PLUS_ACTION_PLAYLOAD':
          state.b += action.playload
          return state
        default:
          return state
      }
    }
    let store = createStore(
      reducer,
      initState,
      applyMiddleware(thunk)
    )
    var index = 0
    store.subsribe(() => {
      if (++index === actions.length) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch(actions)
  })

  it('使用promise中间件，支持dispatch promise的action函数', done => {
    let initState = {
      a: 1,
      b: 2
    }
    let expectState = {
      a: 1 + 1 + 1,
      b: 2 + 123
    }
    let actions = [
      Promise.resolve({
        type: 'A_PLUS_ONE'
      }), {
        type: 'B_PLUS_ACTION_PLAYLOAD',
        playload: 123
      },
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            type: 'A_PLUS_ONE'
          })
        }, 1000)
      })
    ]
    let reducer = function (state, action) {
      switch (action.type) {
        case 'A_PLUS_ONE':
          state.a++
          return state
        case 'B_PLUS_ACTION_PLAYLOAD':
          state.b += action.playload
          return state
        default:
          return state
      }
    }
    let store = createStore(
      reducer,
      initState,
      applyMiddleware(promise)
    )
    var index = 0
    store.subsribe(() => {
      if (++index === actions.length) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch(actions)
  })

  it('同时使用thunk和promise中间件，支持dispatch一个thunk返回的promise', done => {
    let initState = {
      a: 1,
      b: 2
    }
    let expectState = {
      a: 1 + 1 + 1,
      b: 2 + 123
    }
    let actions = [
      function async (dispatch) {
        setTimeout(() => {
          dispatch({
            type: 'A_PLUS_ONE'
          })
        }, 500)
      }, {
        type: 'B_PLUS_ACTION_PLAYLOAD',
        playload: 123
      },
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            type: 'A_PLUS_ONE'
          })
        }, 1000)
      })
    ]
    let reducer = function (state, action) {
      switch (action.type) {
        case 'A_PLUS_ONE':
          state.a++
          return state
        case 'B_PLUS_ACTION_PLAYLOAD':
          state.b += action.playload
          return state
        default:
          return state
      }
    }
    let store = createStore(
      reducer,
      initState,
      applyMiddleware(thunk, promise)
    )
    var index = 0
    store.subsribe(() => {
      if (++index === actions.length) {
        expect(expectState).to.deep.equal(store.getState())
        done()
      }
    })
    store.dispatch(actions)
  })
})
