var reduxApp = (function(Redux, counterService) {
  //Defaults:
  var initState = {
    count: 0
  };
  //Action types:
  var types = {
    'INCREMENT': 'INCREMENT',
    'DECREMENT': 'DECREMENT'
  };
  //Independent Service:
  var serviceCounter = counterService();
  //Create Reducer:
  var counter = Redux.createReducer(initState);

  //Add action type handlers to reducer:
  counter.addHandler(types.INCREMENT, function(newState, data) {
    newState.count = serviceCounter.increment(newState.count);
    return newState;
  });
  counter.addHandler(types.DECREMENT, function(newState, data) {
    newState.count = serviceCounter.decrement(newState.count);
    return newState;
  });

  //Return values for Redux.connect:
  return {
    reducers: counter,
    actionTypes: types,
    middleware: [Redux.middle.thunkMiddleware, Redux.middle.logger]
  };

}(Redux, counterService));
