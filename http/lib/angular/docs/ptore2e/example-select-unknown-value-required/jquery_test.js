describe("", function () {
  var rootEl;
  beforeEach(function () {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-select-unknown-value-required/index-jquery.html");
  });

  it("should show the error message when the unknown option is selected", function () {
    var error = element(by.className("error"));

    expect(error.getText()).toBe("Error: Please select a value");

    element(by.cssContainingText("option", "Option 1")).click();

    expect(error.isPresent()).toBe(false);

    element(by.tagName("button")).click();

    expect(error.getText()).toBe("Error: Please select a value");
  });
});
