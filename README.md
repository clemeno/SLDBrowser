#SLDBrowser &nbsp; [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Build Status](https://travis-ci.org/clemeno/SLDBrowser.svg?branch=dev)](https://travis-ci.org/clemeno/SLDBrowser) 

**Keywords:** `Semantic Web` `Linked Data` `browser` `exploration` `data visualisation` `suggestion` `crowdsourcing`

--

###Content
1. SLDBrowser (dev)
2. Build
 - 2.1 Requires
 - 2.2 **npm** dependencies
 - 2.3 **Grunt** build
3. Deploy
4. Temporary License

--

**Labels:** 
<ul>
 <li>☆ application feature <em>set</em></li>
 <li>□ manually (by the user) checked <em>set</em></li>
 <li>◊ automatically checked <em>set</em></li>
</ul>
<ol>
 <li>☆ application feature (<strong>ordered</strong>) <em>list</em></li>
 <li>□ manually (by the user) checked (<strong>ordered</strong>) <em>list</em></li>
 <li>◊ automatically checked (<strong>ordered</strong>) <em>list</em></li>
</ol>

--

###1. SLDBrowser (dev)

Semantic Linked Data Browser, a semantic web browser with 
- ☆ Dynamic *SPARQL endpoint* (data-source) selection
- ☆ Language *facet* (more *facets* later)
- ☆ Knowledge discovery, recording and selection from the global uncoordinated distributed graph
- ☆ Automatic (and later: crowdsourced) data visualisation suggestions
- ☆ Visualisation map, timeline (later)

\[ [Try it online (dev)](http://pirmil.eu/) \]

--

###2. Build

###2.1 Requires

Software installed **Node.js** with **npm** for your operating system and a **Grunt client** module installed. 
 1. □ **Node.js** with **npm** (http://nodejs.org/ with **npm** *included*) 
 2. □ **Grunt client** **$** `npm install -g grunt-cli` (http://gruntjs.com/) 

--

####2.2 **npm** dependencies

Command **$** `npm install` 

Will locally install: 
- ◊ **Grunt**
- ◊ **JSHint**
- ◊ **Mocha**
- ◊ **Concat**
- ◊ **Grep**
- ◊ **Uglify**

--

###2.3 **Grunt ** build

Command **$** `grunt all`

Will perform all **Grunt** *tasks*: 
 1. ◊ lint
 2. ◊ test
 3. ◊ concat
 4. ◊ clean
 5. ◊ minify

--

###3. Deploy

Put the following files &amp; folders to a web server: 
- □ *.html
- □ *.css
- □ *.cur
- □ imagesloaded.pkgd.min.js
- □ masonry.pkgd.min.js
- □ img/*
- □ min/*

--

###4. Temporary License

Copyright © 2014 Clément Ménoret ; Creative Commons (CC) BY-NC-ND
