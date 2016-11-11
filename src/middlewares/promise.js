export default function promiseMiddleware (store) {
  return next => action => {
    // 判断action是否是promise方法
    if (typeof action.then === 'function') {
      action.then(
        result => {
          next(result)
        },
        error => {
          store.dispatch({...action, playload: error})
          return Promise.reject(error)
        })
    } else if (action.playload && typeof action.playload.then === 'function') {
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
}
