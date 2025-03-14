describe("SCE doc demo", function () {
  it("should sanitize untrusted values", function () {
    expect(element.all(by.css(".htmlComment")).first().getAttribute("innerHTML")).toBe("<span>Is <i>anyone</i> reading this?</span>");
  });

  it("should NOT sanitize explicitly trusted values", function () {
    expect(element(by.id("explicitlyTrustedHtml")).getAttribute("innerHTML")).toBe(
      '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' + 'sanitization.&quot;">Hover over this text.</span>'
    );
  });
});
