//Stubs: static  code so we don't test Redux

Redux.createStore = Redux.applyMiddleware = function() {
  return {
    subscribe: function() {}
  }
};

// specs code
describe("Redux.connect", function() {

  it("is defined as function", function() {
    expect(Redux.connect).toBeDefined();
    expect(typeof Redux.connect).toBe('function');
  });


  describe("A spy", function() {
    var component = {
        render: function() {

        }
      },
      hoc, params = {};

    beforeEach(function() {

      spyOn(Redux, 'connect').andCallThrough();
      spyOn(component, 'render').andCallThrough();

      hoc = Redux.connect(component);
      hoc(params);
    });

    it("tracks that the spy was called", function() {
      expect(Redux.connect).toHaveBeenCalled();
      expect(typeof hoc).toBe('function');
    });
  });

});
