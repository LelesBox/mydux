export default function thunk (store) {
  return next => action => {
    if (typeof action === 'function') {
      action(next)
    } else {
      next(action)
    }
  }
}
