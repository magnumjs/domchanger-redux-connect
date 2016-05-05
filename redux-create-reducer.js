/*
Name: Redux.createReducer
Description: helper utility for redux to create a reducer and handlers to their actions.
Author: Michael Glazer 
Link: https://github.com/magnumjs/domchanger-redux-connect
Copyright (c) 2016
License MIT
Example: 
*/

"use strict";

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
