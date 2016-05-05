# domchanger-redux-connect
domchanger connection to redux

Requires Redux

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/redux/3.5.2/redux.min.js"></script>
<script src="//rawgit.com/creationix/domchanger/master/domchanger.min.js"></script>
```

##Example - Counter: 

Define your Redux state and actions

```javascript
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
```

Define your domchanger components

```javascript

//Component:
function IncrementButtons() {
  return {
    render: function(props) {
      return [
        ["button", {
          onclick: function() {
            props.increment();
          }
        }, 'Increment'],
        ["button", {
          onclick: function() {
            props.decrement('stuff');
          }
        }, 'Decrement'],
        [CurrentCount, props],
      ];
    }
  }
}
//Component:
function CurrentCount() {
  return {
    render: function(props) {
      return ['div', 'Current count is ' + props.count + '!']
    }
  }
}
```

Connect and run your components with Redux.connect

```javascript
//Initialize component and connect to your Redux actions & state:
var buttons = Redux.connect(domChanger(IncrementButtons, document.body))(reduxApp).update();

//Link independent component to existing Redux.connect instance:
var count = Redux.connect(domChanger(CurrentCount, document.body))({
  link: buttons
});
```
