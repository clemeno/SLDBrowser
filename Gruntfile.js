/*global module:false*/
module.exports = function( grunt ) {

// Project configuration.
grunt.initConfig({
// Metadata.
pkg: grunt.file.readJSON( 'package.json' ),
banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
'<%= grunt.template.today( "yyyy-mm-dd" ) %>\n' +
'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
'* Copyright (c) <%= grunt.template.today( "yyyy" ) %> <%= pkg.author.name %>;' +
' Licensed <%= pkg.licenses.join( ", " ) %> */\n', // <%= _.pluck(pkg.licenses, "type").join(", ") %> 
// Task configuration.
concat: {
options: {
banner: '<%= banner %>',
stripBanners: true
},
dist: {
separator: ';', 
src: '<%= pkg.sldbfiles %>', // <%= pkg.name %> 
dest: 'cat/<%= pkg.name %>.cat.js' // <%= pkg.name %> 
}
},
grep: {
clean: {
files: {
'<%= concat.dist.dest %>': ['<%= concat.dist.dest %>']
}, 
options: { 
pattern: 'for_mocha', 
fileOverride: true 
} 
}
}, 
uglify: {
options: {
preserveComments: false, 
banner: '<%= banner %>'
},
dist: {
src: '<%= concat.dist.dest %>',
dest: 'min/<%= pkg.name %>.min.js'
}
},
jshint: {
options: {
bitwise: false, 
camelcase: false, 
curly: false,
eqeqeq: false,
es3: false, 
forin: false, 
freeze: false, 
immed: true,
indent: false, 
latedef: true,
newcap: true,
noarg: true,
noempty: true,
nonew: false, 
plusplus: false, 
quotmark: false, 
undef: true,
unused: false,
strict: false, 
trailing: false, 
asi: true, 
boss: false,
debug: false,
eqnull: true,
esnext: true, 
evil: false, 
expr: true, 
funcscope: false, 
gcl: true, 
globalstrict: false, 
iterator: false, 
lastsemic: true, 
laxbreak: true, 
laxcomma: true, 
loopfunc: true, 
maxerr: 20,
moz: true, 
multistr: true, 
notypeof: false, 
proto: false, 
scripturl: false, 
smarttabs: true, 
shadow: false, 
sub: true, 
supernew: true, 
validthis: true, 
browser: true,
couch: true,
devel: true,
dojo: true,
jquery: true,
mootools: true,
node: true,
nonstandard: false,
phantom: true,
prototypejs: true,
rhino: true,
worker: true,
wsh: true,
yui: true,
globals: {
"jQuery": true, 
"Masonry": true, 
"Mapping": true, 
"suggestionsFor": true, 
"displayPageLoading": true, 
"InternalTrippleStore": true, 
"Tripple": true
, "imgdepictionuri": true 
, "imgdepictionstr": true 
, "commenturi": true 
, "commentstr": true 
, "labeluri": true 
, "getCleanTopbarUri": true 
, "getCleanTopbarEndpoint": true 
, "ITS": true 
, "rebuilddefaultworkspace": true 
, "hashtagworkspaceid": true 
, "objectids": true 
, "nextobjectid": true 
, "nextmapid": true 
, "nexttimelineid": true 
, "objectid_to_uri": true 
, "object_has_expanded_predicates": true 
, "webappfullcontainer": true 
, "msnry": true 
, "actionhistory": true 
, "actionhistory_pointer": true 
, "displayPageImageLoading": true 
, "imagesLoaded": true 
, "displayPageLoaded": true 
, "setCleanTopbarUri": true 
, "xmlDoc": true 
, "knownPredicates": true 
, "url_data": true 
, "OpenLayers": true 
, "parseDate": true 
//, "": true 
//, "": true 
//, "": true 
//, "": true 
//, "": true 
}
},
gruntfile: {
src: 'Gruntfile.js'
},
src_files: {
src: '<%= pkg.sldbfiles %>' // ['lib/**/*.js', 'test/**/*.js']
}
},
qunit: {
files: ['test/**/*.html']
},
mochacli: {
options: {
reporter: "spec",
ui: "bdd"
},
all: ["test/*.js"]
},
watch: {
gruntfile: {
files: '<%= jshint.gruntfile.src %>',
tasks: ['jshint:gruntfile']
},
lib_test: {
files: '<%= jshint.lib_test.src %>',
tasks: ['jshint:lib_test', 'qunit']
}
}
});

// These plugins provide necessary tasks.
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-grep');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-mocha-cli');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');

// Default task.
grunt.registerTask('test', ['mochacli']);
grunt.registerTask('lint', ['jshint']);
grunt.registerTask('quality', ['lint', 'test']);
grunt.registerTask('concatfiles', ['concat']);
grunt.registerTask('clean', ['grep']); 
grunt.registerTask('minify', ['concatfiles', 'clean', 'uglify']);
grunt.registerTask('qcc', ['quality', 'concatfiles', 'clean']);
grunt.registerTask('all', ['quality', 'minify']);
grunt.registerTask('default', ['quality']);


};
