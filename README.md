# Project Network
## Group7 at EAL ITET2016

Project Links
- GitHub page:
[https://deadbok.github.io/project_network/](https://deadbok.github.io/project_network/)
- GitHub Master Repository:
[https://github.com/deadbok/project_network/tree/master/](https://github.com/deadbok/project_network/tree/master/)

## 1. Introduction

This is a collection of static files (.html, .js, .css) used for displaying other static files (.md) in an orderly and stylish way.

It grabs a Markdown (README.md) file from GitHub, over the Great Internet and
throws it in the part of the page where you want to display it.

In order for this to work, you need a
(GitHub Pages Branch)[https://pages.github.com/] and a connection to the
Internet.

## 2. Usage/Settings

Grab and render Markdown (.md) file from GitHub online repository.
Using [jQuery](https://jquery.com/) Ajax request and
[Showdown](https://github.com/showdownjs/showdown)
```html
<div class="md-file" id="master recovery"></div>
```

Build list of heading from Markdown file using
[Anchorific](https://github.com/renettarenula/anchorific.js/)
```html
<nav class='anchorific'></nav>
```

Add your custom information in `assets/js/scripts.js`

```js
// Define GitHub User
var user			= 'GitHub_User';

// Define Repository Name
var repository		= 'GitHub_Repo_Name';
```

```js
// Define HTML element classes
var target			= '.md-file'; // <div class="md-file"></div>
var error_message	= '.ajax-error'; // <div class="ajax-error"></div>

// Get element ID as path variable
// From <div class="md-file" id="master recovery"></div>
// To master/recovery
var path = $(target).attr('id').split(' ').join('/');
```

**Usage**

Variables are used for the AJAX request URL.
Variables `user` and `repository` are taken from the `scripts.js`, while `path`
is taken from IDs of HTML element `<div class="md-file"></div>` within the .html files.
```js
// Variabales Usage
// url: 'https://raw.githubusercontent.com/'+user+'/'+repository+'/'+path+'/README.md';
// Example Output
// https://raw.githubusercontent.com/deadbok/project_network/master/recovery/README.md
```

## 3. Conclusion

This collection of files will allow an easy way of displaying an online version of a Markdown (.md) file, as long as an Internet Connection is available.
With basic knowledge about HTML, a simple static website can become an easy task.

### But this project isn't about static files or websites, it's about **networking**

Info on Project Network:
[https://deadbok.github.io/project_network/about](https://deadbok.github.io/project_network/about)
