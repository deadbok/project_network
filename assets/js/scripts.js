$(document).ready( function () {

	// Get element class as path variable
	var path = $('#md-file').attr('class').split(' ').join('/');

	// Load readme content
	$.ajax({
		url: 'https://rawgit.com/deadbok/project_network/'+path+'/README.md',
		dataType: 'text',
		success: function(data) {

			// Convert readme from markdown to html
			var converter = new showdown.Converter({extensions: ['table', 'github']});

			// Show html
			$("#md-file").html(converter.makeHtml(data));

		}
	});
});
