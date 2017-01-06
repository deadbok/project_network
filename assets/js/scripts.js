$(document).ready( function () {

	var repository		= 'project_network';
	var target			= '.md-file';
	var error_message	= '.ajax-error';


	// Get element class as path variable
	var path = $(target).attr('id').split(' ').join('/');

	// Load readme content
	$.ajax({
		url: 'https://raw.githubusercontent.com/deadbok/'+repository+'/'+path+'/README.md',
		dataType: 'text',
		success: function(data) {

			// Convert readme from markdown to html
			var converter = new showdown.Converter({extensions: ['table', 'github']});

			// Show html
			$(target).html(converter.makeHtml(data));
			// Show headings list (auto-generated)
			$(target).anchorific();
		},
		error: function() {
			// Add .ajax-not-working class to body
			$('body').addClass('ajax-not-working');
			// Add error message to .ajax-error element
			$(error_message).fadeIn().html('<h4>Seems like your network settings are not able to connect to the internet.</h4>');
		}
	});

	// Get <header> height
	var header = $('header').outerHeight(true);

	// Prevent default jump-to action for anchor links
	// Animate scroll if link statrs with '#' character
	$('.anchorific').on('click', 'a[href^=\\#]', function(event){
	    event.preventDefault();
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top - header
	    }, 500);
		return false;
	});

	// Prevent default jump-to action for anchor links
	// Animate scroll if link includes name
	$('.md-file').on('click', 'a[href^=\\#]', function(event){
	    event.preventDefault();
	    $('html, body').animate({
	        scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top - header
	    }, 500);
		return false;
	});

});
