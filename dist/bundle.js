/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// require('../test/mydux')
	// require('../test/combineReducer')
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _src = __webpack_require__(2);
	
	var initState = {
	  a: 1,
	  b: 2,
	  c: 3,
	  REDUCE_1: 10
	};
	
	var reducer = function reducer(state, action) {
	  switch (action.type) {
	    case 'REDUCE_1':
	      state.REDUCE_1++;
	      return state;
	    case 'Sync':
	      state.REDUCE_1 += action.playload;
	      return state;
	    default:
	      return state;
	  }
	};
	
	// 注意action是否可以修改咧，比如支持promise的action
	var logger = function logger(store) {
	  return function (next) {
	    return function (action) {
	      // console.log(action)
	      console.log('开始接受之前的状态', store.getState());
	      next(action);
	      console.log('结束接受之后的状态', store.getState());
	    };
	  };
	};
	
	var promiseMiddleware = function promiseMiddleware(store) {
	  return function (next) {
	    return function (action) {
	      if (action.playload.then) {
	        action.playload.then(function (result) {
	          next(result);
	        }, function (error) {
	          store.dispatch(_extends({}, action, { playload: error }));
	          return Promise.reject(error);
	        });
	      } else {
	        next(action);
	      }
	    };
	  };
	};
	
	var store = (0, _src.createStore)(reducer, initState, (0, _src.applyMiddleware)(promiseMiddleware, logger));
	
	store.subsribe(function () {
	  console.log('we got new state: ', store.getState());
	});
	
	store.$dispatch({
	  playload: new Promise(function (resolve, reject) {
	    setTimeout(function () {
	      resolve({
	        type: 'Sync',
	        playload: 23333
	      });
	    }, 2000);
	  })
	});
	// var idx = 0
	// var interval = setInterval(function () {
	//   var i = idx++
	//
	//   if (idx > 2) {
	//     clearInterval(interval)
	//   }
	// }, 500)

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var createStore = exports.createStore = function createStore(reducer) {
	  var initState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var applyMiddleware = arguments[2];
	
	  var state = initState;
	  var listeners = [];
	  var dispatch = function dispatch(action) {
	    state = reducer(state, action);
	    listeners.forEach(function (listener) {
	      return listener();
	    });
	  };
	  var $dispatch = function $dispatch(action) {
	    applyMiddleware({
	      dispatch: dispatch,
	      getState: getState
	    }, action);
	  };
	
	  var subsribe = function subsribe(listener) {
	    listeners.push(listener);
	    return function () {
	      listeners = listeners.filter(function (l) {
	        return l !== listener;
	      });
	    };
	  };
	  var getState = function getState() {
	    return state;
	  };
	  return {
	    dispatch: dispatch,
	    $dispatch: $dispatch,
	    subsribe: subsribe,
	    getState: getState
	  };
	};
	// 返回一个大大的reducer
	// 有个约定就是，reducer的属性名需要与state的属性名一致
	var combineReducer = exports.combineReducer = function combineReducer(reducers) {
	  return function (state, action) {
	    Object.keys(reducers).forEach(function (key) {
	      state[key] = reducers[key](state[key], action);
	    });
	    return state;
	  };
	};
	
	// export var applyMiddleware = function applyMiddleware (middleware1， middleware2) {
	var applyMiddleware = exports.applyMiddleware = function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (store, action) {
	    // middleware1(middleware2(dispatch))(action)
	    // 如果倒叙的话就不用这样转了
	    var mds = [].concat(middlewares).reverse().map(function (m) {
	      return m(store);
	    });
	    mds.reduce(function (previous, current) {
	      return current(previous);
	    }, store.dispatch)(action);
	  };
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map