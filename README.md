#SLDBrowser

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Build Status](https://travis-ci.org/clemeno/SLDBrowser.svg?branch=dev)](https://travis-ci.org/clemeno/SLDBrowser) 

> **Keywords:** 
> `Semantic Web` `Linked Data` `browser` `exploration` `data visualisation` `suggestion` `crowdsourcing`

---

###Content

 1. SLDBrowser (dev)
 2. Build
  2.1 Requires
  2.2 **npm** dependencies
  2.3 **Grunt ** build
 3. Deploy
 4. Temporary License

<br />

> **Labels:** 
> &nbsp;&nbsp;&nbsp;&nbsp;&star; application feature
> &nbsp;&nbsp;&nbsp;&nbsp;&squ; manually checked by the user
> &nbsp;&nbsp;&nbsp;&nbsp;&loz; automatically checked

---

##1. SLDBrowser (dev)

Semantic Linked Data Browser, a semantic web browser with 

 &nbsp;&nbsp;&nbsp;&nbsp;&star; Dynamic *SPARQL endpoint* (data-source) selection
 &nbsp;&nbsp;&nbsp;&nbsp;&star; Language *facet* (more *facets* later)
 &nbsp;&nbsp;&nbsp;&nbsp;&star; Knowledge discovery, recording and selection from the global uncoordinated distributed graph
 &nbsp;&nbsp;&nbsp;&nbsp;&star; Automatic (and later: crowdsourced) data visualisation suggestions
 &nbsp;&nbsp;&nbsp;&nbsp;&star; Visualisation map, timeline (later)

\[ [Try it online (dev)](http://pirmil.eu/) \]

---

##2. Build

###2.1 Requires

Software installed **Node.js** with **npm** for your operating system and a **Grunt client** module installed. 

 1. &squ; **Node.js** with **npm** (http://nodejs.org/ with **npm** *included*) 
 2. &squ; **Grunt client** **$** `npm install -g grunt-cli` (http://gruntjs.com/) 

---

###2.2 **npm** dependencies

Command **$** `npm install` 

Will locally install: 

 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **Grunt**
 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **JSHint**
 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **Mocha**
 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **Concat**
 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **Grep**
 &nbsp;&nbsp;&nbsp;&nbsp;&loz; **Uglify**

---

###2.3 **Grunt ** build

Command **$** `grunt all`

Will perform all **Grunt** *tasks*: 

 1. &loz; lint
 2. &loz; test
 3. &loz; concat
 4. &loz; clean
 5. &loz; minify

---

##3. Deploy

Put the following files &amp; folders to a web server: 

 &nbsp;&nbsp;&nbsp;&nbsp;&squ; *.html
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; *.css
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; *.cur
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; imagesloaded.pkgd.min.js
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; masonry.pkgd.min.js
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; img/*
 &nbsp;&nbsp;&nbsp;&nbsp;&squ; min/*

---

##4. Temporary License

Copyright © 2014 Clément Ménoret ; Creative Commons (CC) BY-NC-ND
