/*global module:false*/
/*
	SLDBrowser : Semantic Linked Data Browser
	Copyright (C) 2014  Clement Menoret

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
module.exports	=	function(	grunt	)	{
	//	grunt	init	config
	grunt.initConfig(
		{
			//	load	package.json	data
			//	pkg
			pkg						:	grunt.file.readJSON(	'package.json'	)
			// banner	template
			// banner
			,	banner			:	'/*! <%=	pkg.title	||	pkg.name	%> - v<%=	pkg.version	%> - '
				+	'<%=	grunt.template.today(	"yyyy-mm-dd"	)	%>'
				+	"\n"
				+	'<%=	pkg.homepage	?	"* "	+	pkg.homepage	+	"\\n"	:	""	%>'
				+	'* Copyright (c) <%=	grunt.template.today(	"yyyy"	)	%> <%=	pkg.author.name	%> ;'
				+	"\n"
				+	' Licensed <%=	pkg.licenses.join(	",	"	)	%> */'
				+	"\n"
			// task configuration
			// concat
			,	concat			:	{
				options	:	{
					banner					:	'<%=	banner	%>'
					,	stripBanners	:	true
				},
				dist		:	{
					separator	:	';'
					,	src			:	'<%=	pkg.sldbfiles	%>'
					,	dest		:	'cat/<%=	pkg.name	%>.cat.js'
				}
			}
			//	grep
			,	grep				:	{
				clean	:	{
					files			:	{
						'<%=	concat.dist.dest	%>'	:	['<%=	concat.dist.dest	%>']
					}
					,	options	:	{
						pattern					:	'for_mocha'
						,	fileOverride	:	true
					}
				}
			}
			//	uglify
			,	uglify			:	{
				options	:	{
					preserveComments	:	false
					,	banner					:	'<%=	banner	%>'
				}
				,	dist	:	{
					src			:	'<%=	concat.dist.dest	%>'
					,	dest	:	'min/<%=	pkg.name	%>.min.js'
				}
			}
			//	jshint
			,	jshint			:	{
				options			:	{
					bitwise					:				false
					,	camelcase			:				false
					,	curly					:				false
					,	eqeqeq				:				false
					,	es3						:				false
					,	forin					:				false
					,	freeze				:				false
					,	immed					:	true
					,	indent				:				false
					,	latedef				:	true
					,	newcap				:	true
					,	noarg					:	true
					,	noempty				:	true
					,	nonew					:				false
					,	plusplus			:				false
					,	quotmark			:				false
					,	undef					:	true
					,	unused				:				false
					,	strict				:				false
					,	trailing			:				false
					,	asi						:	true
					,	boss					:				false
					,	debug					:				false
					,	eqnull				:	true
					,	esnext				:	true
					,	evil					:				false
					,	expr					:	true
					,	funcscope			:				false
					,	gcl						:	true
					,	globalstrict	:				false
					,	iterator			:				false
					,	lastsemic			:	true
					,	laxbreak			:	true
					,	laxcomma			:	true
					,	loopfunc			:	true
					,	maxerr				:	20
					,	moz						:	true
					,	multistr			:	true
					,	notypeof			:				false
					,	proto					:				false
					,	scripturl			:				false
					,	smarttabs			:	true
					,	shadow				:				false
					,	sub						:	true
					,	supernew			:	true
					,	validthis			:	true
					,	browser				:	true
					,	couch					:	true
					,	devel					:	true
					,	dojo					:	true
					,	jquery				:	true
					,	mootools			:	true
					,	node					:	true
					,	nonstandard		:				false
					,	phantom				:	true
					,	prototypejs		:	true
					,	rhino					:	true
					,	worker				:	true
					,	wsh						:	true
					,	yui						:	true
					,	globals				:	{
						"jQuery"														:	true
						,	"Masonry"													:	true
						,	"Mapping"													:	true
						,	"suggestionsFor"									:	true
						,	"displayPageLoading"							:	true
						,	"InternalTripleStore"						:	true
						,	"Triple"													:	true
						,	"imgdepictionuri"									:	true
						,	"imgdepictionstr"									:	true
						,	"commenturi"											:	true
						,	"commentstr"											:	true
						,	"labeluri"												:	true
						,	"getCleanTopbarUri"								:	true
						,	"getCleanTopbarEndpoint"					:	true
						,	"ITS"															:	true
						,	"rebuilddefaultworkspace"					:	true
						,	"hashtagworkspaceid"							:	true
						,	"objectids"												:	true
						,	"nextobjectid"										:	true
						,	"nextmapid"												:	true
						,	"nexttimelineid"									:	true
						,	"objectid_to_uri"									:	true
						,	"object_has_expanded_predicates"	:	true
						,	"webappfullcontainer"							:	true
						,	"msnry"														:	true
						,	"actionhistory"										:	true
						,	"actionhistory_pointer"						:	true
						,	"displayPageImageLoading"					:	true
						,	"imagesLoaded"										:	true
						,	"displayPageLoaded"								:	true
						,	"setCleanTopbarUri"								:	true
						,	"xmlDoc"													:	true
						,	"knownPredicates"									:	true
						,	"url_data"												:	true
						,	"OpenLayers"											:	true
						,	"parseDate"												:	true
						,	"nextsuggestionseditorid"					:	true
					}
				}
				//	gruntfile
				,	gruntfile	:	{
					src	:	'Gruntfile.js'
				}
				//	src_files
				,	src_files	:	{
					src	:	'<%=	pkg.sldbfiles	%>'
				}
			}
			//	mochacli
			,	mochacli		:	{
				options	:	{
					reporter	:	'spec'
					,	ui			:	'bdd'
				}
				,	all		:	[	'test/*.js'	]
			}
			//	qunit
			,	qunit				: {
				files	:	[	'test/**/*.html'	]
			}
			//	lib_test
			,	lib_test		:	{
				files		:	'<%=	jshint.lib_test.src	%>'
				,	tasks	:	[	'jshint:lib_test',	'qunit'	]
			}
		}
	);
	//	register	plugins
	grunt.loadNpmTasks(	'grunt-contrib-concat'	);
	grunt.loadNpmTasks(	'grunt-grep'						);
	grunt.loadNpmTasks(	'grunt-contrib-uglify'	);
	grunt.loadNpmTasks(	'grunt-contrib-qunit'		);
	grunt.loadNpmTasks(	'grunt-mocha-cli'				);
	grunt.loadNpmTasks(	'grunt-contrib-jshint'	);
	//	register	tasks
	grunt.registerTask(	'lint'				,	[	'jshint'																	]	);
	grunt.registerTask(	'test'				,	[	'mochacli'																]	);
	grunt.registerTask(	'concatfiles'	,	[	'concat'																	]	);
	grunt.registerTask(	'clean'				,	[	'grep'																		]	);
	grunt.registerTask(	'quality'			,	[	'lint'				,	'test'										]	);
	grunt.registerTask(	'minify'			,	[	'concatfiles'	,	'clean'				,	'uglify'	]	);
	grunt.registerTask(	'qcc'					,	[	'quality'			,	'concatfiles'	,	'clean'		]	);
	grunt.registerTask(	'all'					,	[	'quality'			,	'minify'									]	);
	grunt.registerTask(	'default'			,	[	'quality'																	]	);
};
