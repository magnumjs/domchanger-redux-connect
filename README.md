# domchanger-redux-connect

[DomChanger](https://github.com/creationix/domchanger) bindings for Redux.
Performant and flexible.

###Installation, requires DomChanger & Redux

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/redux/3.5.2/redux.min.js"></script>
<script src="//rawgit.com/creationix/domchanger/master/domchanger.min.js"></script>
```

##Example - Counter

###1. Define your Redux state and actions

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

###2. Define your domchanger components

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

###3. Connect and run your components with Redux.connect

```javascript
//Initialize component and connect to your Redux actions & state:
var buttons = Redux.connect(domChanger(IncrementButtons, document.body))(reduxApp).update(true);

//Link independent component to existing Redux.connect instance:
var count = Redux.connect(domChanger(CurrentCount, document.body))({
  link: buttons
}).update(true);
```
##Live Example

You can play around with a larger example in this [Plunker](http://embed.plnkr.co/2v70NgfcNYJDNsGccwTR/).


##API
There is one method `Redux.connect(COMPONENT)`

It receives one argument, the component you want to wrap.
```javascript
var componentInstance =domChanger(IncrementButtons, document.body);
Redux.connect(componentInstance);
```
It returns a function that you pass in your Redux object to. 
```javascript
var connectInstance = Redux.connect(domChanger(IncrementButtons, document.body));
connectInstance.(reduxApp)
```

That should contain all your normal Redux intialization values such as middleWare and gets passed to `Redux.createStore`
```javascript
{
  reducers: counter,
  actionTypes: types,
  middleware: [Redux.middle.thunkMiddleware, Redux.middle.logger],
  initState
};

```
That returns a object representing your domchanger components normal return methods such as destroy, update ..

```javascript
{
  update,
  destroy,
  append,
  handleEvent
};
```
You use the returned wrapped component instance to intialize your component by calling `update`
```javascript
var buttons = Redux.connect(domChanger(IncrementButtons, document.body))
  (reduxApp).update(true);
```
*Note* that some value is required to `update` for the initial render since we're doing a check on whether to update.

There is one unique property that the redux initialization function takes `link`
Which it you can link one store to multiple components

```javascript
var buttons = Redux.connect(domChanger(IncrementButtons, document.body))
  (reduxApp).update(true);

Redux.connect(domChanger(CurrentCount, document.body))({
  link: buttons
}).update(true);
```

