var counterService = function() {
  return {
    increment: function(num) {
      return ++num;
    },
    decrement: function(num) {
      return --num;
    }
  }
};
