$(document).ready( function () {

	// Get element class as path variable
	var path = $('#md-file').attr('class').split(' ').join('/');

	// Load readme content
	$.ajax({
		url: 'https://raw.githubusercontent.com/deadbok/project_network/'+path+'/README.md',
		dataType: 'text',
		success: function(data) {

			// Convert readme from markdown to html
			var converter = new showdown.Converter({extensions: ['table', 'github']});

			// Show html
			$("#md-file").html(converter.makeHtml(data));
			// Show headings list (auto-generated)
			$('#md-file').anchorific();
		},
		error: function() {
			// Add .ajax-not-working class to body
			$('body').addClass('ajax-not-working');
			// Add error message to .ajax-error element
			$('.ajax-error').fadeIn().html('<h4>Seems like your network settings are not able to connect to the internet.</h4>');
		}
	});

});
