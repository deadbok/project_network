# Project Network
## Group7 at EAL ITET2016

### 1. Introduction

This is a collection of static files used for displaying other static files in
an orderly and stylish way.

Web page: [https://deadbok.github.io/project_network/](https://deadbok.github.io/project_network/)
Master Repository: [https://github.com/deadbok/project_network/tree/master/](https://github.com/deadbok/project_network/tree/master/)

It grabs a Markdown (README.md) file from GitHub, over the Great Internet and
throws it in the part of the page where you want to display it.
In order for this to work, you need a (GitHub Pages Branch)[https://pages.github.com/]

### 2. Usage/Settings

Grab and render Markdown (.md) file from GitHub online repository.
Using [jQuery](https://jquery.com/) Ajax request and [Showdown](https://github.com/showdownjs/showdown)
```html
<div class="md-file" id="master recovery"></div>
```

Build list of heading from Markdown file using [Anchorific](https://github.com/renettarenula/anchorific.js/)
```html
<nav class='anchorific'></nav>
```

Add your custom information in `assets/js/scripts.js`

```js
// Define GitHub User
var user			= 'GitHub_User';

// Define Repository Name
var repository		= 'GitHub_Repo_Name';

// Define HTML element classes
var target			= '.md-file'; // <div class="md-file"></div>
var error_message	= '.ajax-error'; // <div class="ajax-error"></div>

// Get element class as path variable
// From <div class="md-file" id="master recovery"></div>
// To master/recovery
var path = $(target).attr('id').split(' ').join('/');

// Variabales Usage
url: 'https://raw.githubusercontent.com/'+user+'/'+repository+'/'+path+'/README.md'
```
---

Example Output
[https://raw.githubusercontent.com/deadbok/project_network/master/recovery/README.md](https://raw.githubusercontent.com/deadbok/project_network/master/recovery/README.md)
