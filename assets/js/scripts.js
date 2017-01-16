$(document).ready( function () {

	////////////////////////////
	// Start stuff
	////////////////////////////

	// Make Everything fadeIn
	// Fixes some visual issues by displaying the content only when it is ready
	$('body').fadeIn(200);

	////////////////////////////
	// Mobile Navigation
	////////////////////////////
	$('.menu-icon').on( 'click', function() {
		$(this).toggleClass('menu-active');
	});

	////////////////////////////
	// GET Markdown File - AJAX
	////////////////////////////

	// Define GitHub User
	var user			= 'deadbok';

	// Define Repository Name
	var repository		= 'project_network';

	// Define HTML element classes
	var target			= '.md-file';
	var error_message	= '.ajax-error';


	// Get element class as path variable
	var path = $(target).attr('id').split(' ').join('/');

	// Load readme content
	$.ajax({
		url: 'https://raw.githubusercontent.com/'+user+'/'+repository+'/'+path+'/README.md',
		type: 'GET',
		dataType: 'text',
		success: function(data) {
			// Display Headings List and Markdown File
			$('.info, .md-file').fadeIn(100);

			// Convert readme from markdown to html
			var converter = new showdown.Converter({extensions: ['table', 'github']});

			// Show html
			$(target).html(converter.makeHtml(data));
			// Show headings list (auto-generated)
			$(target).anchorific();
		},
		error: function(statusCode, errorThrown) {
			// Add .ajax-not-working class to body
			$('body').addClass('ajax-not-working');

			// Add error message to .ajax-error element
			if (statusCode.status == 0) {
				$(error_message).fadeIn(100).html('<h4>Seems like something went wrong!</h4><p>Check to see if you have <strong>Internet Access</strong></p>');
				console.log('AJAX Error! Response: ' + statusCode.status);
			} else if (statusCode.status == 404) {
				$(error_message).fadeIn(100).html('<h4>Seems like something went wrong!</h4><p>Check to see if the <strong>README.md</strong> file exists or if the <strong>.md-file</strong> element has the correct IDs</p>');
				console.log('AJAX Error! Response: ' + statusCode.status);
			}
		}
	});

	////////////////////////////
	// Animat Scoll-To Action
	////////////////////////////

	// Get <header> and <footer> height
	var header = $('header').outerHeight(true);
	var footer = $('footer').outerHeight(true);

	// Fix Body position issue caused by Fixed Header and Footer
	$('body').css({paddingTop : header, paddingBottom : footer})

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
