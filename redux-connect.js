/*
Name: Redux.connect
Description: conenct domchanger components to your Redux reducers actions and state via their props with auto updating.
Author: Michael Glazer 
Link: https://github.com/magnumjs/domchanger-redux-connect
Copyright (c) 2016
License MIT
Example: 
*/

"use strict";

(function(Redux) {

  Redux.connect = function(component) {

    var orig = Object.assign({}, component);

    var filterPropsState = function(store, types) {
      var state = store.getState();
      var actions = {};

      Object.keys(types).forEach(function(type) {
        //Convention of naming action types for props access
        //ADD-TODOS becomes props.addTodos each dash represents a camelCase
        var camelCased = type.toLowerCase().replace(/-([a-z|A-Z])/g, function (g) { return g[1].toUpperCase(); });
        actions[camelCased] = function() {
          store.dispatch(Object.assign({}, {
            type: type
          }, arguments))
        };
      });

      return Object.assign({}, actions, state);
    };

    return function(params) {

      var linked = params.link;

      var reducers = params.reducers && typeof params.reducers != 'function' ? Redux.combineReducers(params.reducers) : params.reducers;
      var actions = params.actions;
      var middleware = params.middleware || [];
      var initState = params.initState;
      var types = linked ? linked.storeTypes : params.actionTypes;



      var store = linked ? linked.store : Redux.createStore(reducers, initState, Redux.applyMiddleware.apply({}, middleware));

      var unsubscribe = store.subscribe(function() {
        component.update();
      });

      component.store = store;
      component.storeTypes = types;

      component.destroy = function() {
        unsubscribe();
        orig.destroy();
      };

      component.update = function(props) {
        orig.update(Object.assign(props || {}, filterPropsState(store, types)))
        return this;
      };

      return component;
    }
  };

}(Redux));
