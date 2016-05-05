'use strict';

Redux.middle = {}


Redux.middle.thunkMiddleware = function(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function(next) {
    return function(action) {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      return next(action);
    };
  };
}

Redux.middle.logger = function(store) {
  return function(next) {
    return function(action) {
      console.log('dispatching', action);
      var result = next(action);
      console.log('next state', store.getState());
      return result;
    };
  };
};

Redux.middle.crashReporter = function(store) {
  return function(next) {
    return function(action) {
      try {
        return next(action);
      } catch (err) {
        console.error('Caught an exception!', err);
        Raven.captureException(err, {
          extra: {
            action: action,
            state: store.getState()
          }
        });
        throw err;
      }
    };
  };
};


Redux.middle.timeoutScheduler = function(store) {
  return function(next) {
    return function(action) {
      if (!action.meta || !action.meta.delay) {
        return next(action);
      }

      var timeoutId = setTimeout(function() {
        return next(action);
      }, action.meta.delay);

      return function cancel() {
        clearTimeout(timeoutId);
      };
    };
  };
};


Redux.middle.vanillaPromise = function(store) {
  return function(next) {
    return function(action) {
      if (typeof action.then !== 'function') {
        return next(action);
      }

      return Promise.resolve(action).then(store.dispatch);
    };
  };
};

Redux.middle.readyStatePromise = function(store) {
  return function(next) {
    return function(action) {

      if (!action.promise) {
        return next(action);
      }

      function makeAction(ready, data) {
        var newAction = Object.assign({}, action, {
          ready: ready
        }, data);
        delete newAction.promise;
        return newAction;
      }

      var SUCCESS = FAILURE = REQUEST = action.type;

      if (action.types && Array.isArray(action.types)) {
        REQUEST = action.types[0];
        SUCCESS = action.types[1];
        FAILURE = action.types[2];
      }

      next(makeAction(false, {
        type: REQUEST
      }));
      return action.promise.then(function(result) {
        return next(makeAction(true, {
          result: result,
          type: SUCCESS
        }));
      }, function(error) {
        return next(makeAction(true, {
          error: error,
          type: FAILURE
        }));
      });
    };
  };
};
