describe("", function () {
  var rootEl;
  beforeEach(function () {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-expression-one-time/index-jquery.html");
  });

  it("should freeze binding after its value has stabilized", function () {
    var oneTimeBinding = element(by.id("one-time-binding-example"));
    var normalBinding = element(by.id("normal-binding-example"));

    expect(oneTimeBinding.getText()).toEqual("One time binding:");
    expect(normalBinding.getText()).toEqual("Normal binding:");
    element(by.buttonText("Click Me")).click();

    expect(oneTimeBinding.getText()).toEqual("One time binding: Igor");
    expect(normalBinding.getText()).toEqual("Normal binding: Igor");
    element(by.buttonText("Click Me")).click();

    expect(oneTimeBinding.getText()).toEqual("One time binding: Igor");
    expect(normalBinding.getText()).toEqual("Normal binding: Misko");

    element(by.buttonText("Click Me")).click();
    element(by.buttonText("Click Me")).click();

    expect(oneTimeBinding.getText()).toEqual("One time binding: Igor");
    expect(normalBinding.getText()).toEqual("Normal binding: Lucas");
  });
});
