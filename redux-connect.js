/*
Name: Redux.connect
version: 0.1.0
Description: connect domchanger components to your Redux reducers actions and state via their props with auto updating.
Author: Michael Glazer 
Link: https://github.com/magnumjs/domchanger-redux-connect
Copyright (c) 2016
License MIT
Example: http://embed.plnkr.co/2v70NgfcNYJDNsGccwTR/
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
        var camelCased = type.toLowerCase().replace(/-([a-z|A-Z])/g, function(g) {
          return g[1].toUpperCase();
        });
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
      var middleware = params.middleware || [];
      var initState = params.initState;
      var types = linked ? linked.storeTypes : params.actionTypes;
      var store = linked ? linked.store : Redux.createStore(reducers, initState, Redux.applyMiddleware.apply({}, middleware));

      var unsubscribe = store.subscribe(function() {
        component.update(store.getState());
      });

      component.store = store;
      component.storeTypes = types;

      component.destroy = function() {
        unsubscribe();
        orig.destroy();
      };

      var prev;
      component.update = function(props) {
        //Comparsion check to avoid re-running unnecessarily
        if (JSON.stringify(props) !== prev) {
          orig.update(Object.assign(props || {}, filterPropsState(store, types)))
        }
        prev = JSON.stringify(props);
        return this;
      };

      return component;
    }
  };

}(window.Redux || {}));
