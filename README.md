#SLDBrowser &nbsp; [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) [![Build Status](https://travis-ci.org/clemeno/SLDBrowser.svg?branch=dev)](https://travis-ci.org/clemeno/SLDBrowser) [![Dependency Status](https://gemnasium.com/clemeno/SLDBrowser.svg)](https://gemnasium.com/clemeno/SLDBrowser#development-dependencies)

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

###1. SLDBrowser (dev)

Semantic Linked Data Browser, a semantic web browser with
- ☆ Dynamic *SPARQL endpoint* (data-source) selection
- ☆ Language *facet* (more *facets* later)
- ☆ *Knowledge* discovery, recording and selection from the global uncoordinated distributed graph
- ☆ Automatic (and later: crowdsourced) data visualisation *suggestions*
- ☆ *Visualisation* map, timeline (more *visualisations* later)

\[ [Try it online (dev)](http://pirmil.eu/) \]

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

###2. Build

####2.1 Requires

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

[![Dependency Status](https://gemnasium.com/clemeno/SLDBrowser.svg)](https://gemnasium.com/clemeno/SLDBrowser#development-dependencies)
Command **$** `npm update` will update your local dependancies after a devDependancies update.

--

####2.3 **Grunt** build

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

Copyright © 2014 Clément Ménoret

>	SLDBrowser : Semantic Linked Data Browser
>
>	Copyright (C) 2014  Clement Menoret
>
>	This program is free software: you can redistribute it and/or modify
>	it under the terms of the GNU General Public License as published by
>	the Free Software Foundation, either version 3 of the License, or
>	(at your option) any later version.
>
>	This program is distributed in the hope that it will be useful,
>	but WITHOUT ANY WARRANTY; without even the implied warranty of
>	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
>	GNU General Public License for more details.
>
>	You should have received a copy of the GNU General Public License
>	along with this program.  If not, see <http://www.gnu.org/licenses/>.
