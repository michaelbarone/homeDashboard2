describe("", function () {
  var rootEl;
  beforeEach(function () {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-services-usage/index.html");
  });

  it("should test service", function () {
    expect(element(by.id("simple")).element(by.model("message")).getAttribute("value")).toEqual("test");
  });
});
