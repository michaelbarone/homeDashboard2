/* eslint-disable no-cond-assign */
app.directive("dropzone", function () {
  return {
    restrict: "A",
    link(scope, elem, attr) {
      elem.bind("dragover", function (e) {
        e.stopPropagation();
        e.preventDefault();
      });
      elem.bind("dragenter", function (e) {
        e.stopPropagation();
        e.preventDefault();
        elem[0].classList.add("hover");
      });
      elem.bind("dragleave", function (e) {
        e.stopPropagation();
        e.preventDefault();
        elem[0].classList.remove("hover");
      });
      elem.bind("drop", function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        window.console.log("listener worked!");
        elem[0].classList.remove("hover");
        const files = evt.originalEvent.dataTransfer.files;
        for (let i = 0, f; (f = files[i]); i++) {
          if (attr.droptype) {
            elem[0].classList.add("fileDropped");
            setTimeout(function () {
              elem[0].classList.remove("fileDropped");
            }, 5000);
          }
        }
      });
    }
  };
});
