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

function CurrentCount() {
  return {
    render: function(props) {
      return ['div', 'Current count is ' + props.count + '!']
    }
  }
}



var buttons = Redux.connect(domChanger(IncrementButtons, document.body))(reduxApp).update();

var count = Redux.connect(domChanger(CurrentCount, document.body))({
  link: buttons
});
