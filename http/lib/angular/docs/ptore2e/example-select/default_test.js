describe("", function () {
  var rootEl;
  beforeEach(function () {
    rootEl = browser.rootEl;
    browser.get("build/docs/examples/example-select/index.html");
  });

  it("should check ng-options", function () {
    expect(element(by.binding("{selected_color:myColor}")).getText()).toMatch("red");
    element.all(by.model("myColor")).first().click();
    element.all(by.css('select[ng-model="myColor"] option')).first().click();
    expect(element(by.binding("{selected_color:myColor}")).getText()).toMatch("black");
    element(by.css('.nullable select[ng-model="myColor"]')).click();
    element.all(by.css('.nullable select[ng-model="myColor"] option')).first().click();
    expect(element(by.binding("{selected_color:myColor}")).getText()).toMatch("null");
  });
});
