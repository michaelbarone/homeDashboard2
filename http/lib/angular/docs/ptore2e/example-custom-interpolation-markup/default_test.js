describe("", function () {
  var rootEl;
  beforeEach(function () {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-custom-interpolation-markup/index.html");
  });

  it("should interpolate binding with custom symbols", function () {
    expect(element(by.binding("demo.label")).getText()).toBe("This binding is brought you by // interpolation symbols.");
  });
});
