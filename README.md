# domchanger-redux-connect
domchanger connection to redux

Requires Redux

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/redux/3.5.2/redux.min.js"></script>
<script src="//rawgit.com/creationix/domchanger/master/domchanger.min.js"></script>
```

##Example: 

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

//Initialize component and connect to your Redux actions & state:
var buttons = Redux.connect(domChanger(IncrementButtons, document.body))(reduxApp).update();

//Link independent component to existing Redux.connect instance:
var count = Redux.connect(domChanger(CurrentCount, document.body))({
  link: buttons
});
```
