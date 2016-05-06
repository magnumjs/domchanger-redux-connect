//Stubs: static code so we don't test Redux

Redux.createStore = Redux.applyMiddleware = function() {
  return {
    getState: function() {
      return {};
    },
    subscribe: function() {}
  };
};

// specs code
describe("Redux.connect", function() {

  it("is defined as function", function() {
    expect(Redux.connect).toBeDefined();
    expect(typeof Redux.connect).toBe('function');
  });


  describe("A spy", function() {
    var component = {
        update: function() {}
      },
      hoc, params = {},
      wrappedComp, instance;

    beforeEach(function() {

      spyOn(Redux, 'connect').andCallThrough();

      hoc = Redux.connect(component);
      wrappedComp = hoc(params);
      spyOn(component, 'update').andCallThrough();

      instance = wrappedComp.update(true);
    });

    it("Redux.connect was called", function() {
      expect(Redux.connect).toHaveBeenCalled();

    });

    it("Redux.connect returns a HoC function", function() {
      expect(typeof hoc).toBe('function');
    });
    it("Redux.connect HoC function can be called with params", function() {
      expect(wrappedComp).toBeDefined();
    });
    it("HoC function called returns an object with a store property", function() {
      expect(typeof wrappedComp).toBe('object');
      expect(wrappedComp.store).toBeDefined();
    });
    it("HoC function called returned Object can call update function", function() {
      expect(component.update).toHaveBeenCalled();
    });
    it("update function returns the same instance with a store property", function() {
      expect(typeof instance).toBe('object');
      expect(instance.store).toBeDefined();
    });
  });

});
