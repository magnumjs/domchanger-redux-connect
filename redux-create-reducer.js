
(function(Redux) {

  Redux.createReducer = function(initialState, handlers = []) {
    var reducer = function(state, action) {
      if (state === undefined) state = initialState;
      var newState = Object.assign({}, state);

      if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](newState, action);
      } else {
        return newState;
      }
    };
    reducer.addHandler = function(type, handler) {
      handlers[type] = handler;
    }
    return reducer;
  };

}(Redux));
