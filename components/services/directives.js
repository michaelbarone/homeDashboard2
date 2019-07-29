app.directive("dropzone", function() {
    return {
        restrict : "A",
        link: function (scope, elem, attr) {
            elem.bind('dragover', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
			});
			elem.bind('dragenter', function (e) {
				e.stopPropagation();
				e.preventDefault();
				elem[0].classList.add("hover");
			});
			elem.bind('dragleave', function (e) {
				e.stopPropagation();
				e.preventDefault();
				elem[0].classList.remove("hover");
			});
            elem.bind('drop', function(evt) {
				evt.stopPropagation();
                evt.preventDefault();
                window.console.log('listener worked!');
				elem[0].classList.remove("hover");
                var files = evt.originalEvent.dataTransfer.files;
                for (var i = 0, f; f = files[i]; i++) {
					if(attr.droptype){
						elem[0].classList.add("fileDropped");
						setTimeout(function(){ elem[0].classList.remove("fileDropped"); }, 5000);
						
						
						
						switch(attr.droptype) {
						//if(attr.droptype==="studentIDs"){
							case "studentIDs":
								var fileName = f.name;
								
								Papa.parse(f, {
									complete: function(results) {
										if(results.data.length>0){
											scope.functions.studentGroups.add(fileName,results.data);
										}
										elem[0].classList.remove("fileDropped");
									}
								});
								break;
							case "courses":
							case "majors":
							case "demographics":
								//scope.functions.loadCSV = function(fileName='',theFile=null,theDataType=null,theFileSize=null){
								scope.functions.loadCSV(f.name,theFile=f,theDataType=attr.droptype,theFileSize=f.size);
								break;
						//}
						}
					}
                }
            });
        }
    }
});