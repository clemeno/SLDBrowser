//	controls	-------------------------------------------------------
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
//	clear
function	clearbrowser_click()	{
	$(	'#webappcontrol'		).html(	''	);
	$(	hashtagworkspaceid	).html(	''	);
	rebuilddefaultworkspace();
	ITS	=	new	InternalTrippleStore();
	objectids	=	[];
	nextobjectid						=	0;
	nextmapid								=	0;
	nexttimelineid					=	0;
	nextsuggestionseditorid	=	0;
	objectid_to_uri	=	new	Mapping();
	object_has_expanded_predicates	=	{};
	suggestionsFor	=	new	Mapping();
}

//	browse
function	startbrowsing_click()	{
	//	entry	point	start
	displayPageLoading();
	var	langcode									=	$(	'#langselector'	).val()
	,		defaultquery							=	[
				getCleanTopbarEndpoint()
				,	'select distinct ?p ?o where { <'	+	getCleanTopbarUri()	+	'> ?p ?o }'
			]
	,		defaultquery_responsetext	=	null
	,		xmlDoc										=	null
	,		results										=	[]
	,		result										=	null
	,		predicates								=	[]
	,		predicate_object					=	[]
	,		current_predicate					=	''
	,		current_object						=	''
	,		lang_attribute_value			=	''
	,		xml_lang_attribute_value	=	''
	,		datatype_attribute_value	=	''
	,		labelstr									=	''
	,		labeluri									=	'http://www.w3.org/2000/01/rdf-schema#label'
	,		commentstr								=	''
	,		commenturi								=	'http://www.w3.org/2000/01/rdf-schema#comment'
	,		imgdepictionstr						=	''
	,		imgdepictionuri						=	'http://xmlns.com/foaf/0.1/depiction'
	,		predicateliststr					=	''
	,		refendpointsliststr				=	''
	,		refurisliststr						=	''
	,		t													=	false
	,		objectidstr								=	''
	,		objecthtml								=	false
	,		objecthtml_elem						=	false
	,		fragment_objecthtml				=	false
	,		objecthtmls								=	[]
	;
	//	get	query	results
	defaultquery_responsetext	=	$.ajax(
		{
			type		:	'POST'
			,	url		:	defaultquery[	0	]
			,	data	:	'query='	+	encodeURIComponent(	defaultquery[	1	]	)	//	+	'&timeout='	+	defaulttimeout,
			,	async	:	false
		}
	).responseText;
	//	parse	results
	if	(	window.DOMParser	)	{
		xmlDoc	=	new	DOMParser().parseFromString(	defaultquery_responsetext,	'text/xml'	);
	}	else	{
		xmlDoc	=	new	ActiveXObject(	'Microsoft.XMLDOM'	);
		xmlDoc.async	=	false;
		xmlDoc.loadXML(	defaultquery_responsetext	);
	}
	results	=	xmlDoc.getElementsByTagName(	'result'	);	//	/!\	stupid	xml	parser	does	NOT	return	an	Array

	//	results	in	form	of	predicate	->	object	for	the	same	subject
	//	=============================================	XML	to	js	=============================================
	//	old	fashion	loop	beacause	of	the	stupid	xml	parser
	for	(	var	i	=	0	;	i	<	results.length	;	i++	)	{
		result	=	results[	i	];
		if	(	result.childNodes[	1	].childNodes[	0	].tagName	==	'uri'	)	{
			//	uri	predicate	---------------------------------------------------------------------------------------
			current_predicate	=	result.childNodes[	1	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
			if	(	!predicates.hasValue(	current_predicate	)	)	{
				predicates.push(	current_predicate	);
				predicate_object[	current_predicate	]	=	[];
			}
		}
		if	(					result.childNodes[	3	].childNodes[	0	].tagName	==	'uri'			)	{
			//	uri	object	------------------------------------------------------------------------------------------
			try	{
				current_object	=	result.childNodes[	3	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
			}	catch	(	err	)	{
				current_object	=	'';
			}
			predicate_object[	current_predicate	].push(	[	'uri',	current_object,	false,	false	]	);
		}	else	if	(	result.childNodes[	3	].childNodes[	0	].tagName	==	'literal'	)	{
			//	literal	object	--------------------------------------------------------------------------------------
			try	{
				current_object	=	result.childNodes[	3	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
			}	catch	(	err	)	{
				current_object	=	'';
			}
			lang_attribute_value			=	result.childNodes[	3	].childNodes[	0	].getAttribute(	'lang'			);
			xml_lang_attribute_value	=	result.childNodes[	3	].childNodes[	0	].getAttribute(	'xml:lang'	);
			datatype_attribute_value	=	result.childNodes[	3	].childNodes[	0	].getAttribute(	'datatype'	);
			if	(					!!lang_attribute_value			)	{
				predicate_object[	current_predicate	].push(
					[	'literal'	,	current_object	,	'lang'			,	lang_attribute_value			]
				);
			}	else	if	(	!!xml_lang_attribute_value	)	{
				predicate_object[	current_predicate	].push(
					[	'literal'	,	current_object	,	'xml:lang'	,	xml_lang_attribute_value	]
				);
			}	else	if	(	!!datatype_attribute_value	)	{
				predicate_object[	current_predicate	].push(
					[	'literal'	,	current_object	,	'datatype'	,	datatype_attribute_value	]
				);
			}	else	{
				predicate_object[	current_predicate	].push(
					[	'literal'	,	current_object	,	false				,	false											]
				);
			}
		}
	}
	//	build	html	string	for	display	+	model	update
	predicates.forEach(	function(	predicate	)	{
		predicate_object[	predicate	].forEach(	function(	current_object	)	{
			if	(
				(	current_object[	3	]	==	langcode	)	||
				(	current_object[	0	]	==	'uri'	)	||
				(	(	langcode	==	'en'	)	&&	(	current_object[	0	]	==	'literal'	)	&&	(	!current_object[	3	]	)	)
			)	{
				if	(					predicate	==	labeluri				)	{
					labelstr				+=	'<span	class="selectable">'	+	current_object[	1	]	+	'</span>'
						+	'<div	class="ib">'	+	(	(	langcode	==	'en'	)?	''	:	'&nbsp;('	+	langcode	+	')'	)	+	'</div>'
						;
					t	=	new	Tripple(	getCleanTopbarUri()	,	labeluri				,	current_object[	1	]	);	//	update	model
				}	else	if	(	predicate	==	commenturi			)	{
					commentstr			+=	'<span	class="selectable">'	+	current_object[	1	]	+	'</span>';
					t	=	new	Tripple(	getCleanTopbarUri()	,	commenturi			,	current_object[	1	]	);	//	update	model
					//	if	(	!ITS.addTripple(	t	)	)	{	alert(	'Not	added:	'	+	t	);	};
				}	else	if	(	predicate	==	imgdepictionuri	)	{
					imgdepictionstr	+=	'<img	src="'	+	current_object[	1	]	+	'"	title="&nbsp;"	alt="&nbsp;"	'
						+		'onclick="toggleBigImage1(this)"	/>'
						;
					t	=	new	Tripple(	getCleanTopbarUri()	,	imgdepictionuri	,	current_object[	1	]	);	//	update	model
				}
				if	(	!!t	)	{	ITS.addTripple(	t	)	}	//	commit	update	model
			}
		}	);
	}	);
	//	template	to	display	a	node	:
	objectidstr	=	'objectid'	+	nextobjectid;
	objecthtml	=	$(
		'<div	class="item	object"	id="'	+	objectidstr	+	'">'
		+		'<div	class="hiddeninputssources">'
		+			'<input	type="hidden"	name="uri"	value="'	+	getCleanTopbarEndpoint()	+	'"	/>'
		+		'</div>'
		+		'<button	onclick="idontneedtoknowabout('	+	"'"	+	objectidstr	+	"'"	+	')">X</button>'
		+		'<button	onclick="nodetogglecontent(this,'	+	"'"	+	objectidstr	+	"'"	+	')">-</button>'
		+		'<h4	class="rdfs	label">'	+	labelstr	+	'	</h4>'
		+		'<p	class="rdfs	comment	hideable">'	+	imgdepictionstr	+	commentstr	+	'</p>'
		+		'<div	class="ib	hideable">'
		+			'<button	onclick="seerefendpoints(this,'
		+					"'"	+	objectidstr
		+					"','"	+	getCleanTopbarUri()
		+					"'"
		+				')">See	endpoints...</button>'
		+			'<ul	class="refendpointslist">'	+	refendpointsliststr	+	'</ul>'
		+		'</div>'
		+		'<div	class="ib	hideable">'
		+			'<button	onclick="seerefuris(this,'
		+					"'"	+	objectidstr
		+					"','"	+	getCleanTopbarUri()
		+					"'"
		+				')">See	URIs...</button>'
		+			'<ul	class="refurislist">'	+	refurisliststr	+	'</ul>'
		+		'</div>'
		+		'<div	class="ib	hideable">'
		+			'<button	onclick="seeotherpredicates(this,'
		+					"'"	+	objectidstr
		+					"','"	+	getCleanTopbarUri()
		+					"'"
		+				')">See	other	predicates...</button>'
		+			'<ul	class="predicatelist">'	+	predicateliststr	+	'</ul>'
		+		'</div>'
		+	'</div>'
	);
	objecthtml_elem	=	objecthtml[	0	];
	fragment_objecthtml	=	document.createDocumentFragment();
	fragment_objecthtml.appendChild(	objecthtml_elem	);
	webappfullcontainer.insertBefore(	fragment_objecthtml,	webappfullcontainer.firstChild	);
	objecthtmls.push(	objecthtml_elem	);
	msnry.prepended(	objecthtmls	);
	objectid_to_uri[	objectidstr	]	=	new	Array(	getCleanTopbarUri()	);	//	update	DOM/URIs
	nextobjectid	+=	1;	//	prepare	next	id	number
	object_has_expanded_predicates[	objectidstr	]	=	false;
	actionhistory.push(
		[
			'added'					//	type	of	action	performed
			,	'entrypoint'	//	action	performed	purpose
			,	objectidstr		//	data	stored	depending	on	the	context
				//	here	to	revert	the	changes	we	will	have	to	remove
				//	the	just	created	entrypoint	from	html	DOM
				//	this	is	why	we	need	to	keep	its	ID	to	have	direct	access
				//	to	its	html	entity	on	the	page	and	remove	it
		]
	);
	actionhistory_pointer	+=	1;
	//	images	loading	...
	displayPageImageLoading();
	//	imagesloaded	;)
	imagesLoaded(	document.querySelector(	hashtagworkspaceid	),	function()	{
		msnry.layout();
		$(	'#'	+	objectidstr	).draggable(
			{
				containment	:	'parent'
				,	opacity		:	0.5
				,	cancel		:	'.selectable'
			}
		);
		displayPageLoaded();
	}	);	//	entry	point	ready	with	size	ok	!
}

//	expand	endpoints
function	seerefendpoints(	this_element,	objectidstr,	defaultentryuri	)	{
	displayPageLoading();
	$(	this_element	).hide().remove();
	//	build	html	list	of	already	known	endpoints
	var	endpointslist				=	[]
	,		endpoints_htmllist	=	''
	,		current_endpoint		=	''
	;
	$(	'#'	+	objectidstr	+	'	.hiddeninputssources	input'	).each(	function()	{
		current_endpoint	=	$(	this	).val();
		if	(	!endpointslist.hasValue(	current_endpoint	)	)	{
			endpointslist.push(	current_endpoint	);
			endpoints_htmllist	+=	'<li><span class="selectable">'	+	current_endpoint	+	'</span></li>';
		}
	}	);
	//	display	html	list
	$(	'#'	+	objectidstr	+	' .refendpointslist'	).html(	'<h5>Reference endpoints</h5>'	);
	$(	endpoints_htmllist	).hide().appendTo(	'#'	+	objectidstr	+	' .refendpointslist'	).fadeIn();
	displayPageLoaded();
}

//	expand	uris
function	seerefuris(	this_element,	objectidstr,	defaultentryuri	)	{
	displayPageLoading();
	$(	this_element	).hide().remove();
	//	build	html	list	of	already	known	uris
	var	urls_htmllist	=	'';
	objectid_to_uri[	objectidstr	].forEach(	function(	uri	)	{
		urls_htmllist	+=	'<li><span class="selectable	uri">'	+	uri	+	'</span></li>';
	}	);
	//	display	html	list
	$(	'#'	+	objectidstr	+	' .refurislist'	).html(	'<h5>Reference URIs</h5>'	);
	$(	urls_htmllist	).hide().appendTo(	'#'	+	objectidstr	+	' .refurislist'	).fadeIn();
	displayPageLoaded();
}

function	spawnnode(	uri	)	{
	if	(	!!uri	)	{	setCleanTopbarUri(	uri	);	}
	startbrowsing_click();
}

function	removeitem(	objectidstr	)	{
	msnry.remove(	$(	'#'	+	objectidstr	)[	0	]	);
	msnry.layout();
}

function	idontneedtoknowabout(	objectidstr,	predicateuri,	predicateidstr,	object,	objectinlistidstr	)	{
	displayPageLoading();
	objectid_to_uri[	objectidstr	].forEach(	function(	subjecturi	)	{
		var	t	=	new	Tripple()
		,		askstr	=	'( '
		;
		if	(	!!subjecturi	)	{	t.s	=	subjecturi;	askstr	+=	t.s;	}
		if	(	!!predicateuri	)	{	t.p	=	predicateuri;	askstr	+=	', '	+	t.p;	}
		if	(	!!object	)	{	t.o	=	object;	askstr	+=	', '	+	t.o;	}
		askstr	+=	' )';
		if	(	confirm(	'Forget about '	+	askstr	+	' ?'	)	)	{
			if	(	ITS.removeTripple(	t	).length	===	0	)	{
				if	(	!!objectinlistidstr	&&	!!predicateidstr	&&	!!objectidstr	)	{
					$(	'#'	+	objectidstr	+	' .'	+	predicateidstr	+	' .'	+	objectinlistidstr	).hide().remove();
				}	else	if	(									!!predicateidstr	&&	!!objectidstr	)	{
					$(	'#'	+	objectidstr	+	' .'	+	predicateidstr	).hide().remove();
				}	else	if	(																				!!objectidstr	)	{
					try	{
						delete	suggestionsFor[	objectidstr	];
					}	catch	(	noSuggestionToRemove	)	{
					}	finally	{
						msnry.remove(	$(	'#'	+	objectidstr	)[	0	]	);
					}
				}
				msnry.layout();
			}
		}
	}	);
	displayPageLoaded();
}

//	expand	predicates
function	seeotherpredicates(	this_element,	objectidstr,	defaultentryuri	)	{
	displayPageLoading();
	var	query								=	[
				getCleanTopbarEndpoint()
				,	'select distinct ?p where { <'	+	defaultentryuri	+	'> ?p ?o }'
			]
	,		query_responsetext	=	''
	,		results							=	[]
	,		predicates					=	[]
	,		predicate_object		=	[]
	,		current_predicate		=	''
	,		current_object			=	''
	,		predicates_htmllist	=	''
	,		j										=	0
	;
	//	get	query	results
	query_responsetext	=	$.ajax(
		{
			type		:	'POST'
			,	url		:	query[	0	]
			,	data	:	'query='	+	encodeURIComponent(	query[	1	]	)	//	+	'&timeout='	+	defaulttimeout,
			,	async	:	false
		}
	).responseText;
	//	parse	results
	if	(	window.DOMParser	)	{
		xmlDoc	=	new	DOMParser().parseFromString(	query_responsetext,	'text/xml'	);
	}	else	{
		xmlDoc	=	new	ActiveXObject(	'Microsoft.XMLDOM'	);
		xmlDoc.async	=	false;
		xmlDoc.loadXML(	query_responsetext	);
	}
	results	=	xmlDoc.getElementsByTagName(	'result'	);
	//	results	in	form	of	predicate	->	object	for	the	same	subject
	j	=	0;
	for	(	var	i	=	0	;	i	<	results.length	;	i++	)	{
		if	(	results[	i	].childNodes[	1	].childNodes[	0	].tagName	==	'uri'	)	{
			//	uri	predicate	---------------------------------------------------------------------------------------
			current_predicate	=	results[	i	].childNodes[	1	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
			if	(	!predicates.hasValue(	current_predicate	)	)	{
				predicates.push(	current_predicate	);
				predicates_htmllist	+=	'<li>'
					+		'<span	class="selectable	uri">'	+	current_predicate	+	'</span>'
					+		'<img	class="nodespawner"	src="img/expandtree001.gif"	alt=""	title=""'
					+			'width="9px"	height="9px"	onclick="spawnnode('	+	"'"	+	current_predicate	+	"'"	+	');"	/> '
					+		'<div>'
					+			'<button	onclick="seeobjectshere(this,'
					+				"'"	+	objectidstr
					+				"','"	+	current_predicate
					+				"',"	+	j
					+				')">See	objects...</button>'
					+			'<button	onclick="idontneedtoknowabout('
					+				"'"	+	objectidstr
					+				"','"	+	current_predicate
					+				"','"	+	'predicate'	+	j
					+				"'"
					+			')">X</button>'
					+		'</div>'
					+		'<ul	class="objectlist	predicate'	+	j	+	'"></ul>'
					+	'</li>'
					;
				j	+=	1;
			}
		}
	}
	$(	this_element	).hide().remove();
	//	display	html	list
	$(	'#'	+	objectidstr	+	' .predicatelist'	).html(	'<h5>Known predicates</h5>'	);
	$(	predicates_htmllist	).hide().appendTo(	'#'	+	objectidstr	+	' .predicatelist'	).fadeIn();
	//	new	state	of	the	object
	object_has_expanded_predicates[	objectidstr	]	=	true;
	displayPageLoaded();
}

function	seeobjectshere(	this_element,	objectidstr,	predicateuri,	predicate_number	)	{
	displayPageLoading();
	$(	this_element	).hide().remove();
	var	endpointslist				=	[]
	,		uris_list						=	[]
	,		literals_list				=	[]
	,		query								=	null
	,		query_responsetext	=	''
	,		results							=	[]
	,		current_object			=	''
	,		suggestion					=	''
	,		bLabel							=	false
	,		bDate								=	false
	,		bNumber							=	false
	,		bLongitude					=	false
	,		bLatitude						=	false
	,		t										=	new	Tripple()
	,		T										=	new	Tripple()
	,		objects_htmlstr			=	''
	,		l										=	0
	;
	//	endpoints	list
	$(	'#'	+	objectidstr	+	' .hiddeninputssources input'	).each(	function()	{
		endpointslist.push(	$(	this	).val()	);
	}	);
	//	uris	list
	//	urislist	===	objectid_to_uri[	objectidstr	]
	//	list	every	element	that	are	object	of	the	relation
	//	query	and	results
	endpointslist.forEach(	function(	endpointurl	)	{
		objectid_to_uri[	objectidstr	].forEach(	function(	subjecturi	)	{
			query	=	[
				endpointurl
				,	'select distinct ?o where { '
					+	' <'	+	subjecturi	+	'> <'	+	predicateuri	+	'> ?o '
					+	'}'
			];
			//	get	query	results
			query_responsetext	=	$.ajax(
				{
					type		:	'POST'
					,	url		:	query[	0	]
					,	data	:	'query='	+	encodeURIComponent(	query[	1	]	)	//	+	'&timeout='	+	defaulttimeout,
					,	async	:	false
				}
			).responseText;
			//	parse	results
			if	(	window.DOMParser	)	{
				xmlDoc	=	new	DOMParser().parseFromString(	query_responsetext,	'text/xml'	);
			}	else	{
				xmlDoc	=	new	ActiveXObject(	'Microsoft.XMLDOM'	);
				xmlDoc.async	=	false;
				xmlDoc.loadXML(	query_responsetext	);
			}
			results	=	xmlDoc.getElementsByTagName(	'result'	);
			l	=	0;
			for	(	var	k	=	0	;	k	<	results.length	;	k++	)	{
				if	(	results[	k	].childNodes[	1	].childNodes[	0	].tagName	==	'uri'	)	{
					//	uri	object	---------------------------------------------------------------------
					current_object	=	results[	k	].childNodes[	1	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
					if	(	!uris_list.hasValue(	current_object	)	)	{
						uris_list.push(	current_object	);
						objects_htmlstr	+=	'<li	class="object'	+	l	+	'">'
							+		'<span	class="selectable	relobject	uri">'	+	current_object	+	'</span>'
							+		'<img	class="nodespawner"	src="img/expandtree001.gif"	alt=""	title=""'
							+			'width="9px"	height="9px"	onclick="spawnnode('	+	"'"	+	current_object	+	"'"	+	');"	/>'
							+		'<button	onclick="idontneedtoknowabout('
							+			"'"	+	objectidstr
							+			"','"	+	predicateuri
							+			"','"	+	'predicate'	+	predicate_number
							+			"','"	+	current_object
							+			"','"	+	'object'	+	l
							+			"'"
							+		')">X</button>'
							+	'</li>'
							;
						l	+=	1;
					}
				}	else	{	//	if	(	results[	k	].childNodes[	1	].childNodes[	0	].tagName	==	'literal'	)	{
					//	literal	object	-----------------------------------------------------------------
					current_object	=	results[	k	].childNodes[	1	].childNodes[	0	].childNodes[	0	].nodeValue	||	'';
					if	(	!literals_list.hasValue(	current_object	)	)	{
						literals_list.push(	current_object	);
						objects_htmlstr	+=	'<li	class="object'	+	l	+	'">'
							+		'<span	class="selectable	relobject	literal">'	+	current_object	+	'</span>'
							+		'<button	onclick="idontneedtoknowabout('
							+			"'"	+	objectidstr
							+			"','"	+	predicateuri
							+			"','"	+	'predicate'	+	predicate_number
							+			"','"	+	current_object
							+			"','"	+	'object'	+	l
							+			"'"
							+		')">X</button>'
							+	'</li>'
							;
						l	+=	1;
					}
				}
				//	detect	visualisation	from	known	tripples	and	this	new	information
				//	then,	T	must	ensure	that:	∀	Tripple	t	=	(	t.s,	t.p,	t.o	),	t	∈	{	t_	Tripple	|	matching(	T	)	}
				if	(	!suggestionsFor.hasOwnProperty(	objectidstr	)	)	{
					suggestionsFor[	objectidstr	]	=	[];
				}
				//	update	model	commit
				t	=	new	Tripple(	subjecturi,	predicateuri,	current_object	);
				ITS.addTripple(	t	);
				//	=================================================================================
				suggestion	=	'map';	//	Can	we	put	this	concept	on	a	map	?
				//	=================================================================================
				if	(	!suggestionsFor[	objectidstr	].some(	function(	s	)	{	return	(	s	===	suggestion	);	}	)	)	{
					//	If	it	has	longitude...
					knownPredicates[	'geo'	][	'longitude'	].forEach(	function(	types	)	{
						types.forEach(	function(	pattern	)	{
							T.s	=	t.s;
							bLongitude	=	ITS.getTripplesMatching(	T	).some(	function(	t_	)	{
								return	(	t_.p.indexOf(	pattern	)	>	-1	);
							}	);
						}	);
					}	);
					//	...and	latitude...
					knownPredicates[	'geo'	][	'latitude'	].forEach(	function(	types	)	{
						types.forEach(	function(	pattern	)	{
							T.s	=	t.s;
							bLatitude	=	ITS.getTripplesMatching(	T	).some(	function(	t_	)	{
								return	(	t_.p.indexOf(	pattern	)	>	-1	);
							}	);
						}	);
					}	);
				}
				//	=================================================================================
				suggestion	=	'timeline';	//	Can	we	put	this	concept	on	a	map	?
				//	=================================================================================
				if	(	!suggestionsFor[	objectidstr	].some(	function(	s	)	{	return	(	s	===	suggestion	);	}	)	)	{
					//	If	it	has	a	date...
					knownPredicates[	'date'	].forEach(	function(	formats	)	{
						formats.forEach(	function(	types	)	{
							types.forEach(	function(	pattern	)	{
								T.s	=	t.s;
								bDate	=	ITS.getTripplesMatching(	T	).some(	function(	t_	)	{
									return	(	t_.p.indexOf(	pattern	)	>	-1	);
								}	);
							}	);
						}	);
					}	);
				}
			}
			//	...then	yes	we	can	;)
			if	(	bLongitude	&&	bLatitude	)	{
				suggestionsFor[	objectidstr	].push(	'map'	);
				alert(	'It seems that this concept can be visualised on a map. '	);
			}
			if	(	bDate	)	{
				suggestionsFor[	objectidstr	].push(	'timeline'	);
				alert(	'It seems that this concept can be visualised on a timeline. '	);
			}
		}	);
	}	);
	//	display	the	results
	//	$(	'#'	+	objectidstr	+	'	.predicatelist	.predicate'	+	predicate_number	).html(	'<h6>Known	objects</h6>'	);
	$(	objects_htmlstr	).hide().appendTo(
		'#'	+	objectidstr	+	' .predicatelist .predicate'	+	predicate_number
	).fadeIn();
	displayPageLoaded();
}

//	----------------------------------------------------------------------------------------------------
//	----------------------------------------	<START>	------------------------------------------------------------
//	----------------------------------------------------------------------------------------------------
function	rebuildlayout()	{
	msnry.layout();
}

function	rebuildsafeworkspacewithdata()	{
	//	safe	GET	part
	var	endpointstr	=	url_data.GET(	'endpoint'	,	null	)
	,		uristr			=	url_data.GET(	'uri'				,	null	)
	,		langstr			=	url_data.GET(	'lang'			,	null	)
	;
	rebuilddefaultworkspace(	endpointstr,	uristr,	langstr	);
}
function	rebuilddefaultworkspace(	endpointstr,	uristr,	langstr	)	{
	//	build	default	html	DOM

	$(
		'	<div	class="topdiv">'
		+		'<p>'
		+			'<span	id="webapptitle">'
		+				'<span	id="loading">(Please enable Javascript)</span>	'
		+				'Semantic Linked Data Browser (dev)</span> '
		+				'SLDBrowser  Copyright (C) 2014  Clément Ménoret '
		+				'under GPLv3 license http://www.gnu.org/licenses/gpl-3.0.html'
		+				'<div>Internal representation '
		+					'<button	id="testbutton1"	title="InternalTrippleStore state"	'
		+						'onclick="testbutton1()">Current knowledge</button>'
		+					'<button	id="testbutton3"	title="Visualisation suggestions state"	'
		+						'onclick="testbutton3()">Current suggestions</button>'
		+					'<button	id="testbutton2"	title="Suggestions about predicates visualisation"	'
		+						'onclick="testbutton2()">Suggestions tree</button>'
		+					'<button	id="testbutton4"	title="Edit suggestions about predicates visualisation"	'
		+						'onclick="testbutton4()">Edit suggestions</button>'
		+				'</div>'
		+		'</p>'
		//	+	'<p>Default	endpoint	=	http://dbpedia.org/sparql	;'
		//	+	'default	URI	=	&lt;http://dbpedia.org/resource/Tokyo&gt;</p>'
		+		'<div	id="nav">'
		//	'			<button	id="historyprev"	title="Previous step"	disabled="disabled">&larr;</button>'
		//	'			<label	for="historyprev">Previous</label>'
		//	'			<button	id="historynext"	title="Next step"	disabled="disabled">&rarr;</button>'
		//	'			<label	for="historynext">Next</label>'
		+			'<label	for="defaultendpoint">Endpoint </label>'
		+			'<input	id="defaultendpoint"	value="http://fr.dbpedia.org/sparql"	/>'
		/*
			http://dbpedia.org/sparql
			http://lod.openlinksw.com/sparql
		*/
		+			'<label	for="defaultentryuri"> URI	&lt; </label>'
		+			'<input	id="defaultentryuri"	value="http://fr.dbpedia.org/resource/Al_Pacino"	/>'
		+			'<label	for="defaultentryuri"> &gt; </label>'
		+			'<select	id="langselector">'
		+				'<optgroup	label="Popular">'
		+					'<option	value="en"	selected	>(en)	English	(default)</	option>'
		+					'<option	value="ja"						>(ja)	日本語</							option>'
		+					'<option	value="fr"						>(fr)	Français</					option>'
		+					'<option	value="es"						>(es)	Español</						option>'
		+					'<option	value="de"						>(de)	Deutsch</						option>'
		+					'<option	value="it"						>(it)	Italiano</					option>'
		+					'<option	value="zh"						>(zh)	中文</								option>'
		+				'</optgroup>'
		+				'<optgroup	label="(a-z) Sorted">'
		+					'<option	value="az"			>(az) Azərbaycanca</				option>'
		+					'<option	value="bg"			>(bg) Български</						option>'
		+					'<option	value="br"			>(br) Brezhoneg</						option>'
		+					'<option	value="ca"			>(ca) Català</							option>'
		+					'<option	value="cs"			>(cs) Čeština</							option>'
		+					'<option	value="da"			>(da) Dansk</								option>'
		+					'<option	value="de"			>(de) Deutsch</							option>'
		+					'<option	value="en"			>(en) English (default)</		option>'
		+					'<option	value="es"			>(es) Español</							option>'
		+					'<option	value="et"			>(et) Eesti</								option>'
		+					'<option	value="eo"			>(eo) Esperanto</						option>'
		+					'<option	value="eu"			>(eu) Euskara</							option>'
		+					'<option	value="fa"			>(fa) فارسی</							option>'
		+					'<option	value="fr"			>(fr) Français</						option>'
		+					'<option	value="ko"			>(ko) 한국어</								option>'
		+					'<option	value="id"			>(id) Bahasa Indonesia</		option>'
		+					'<option	value="is"			>(is) Íslenska</						option>'
		+					'<option	value="it"			>(it) Italiano</						option>'
		+					'<option	value="ja"			>(ja) 日本語</								option>'
		+					'<option	value="la"			>(la) Latina</							option>'
		+					'<option	value="nl"			>(nl) Nederlands</					option>'
		+					'<option	value="no"			>(no) Norsk	bokmål</				option>'
		+					'<option	value="pl"			>(pl) Polski</							option>'
		+					'<option	value="pt"			>(pt) Português</						option>'
		+					'<option	value="qu"			>(qu) Runa Simi</						option>'
		+					'<option	value="ru"			>(ru) Русский</							option>'
		+					'<option	value="simple"	>(simple) Simple English</	option>'
		+					'<option	value="sr"			>(sr) Српски / srpski</			option>'
		+					'<option	value="fi"			>(fi) Suomi</								option>'
		+					'<option	value="sv"			>(sv) Svenska</							option>'
		+					'<option	value="tl"			>(tl) Tagalog</							option>'
		+					'<option	value="tr"			>(tr) Türkçe</							option>'
		+					'<option	value="uk"			>(uk) Українська</					option>'
		+					'<option	value="vi"			>(vi) Tiếng Việt</					option>'
		+					'<option	value="zh"			>(zh) 中文</									option>'
		+					'<option	value="zh-yue"	>(zh-yue) 粵語</							option>'
		+				'</optgroup>'
		+			'</select>'
		+			'<button	id="startbrowsing"	title="Start browsing from the URI"	'
		+				'onclick="startbrowsing_click()">►</button>'
		+			'<button	id="clearbrowser"	title="Reset the browser"	onclick="clearbrowser_click()">￭</button>'
		+		'</div>'
		+		'<div>Layout '
		+			'<button	id="rebuildlayout"	title="Reorganise layout"	onclick="rebuildlayout()">⌗</button>'
		+			' &bull; Visualisation '
		+			'<button	id="testbuttonM"	title="Map visualisation"	onclick="testbuttonM()">Map</button>'
		+			'<button	id="testbuttonT"	title="Timeline visualisation"	onclick="testbuttonT()">Timeline</button>'
		+	'</div>'
	).hide().appendTo(	'#webappcontrol'	).fadeIn(	1000	);
	try	{
		if	(	endpointstr	!=	null	)	{
			(
				function	protect()	{
					var	orig_endpointstr	=	getCleanTopbarEndpoint();
					//	in
					try	{
						$(	'#defaultendpoint'	).val(	endpointstr	);
					}	catch	(	err	)	{
						$(	'#defaultendpoint'	).val(	orig_endpointstr	);	//	revert	to	default
					}
				}
			)();
		}
		if	(	uristr	!=	null	)	{
			(
				function	protect()	{
					var	orig_uristr	=	getCleanTopbarUri();
					//	in
					try	{
						$(	'#defaultentryuri'	).val(	uristr	);
					}	catch	(	err	)	{
						$(	'#defaultentryuri'	).val(	orig_uristr	);	//	revert	to	default
					}
				}
			)();
		}
		if	(	langstr	!=	null	)	{
			try	{
				$(	'#langselector option[selected]'	).removeAttr(	'selected'	);
			}	finally	{
				try	{
					$(	'#langselector'	).val(	langstr	);
					$(	'#langselector option[value="'	+	langstr	+	'"]'	).attr(	'selected',	true	);
				}	catch	(	err	)	{
					$(	'#langselector'	).val(	'en'	);
					$(	'#langselector option[value="en"]'	).attr(	'selected',	true	);	//	revert	to	default
				}
			}
		}	else	{
			$(	'#langselector optgroup[label="Popular"] option[value="en"]'	).attr(	'selected',	true	);	//	default
		}
	}	finally	{
		$(	'#spacetop'	).css(	'height',	function(){return	(	24	+	$(	'#webappcontrol'	).height()	)	+	'px';}	);
		if	(	(	endpointstr	!=	null	)	||	(	uristr	!=	null	)	||	(	langstr	!=	null	)	)	{
			startbrowsing_click();
		}
	}
	displayPageLoaded();
}

//	init	workspace
var	ITS	=	new	InternalTrippleStore();
function	testbutton1()	{
	alert(
		'Number of known Tripples = '	+	ITS.countTripplesMatching(	new	Tripple()	)	+	"\n"	+
		ITS.getAllTripples().join(	"\n"	)
	);
}
function	testbutton2()	{
	var	str	=	'';
	knownPredicates.forEach(	function(	types,	type_name	)	{
		str	+=	type_name	+	'	{'	+	"\n";
		types.forEach(	function(	refs,	ref_name	)	{
			str	+=	"\t"	+	ref_name	+	'	{'	+	"\n";
			refs.forEach(	function(	types,	type	)	{
				str	+=	"\t\t"	+	type	+	'	{'	+	"\n";
				types.forEach(	function(	pattern	)	{
					str	+=	"\t\t\t"	+	'"'	+	pattern		+	'"'	+	"\n";
				}	);
				str	+=	"\t\t"	+	'}'	+	"\n";
			}	);
			str	+=	"\t"	+	'}'	+	"\n";
		}	);
		str	+=	'}'	+	"\n";
	}	);
	alert(	str	);
}
function	testbutton3()	{
	var	str	=	'';
	suggestionsFor.forEach(	function(	suggesions,	object	)	{
		str	+=	'Candidate: '	+	object	+	"\n";
		str	+=	'Suggestions for '	+	object	+	' : { '	+	suggesions.join(	', '	)	+	' } '	+	"\n";
	}	);
	if	(	str	===	''	)	{
		str	+=	'No visualisation suggesion. '
	}
	alert(	str	);
}
function	testbutton4()	{
	displayPageLoading();
	if ( nextsuggestionseditorid	===	0 )	{
		var	suggestionseditorhtmls									=	[]
		,		suggestionseditorhtml										=	null
		,		suggestionseditorhtml_elem							=	null
		,		fragment_suggestionseditorhtml					=	null
		,		detectionselectorcontenthtml						=	''
		,		detectionvisualisatontablecontenthtml		=	''
		;
		suggestionseditorhtml	=	$(
			'<div	class="item	timeline"	id="suggestionseditoritem'	+	nextsuggestionseditorid	+	'">'
			+		'<button	onclick="removeitem('	+	"'"	+	'suggestionseditoritem'	+	nextsuggestionseditorid	+	"'"	+	');'
			+			'nextsuggestionseditorid	-=	1;">X</button> '
			+		'<button	onclick="nodetogglecontent(this,'
			+			"'"	+	'suggestionseditoritem'	+	nextsuggestionseditorid	+	"'"	+	')">-</button> '
			+		'<h2	style="display:inline;">Suggestions editor</h2>'
			+		'<div	class="canevas	hideable"	id="suggestionseditor'	+	nextsuggestionseditorid	+	'"></div>'
			+	'</div>'
		);
		suggestionseditorhtml_elem	=	suggestionseditorhtml[	0	];
		fragment_suggestionseditorhtml	=	document.createDocumentFragment();
		fragment_suggestionseditorhtml.appendChild(	suggestionseditorhtml_elem	);
		webappfullcontainer.insertBefore(	fragment_suggestionseditorhtml,	webappfullcontainer.firstChild	);
		suggestionseditorhtmls.push(	suggestionseditorhtml_elem	);
		msnry.prepended(	suggestionseditorhtmls	);
		//	fill	'#suggestionseditor'	+	nextsuggestionseditorid	with	html	content
		$(
			'<div	class="suggestionseditorcontent">'
			+		'<div	class="section detectioneditor">'
			+			'<h3>Detection editor</h3>'
			+			'<div>'
			+				'<table	id="detectionvisualisatontable'	+	nextsuggestionseditorid	+	'">'
			+					'<tr>'
			+						'<th	class="a"	>category</				th>'
			+						'<th	class="b"	>format</					th>'
			+						'<th	class="c"	>specification</	th>'
			+						'<th	class="d"	>uri</						th>'
			+						'<th	class="x"	></								th>'
			+					'</tr>'
			+				'<table>'
			+			'</div>'
			+			'<span	class="interaction">'
			+				'<input	type="text"	id="adetectioninput"								></input>'
			+				'<input	type="text"	id="bdetectioninput"								></input>'
			+				'<input	type="text"	id="cdetectioninput"								></input>'
			+				'<input	type="text"	id="uridetectioninput"	class="uri"	></input>'
			+				'<button	id="updatedetectiontree"	onclick="updatedetectiontree_click('
			+						nextsuggestionseditorid
			+					')">Update</button>'
			+			'</span>'
			+		'</div>'
			+		'<div	class="section	detectionvisualisationeditor">'
			+			'<h3>Detection-visualisation matching editor</h3>'
			+			'<div>'
			+				'<table	id="detectionvisualisatontable'	+	nextsuggestionseditorid	+	'">'
			+					'<tr>'
			+						'<th	class="y"	>Detection</			th>'
			+						'<th	class="z"	>Visualisation</	th>'
			+						'<th	class="x"	></								th>'
			+					'</tr>'
			+					'<tr>	<td	>geo</				td>	<td	>map</						td>	<td	><button	disabled>X</button></	td>	</tr>'
			+					'<tr>	<td	>date</				td>	<td	>timeline</				td>	<td	><button	disabled>X</button></	td>	</tr>'
			+				'<table>'
			+			'</div>'
			+			'<span	class="interaction">'
			+				'<select	id="detectionselector'	+	nextsuggestionseditorid	+	'">'
			+				'</select>'
			+				'<select	id="visualisationselector'	+	nextsuggestionseditorid	+	'">'
			+					'<option	value="map"				>map</			option>'
			+					'<option	value="timeline"	>timeline</	option>'
			+				'</select>'
			+				'<button	id="updatedetectionvisualisaton"	disabled>Update</button>'
			+			'</span>'
			+		'</div>'
			+	'</div>'
		).hide().appendTo(	'#suggestionseditor'	+	nextsuggestionseditorid	).fadeIn();
		//	next	loop	variables	for	knownPredicates
		//	category			as	a
		//	format				as	b
		//	specification	as	c
		//	uri						as	d
		//	fill	detectionvisualisatontable'	+	nextsuggestionseditorid	+	'	with	current	knownPredicates	state
		knownPredicates.forEach(	function(	A,	a	)	{
			A.forEach(	function(	B,	b	)	{
				B.forEach(	function(	C,	c	)	{
					C.forEach(	function(	d	)	{
						detectionvisualisatontablecontenthtml	+=	'<tr>'
							+		'<td>'	+	a	+	'</td><td>'	+	b	+	'</td><td>'	+	c	+	'</td><td>'	+	d	+	'</td>'
							+		'<td><button	onclick="removedetectiontree_click(this,'
							+			nextsuggestionseditorid	+	')">X</button></td>'
							+	'</tr>'
							;
					}	);
				}	);
			}	);
		}	);
		$(	detectionvisualisatontablecontenthtml	).hide().appendTo(
			'#detectionvisualisatontable'	+	nextsuggestionseditorid
		).fadeIn();
		//	fill	detectionselector	with	options
		knownPredicates.forEach(	function(	A,	a	)	{
			detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'">'	+	a	+	'</option>';
			A.forEach(	function(	B,	b	)	{
				detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'.'	+	b	+	'">'	+	a	+	'.'	+	b	+	'</option>';
				B.forEach(	function(	C,	c	)	{
					detectionselectorcontenthtml	+=	'<option	'
						+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'</option>'
						;
					C.forEach(	function(	d	)	{
						detectionselectorcontenthtml	+=	'<option	'
							+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'</option>'
							;
					}	);
				}	);
			}	);
		}	);
		$(	detectionselectorcontenthtml	).hide().appendTo(	'#detectionselector'	+	nextsuggestionseditorid	).fadeIn();
		//	make	the	item	draggable
		$(	'#suggestionseditoritem'	+	nextsuggestionseditorid	).draggable(
			{
				containment	:	'parent'
				,	opacity		:	0.5
				,	cancel		:	'.interaction'
			}
		);
		nextsuggestionseditorid	+=	1;	//	ready	for	next	timeline
		msnry.layout();
	}
	displayPageLoaded();
}
function	removedetectiontree_click(	this_element,	id	)	{
	var	jRow													=	$(	this_element	).parent().parent()	//	button	<	td	<	tr
	,		e															=	jRow.find(	'td:nth-child(1)'	).html().trim()	||	''
	,		f															=	jRow.find(	'td:nth-child(2)'	).html().trim()	||	''
	,		g															=	jRow.find(	'td:nth-child(3)'	).html().trim()	||	''
	,		uri														=	jRow.find(	'td:nth-child(4)'	).html().trim()	||	''
	,		idToDel												=	knownPredicates[	e	][	f	][	g	].indexOf(	uri	)
	,		detectionselectorcontenthtml	=	''
	;
	if	(	idToDel	>	-1	)	{
						knownPredicates[	e	][	f	][	g	].splice(	idToDel,	1	);
	}
	if	(			knownPredicates[	e	][	f	][	g	].length	<	1	)	{
		delete	knownPredicates[	e	][	f	][	g	];
	}
	if	(			knownPredicates[	e	][	f	].count()	<	1	)	{
		delete	knownPredicates[	e	][	f	];
	}
	if	(			knownPredicates[	e	].count()	<	1	)	{
		delete	knownPredicates[	e	];
	}
	jRow.hide().remove();
	$(	'#detectionselector'	+	id	+	' option'	).hide().remove();
	knownPredicates.forEach(	function(	A,	a	)	{
		detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'">'	+	a	+	'</option>';
		A.forEach(	function(	B,	b	)	{
			detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'.'	+	b	+	'">'	+	a	+	'.'	+	b	+	'</option>';
			B.forEach(	function(	C,	c	)	{
				detectionselectorcontenthtml	+=	'<option	'
					+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'</option>'
					;
				C.forEach(	function(	d	)	{
					detectionselectorcontenthtml	+=	'<option	'
						+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'</option>'
						;
				}	);
			}	);
		}	);
	}	);
	$(	detectionselectorcontenthtml	).hide().appendTo(	'#detectionselector'	+	id	).fadeIn();
}
function	addindetectiontable(	e,	f,	g,	uri,	id	)	{
	var	detectionselectorcontenthtml	=	'';
	//	table
	$(
		'<tr>'
		+		'<td>'	+	e	+	'</td><td>'	+	f	+	'</td><td>'	+	g	+	'</td><td>'	+	uri	+	'</td>'
		+		'<td><button	onclick="removedetectiontree_click(this,'	+	id	+	')">X</button></td>'
		+	'</tr>'
	).hide().appendTo(	'#detectionvisualisatontable'	+	id	).fadeIn();
	//	select
	$(	'#detectionselector'	+	id	+	' option'	).hide().remove();
	knownPredicates.forEach(	function(	A,	a	)	{
			detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'">'	+	a	+	'</option>';
			A.forEach(	function(	B,	b	)	{
				detectionselectorcontenthtml	+=	'<option	value="'	+	a	+	'.'	+	b	+	'">'	+	a	+	'.'	+	b	+	'</option>';
				B.forEach(	function(	C,	c	)	{
					detectionselectorcontenthtml	+=	'<option	'
						+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'</option>'
						;
					C.forEach(	function(	d	)	{
						detectionselectorcontenthtml	+=	'<option	'
							+		'value="'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'">'	+	a	+	'.'	+	b	+	'.'	+	c	+	'#'	+	d	+	'</option>'
							;
					}	);
				}	);
			}	);
		}	);
		$(	detectionselectorcontenthtml	).hide().appendTo(	'#detectionselector'	+	id	).fadeIn();
}
function	updatedetectiontree_click(	id	)	{
	displayPageLoading();
	var	a		=	$(	'#suggestionseditor'	+	id	+	' #adetectioninput'		).val().trim()	||	''
	,		b		=	$(	'#suggestionseditor'	+	id	+	' #bdetectioninput'		).val().trim()	||	''
	,		c		=	$(	'#suggestionseditor'	+	id	+	' #cdetectioninput'		).val().trim()	||	''
	,		uri	=	$(	'#suggestionseditor'	+	id	+	' #uridetectioninput'	).val().trim()	||	''
	;
	if	(	uri	!==	''	)	{
		if	(	!knownPredicates[	a	]	)	{
					knownPredicates[	a	]	=	new	Mapping();
		}
		if	(	!knownPredicates[	a	][	b	]	)	{
					knownPredicates[	a	][	b	]	=	new	Mapping();
		}
		if	(	!knownPredicates[	a	][	b	][	c	]	)	{
					knownPredicates[	a	][	b	][	c	]	=	[];
		}
		if	(	!knownPredicates[	a	][	b	][	c	].hasValue(	uri	)	)	{
					knownPredicates[	a	][	b	][	c	].push(			uri	);
			addindetectiontable(	a,		b,		c,						uri,	id	);
		}	else	{
			alert(	'Detection already active'	);
		}
	}
	displayPageLoaded();
}
function	testbuttonM()	{
	displayPageLoading();
	var	maphtmls					=	[]
	,		maphtml						=	null
	,		maphtml_elem			=	null
	,		fragment_maphtml	=	null
	,		map								=	null
	;
	maphtml	=	$(
		'<div	class="item	map"	id="mapitem'	+	nextmapid	+	'">'
		+		'<button	onclick="removeitem('	+	"'"	+	'mapitem'	+	nextmapid	+	"'"	+	')">X</button>'
		+		'<button	onclick="nodetogglecontent(this,'	+	"'"	+	'mapitem'	+	nextmapid	+	"'"	+	')">-</button>'
		+		'	Visualisation:	map	|	<span	class="timestamp">'
		+			(new	Date()).toLocaleDateString()	+	'&nbsp;'	+	(new	Date()).toLocaleTimeString()
		+		'</span>'
		+		'<div	class="canevas	hideable"	id="map'	+	nextmapid	+	'"></div>'
		+	'</div>'
	);
	maphtml_elem	=	maphtml[	0	];
	fragment_maphtml	=	document.createDocumentFragment();
	fragment_maphtml.appendChild(	maphtml_elem	);
	webappfullcontainer.insertBefore(	fragment_maphtml,	webappfullcontainer.firstChild	);
	maphtmls.push(	maphtml_elem	);
	msnry.prepended(	maphtmls	);
	map	=	new	OpenLayers.Map(	{
		div							:	'map'	+	nextmapid
		,	projection		:	'EPSG:900913'
		,	layers				:	[
			new	OpenLayers.Layer.OSM()
			//	new	OpenLayers.Layer.XYZ(
			//		'OpenStreetMap',
			//		[
			//			'http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
			//			'http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
			//			'http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png',
			//			'http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png'
			//		],
			//		{
			//		attribution:	'<a	href="http://www.mapquest.com/"		target="_blank">MapQuest</a>,	<a	href="http://www.openstreetmap.org/"	target="_blank">Open	Street	Map</a>	and	contributors,	<a	href="http://creativecommons.org/licenses/by-sa/2.0/"	target="_blank">CC-BY-SA</a>		<img	src="http://developer.mapquest.com/content/osm/mq_logo.png"	border="0">',
			//		transitionEffect:	'resize'
			//		}
			//	),
			//	new	OpenLayers.Layer.XYZ(
			//		'Imagery',
			//		[
			//			'http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png',
			//			'http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png',
			//			'http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png',
			//			'http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png'
			//		],
			//		{
			//			attribution:	'<a	href="http://open.mapquest.co.uk/"	target="_blank">MapQuest</a>,	NASA/JPL-Caltech	and	U.S.	Depart.	of	Agriculture,	Farm	Service	Agency	<img	src="http://developer.mapquest.com/content/osm/mq_logo.png"	border="0">',
			//			transitionEffect:	'resize'
			//		}
			//	)
		]
		,	center				:	[	0,	0	]
		,	numZoomLevels	:	22
		,	zoom					:	1
	}	);
	(	function	labeled_markers()	{
		var	markers			=	new	OpenLayers.Layer.Markers(	'Markers'	)
		,		size				=	new	OpenLayers.Size(	21,	25	)
		,		offset			=	new	OpenLayers.Pixel(	-(	size.w	/	2	),	-size.h	)
		,		icon				=	new	OpenLayers.Icon(	'http://www.openlayers.org/dev/img/marker.png',	size,	offset	)
		,		bNoMarker		=	true
		,		renderer		=	OpenLayers.Layer.Vector.prototype.renderers
		,		vectorLayer	=	new	OpenLayers.Layer.Vector(
					'Simple	Geometry'
					,	{
						styleMap		:	new	OpenLayers.StyleMap(
							{
								'default':	{
									strokeColor					:	'#000000'
									,	strokeOpacity			:	0.4
									,	strokeWidth				:	1
									,	fillColor					:	'#FFFFFF'
									,	fillOpacity				:	0.2
									,	pointRadius				:	6
									,	pointerEvents			:	'visiblePainted'
									,	label							:	"${rdflabeltext}"	//	label	with	\n	linebreaks
									,	fontColor					:	"${favColor}"
									,	fontSize					:	'14px'
									,	fontFamily				:	'sans-serif'
									,	fontWeight				:	'100'
									,	labelAlign				:	"${align}"
									,	labelXOffset			:	"${xOffset}"
									,	labelYOffset			:	"${yOffset}"
									,	labelOutlineColor	:	'rgba(	0,	0,	0,	0.9	)'
									,	labelOutlineWidth	:	4
								}
							}
						)
						,	renderers	:	renderer
					}
				)
		,		projections	=	new	Mapping()
		;
		projections[	'wgs84'	]	=	new	OpenLayers.Projection(	'EPSG:4326'	);
		projections[	'mercator'	]	=	new	OpenLayers.Projection(	'EPSG:900913'	);
		map.addLayer(	markers	);
		map.addLayer(	vectorLayer	);
		//	for	each	known	object...
		suggestionsFor.forEach(	function(	suggestions,	objectid	)	{
			//	if	the	object	can	be	visualised	on	a	map...
			if	(	suggestions.hasValue(	'map'	)	)	{
				var	tripples_lon		=	new	Mapping()
				,		tripples_lat		=	new	Mapping()
				,		labeltextarray	=	[]
				;
				//	get	labels	for	text	content	about	this	object
				//	(that	will	probably	have	many	URI	and	many	values	for	each	URI)
				objectid_to_uri[	objectid	].forEach(	function(	uri	)	{
					ITS.getTripplesMatching(
						new	Tripple(	uri,	'http://www.w3.org/2000/01/rdf-schema#label',	void	0	)
					).forEach(	function(	t	)	{
						if	(	!labeltextarray.hasValue(	t.o	)	)	{
							labeltextarray.push(	t.o	);
						}
					}	);
				}	);
				//	prepare	and	display	all	markers	and	labels	for	the	same	object	:	from	any	known	URI
				objectid_to_uri[	objectid	].forEach(	function(	uri	)	{
					//	longitude	values	for	this	URI
					knownPredicates[	'geo'	][	'longitude'	].forEach(	function(	prediactes,	referentiel	)	{
						if	(	!tripples_lon[	referentiel	]	)	{
							tripples_lon[	referentiel	]	=	[];
						}
						prediactes.forEach(	function(	predicate	)	{
							tripples_lon[	referentiel	]	=	tripples_lon[	referentiel	].concat(
								ITS.getTripplesMatching(	new	Tripple(	uri,	predicate,	void	0	)	)
							);
						}	);
					}	);
					//	latitude	values	for	this	URI
					knownPredicates[	'geo'	][	'latitude'	].forEach(	function(	prediactes,	referentiel	)	{
						if	(	!tripples_lat[	referentiel	]	)	{
							tripples_lat[	referentiel	]	=	[];
						}
						prediactes.forEach(	function(	predicate	)	{
							tripples_lat[	referentiel	]	=	tripples_lat[	referentiel	].concat(
								ITS.getTripplesMatching(	new	Tripple(	uri,	predicate,	void	0	)	)
							);
						}	);
					}	);
					//	display	markers	and	related	labels	for	this	object	on	the	map
					tripples_lon.forEach(	function(	tripple_lon,	ref_lon	)	{
						tripples_lat.forEach(	function(	tripple_lat,	ref_lat	)	{
							tripple_lon.forEach(	function(	t_lon	)	{
								tripple_lat.forEach(	function(	t_lat	)	{
									var	labelOffsetFeature	=	null;
									if	(	bNoMarker	)	{
										markers.addMarker(
											new	OpenLayers.Marker(
												new	OpenLayers.LonLat(	+t_lon.o,	+t_lat.o	).transform(
													projections[	ref_lat	]
													,	map.getProjectionObject()
												)
												,	icon
											)
										);
										bNoMarker	=	false;
									}	else	{
										markers.addMarker(
											new	OpenLayers.Marker(
												new	OpenLayers.LonLat(	+t_lon.o,	+t_lat.o	).transform(
													projections[	ref_lat	]
													,	map.getProjectionObject()
												)
												,	icon.clone()
											)
										);
									}
									//	get	vector	point	for	position
									labelOffsetFeature	=	new	OpenLayers.Feature.Vector(
										new	OpenLayers.Geometry.Point(	+t_lon.o,	+t_lat.o	).transform(
											projections[	ref_lat	]
											,	map.getProjectionObject()
										)
									);
									//	set	this	vector's	attributes
									labelOffsetFeature.attributes	=	{
										rdflabeltext	:	labeltextarray.join(	'	/	'	)	//	make	a	String	from	our	possible	labels
										,	favColor		:	'rgba(	255,	255,	255,	0.95	)'
										,	align				:	'ct'
										,	xOffset			:	0	//	positive	value	moves	the	label	to	the	right
										,	yOffset			:	-12	//	negative	value	moves	the	label	down
									};
									//	alert(	labelOffsetFeature	);
									//	alert(	labeltextarray.join(	'	/	'	)	);
									//	add	the	vector
									vectorLayer.addFeatures(	new	Array(	labelOffsetFeature	)	);
								}	);
							}	);
						}	);
					}	);
				}	);
			}
		}	);
		if	(	!bNoMarker	)	{
			map.zoomToExtent(	markers.getDataExtent()	);	//	in	the	end,	adjust	map	bounds	to	markers	if	>	0	marker(s)
		}
	}	)();
	$(	'#mapitem'	+	nextmapid	).draggable(
		{
			containment	:	'parent'
			,	opacity			:	0.5
			,	cancel			:	'.selectable'
		}
	);
	nextmapid	+=	1;	//	ready	for	next	map
	msnry.layout();
	displayPageLoaded();
}
function	testbuttonT()	{
	displayPageLoading();
	var	timeliner							=	null
	,		timelinehtmls					=	[]
	,		timelinehtml					=	null
	,		timelinehtml_elem			=	null
	,		fragment_timelinehtml	=	null
	,		timeline							=	null
	,		timelinecontainerhtml	=	''
	,		eventNumber						=	0
	,		clusterTripplesByYear	=	new	Mapping()
	,		labelstext						=	new	Mapping()
	;
	timelinehtml	=	$(
		'<div	class="item	timeline"	id="timelineitem'	+	nexttimelineid	+	'">'
		+		'<button	onclick="removeitem('	+	"'"	+	'timelineitem'	+	nexttimelineid	+	"'"	+	')">X</button>'
		+		'<button	onclick="nodetogglecontent(this,'	+	"'"	+	'timelineitem'	+	nexttimelineid	+	"'"	+	')">-</button>'
		+		'Visualisation:	timeline	|	<span	class="timestamp">'
		+			(new	Date()).toLocaleDateString()	+	'&nbsp;'	+	(new	Date()).toLocaleTimeString()
		+		'</span>'
		+		'<div	class="canevas	hideable	timelineContainer"	id="timeline'	+	nexttimelineid	+	'"></div>'
		+	'</div>'
	);
	timelinehtml_elem	=	timelinehtml[	0	];
	fragment_timelinehtml	=	document.createDocumentFragment();
	fragment_timelinehtml.appendChild(	timelinehtml_elem	);
	webappfullcontainer.insertBefore(	fragment_timelinehtml,	webappfullcontainer.firstChild	);
	timelinehtmls.push(	timelinehtml_elem	);
	msnry.prepended(	timelinehtmls	);
	//	timelinecontainerhtml	+=	'<div	class="timelineToggle"><p><a	class="expandAll">+	expand	all</a>'
	//		+	'<button	title="Rebuild	layout"	onclick="rebuildlayout()">⌗</button></p></div>'
	//		;
	suggestionsFor.forEach(	function(	suggestions,	objectid	)	{
		if	(	suggestions.hasValue(	'timeline'	)	)	{
			var	tripples_birthdate	=	new	Mapping()
			,		labeltextarray			=	[]
			;
			//	get	the	labels
			objectid_to_uri[	objectid	].forEach(	function(	uri	)	{
				ITS.getTripplesMatching(
					new	Tripple(	uri,	'http://www.w3.org/2000/01/rdf-schema#label',	void	0	)
				).forEach(	function(	t	)	{
					if	(	!labeltextarray.hasValue(	t.o	)	)	{
						labeltextarray.push(	t.o	);
					}
				}	);
			}	);
			//	get	the	birth	date
			objectid_to_uri[	objectid	].forEach(	function(	uri	)	{
				//	longitude	values	for	this	URI
				knownPredicates[	'date'	].forEach(	function(	types,	format	)	{ 
					if	(	!tripples_birthdate[	format	]	)	{
						tripples_birthdate[	format	]	=	[];
					}
					types.forEach(	function(	prediactes	)	{
						prediactes.forEach(	function(	predicate	)	{
							tripples_birthdate[	format	]	=	tripples_birthdate[	format	].concat(
								ITS.getTripplesMatching(	new	Tripple(	uri,	predicate,	void	0	)	)
							);
						}	);
					}	);
				}	);
			}	);
			//	build	timeline	visualisation
			//	alert(	tripples_birthdate	);
			//	//	sort	tripples	by	date
			//	tripples_birthdate.forEach(	function(	tripples,	format	)	{
			//		tripples.sort(	function(	t1,	t2	)	{
			//			var	bCompare	=	0;
			//			if	(	t1.o	>	t2.o	)	{
			//				bCompare	=	1;
			//			}	else	if	(	t1.o	<	t2.o	)	{
			//				bCompare	=	-1;
			//			}
			//			return	bCompare;
			//		}	);
			//	}	);
			//	update	the	year	clusters	with	information
			tripples_birthdate.forEach(	function(	tripples,	format	)	{
				tripples.forEach(	function(	t	)	{
					var	parseddate	=	parseDate(	t.o,	format	)
					,		Y	=	parseddate.fullyear
					,		M	=	parseddate.fullmonth
					,		D	=	parseddate.fullday
					,		H	=	parseddate.fullhour
					,		I	=	parseddate.fullminute
					,		S	=	parseddate.fullsecond
					;
					if	(	!clusterTripplesByYear[	Y	]	)	{
								clusterTripplesByYear[	Y	]	=	new	Mapping();
					}
					if	(	!clusterTripplesByYear[	Y	][	M	]	)	{
								clusterTripplesByYear[	Y	][	M	]	=	new	Mapping();
					}
					if	(	!clusterTripplesByYear[	Y	][	M	][	D	]	)	{
								clusterTripplesByYear[	Y	][	M	][	D	]	=	new	Mapping();
					}
					if	(	!clusterTripplesByYear[	Y	][	M	][	D	][	H	]	)	{
								clusterTripplesByYear[	Y	][	M	][	D	][	H	]	=	new	Mapping();
					}
					if	(	!clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	]	)	{
								clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	]	=	new	Mapping();
					}
					if	(	!clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	][	S	]	)	{
								clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	][	S	]	=	[];
					}
								clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	][	S	].push(	t	);
				}	);
			}	);
			//	labels	for	the	uri
			labelstext[	objectid	]	=	labeltextarray.join(	'	/	'	);
		}
	}	);
	timelinecontainerhtml	+=	'<div	class="timelineMajor">';
	//	sort	the	clusters
	clusterTripplesByYear.forEach(	function(	Ms,	Y	)	{
		Ms.forEach(	function(	Ds,	M	)	{
			Ds.forEach(	function(	Hs,	D	)	{
				Hs.forEach(	function(	Is,	H	)	{
					Is.forEach(	function(	Ss,	I	)	{
						clusterTripplesByYear[	Y	][	M	][	D	][	H	][	I	].sortKeys();	//	1/6	sort	seconds
					}	);
						clusterTripplesByYear[	Y	][	M	][	D	][	H	].sortKeys();	//	2/6	sort	minutes
				}	);
						clusterTripplesByYear[	Y	][	M	][	D	].sortKeys();	//	3/6	sort	hours
			}	);
						clusterTripplesByYear[	Y	][	M	].sortKeys();	//	4/6	sort	days
		}	);
						clusterTripplesByYear[	Y	].sortKeys();	//	5/6	sort	months
	}	);
						clusterTripplesByYear.sortKeys();	//	6/6	sort	years
	//	prepare	the	UI	elements
	clusterTripplesByYear.forEach(	function(	Ms,	Y	)	{
		timelinecontainerhtml	+=	'<h2	class="timelineMajorMarker	selectable">'	+	Y	+	'</h2>';
		Ms.forEach(	function(	Ds,	M	)	{
			timelinecontainerhtml	+=	'<h3	class="timelineMajorMarker	selectable">'
				+	parseDate(	M,	'M'	).fullmonthtext	+	'</h3>';
			Ds.forEach(	function(	Hs,	D	)	{
				timelinecontainerhtml	+=	'<h4	class="timelineMajorMarker	selectable">'	+	D	+	'</h4>';
				Hs.forEach(	function(	Is,	H	)	{
					//	timelinecontainerhtml	+=	'<h5	class="timelineMajorMarker">'	+	H	+	'</h5>';
					Is.forEach(	function(	Ss,	I	)	{
						//	timelinecontainerhtml	+=	'<h6	class="timelineMajorMarker">'	+	I	+	'</h6>';
						Ss.forEach(	function(	ts,	S	)	{
							//	timelinecontainerhtml	+=	'<h6	class="timelineMajorMarker">'	+	S	+	'</h6>';
							ts.forEach(	function(	t	)	{
								timelinecontainerhtml	+=	'<dl	class="timelineMinor">'
									+		'<h3	class="selectable">'	+	t.o	+	'</h3>'
									+		'<dt	id="timelineEventTitle'	+	eventNumber	+	'">'
									+			'<h4	class="selectable">'
									+				labelstext[	objectid_to_uri.getKeyOfOneContainerOf(	t.s	)	]
									+			'</h4>'
									+		'</dt>'
									+		'<dd	class="timelineEvent"	id="timelineEventTitle'	+	eventNumber	+	'EX">'
									+			'<p	class="selectable	uri">'	+	t.p	+	'</p>'
									+		'</dd>'
									+	'</dl>'
									;
								eventNumber	+=	1;
							}	);
						}	);
					}	);
				}	);
			}	);
		}	);
	}	);
	timelinecontainerhtml	+=	'</div>';
	//	create	the	timeline	UI
	$(	timelinecontainerhtml	).hide().appendTo(	'#timeline'	+	nexttimelineid	).fadeIn();
	//	timeliner	=	$.timeliner(	{	timelineContainer:	'#timeline'	+	nexttimelineid	}	);
	$(	'#timelineitem'	+	nexttimelineid	).draggable(
		{
			containment	:	'parent'
			,	opacity		:	0.5
			,	cancel		:	'.selectable'
		}
	);
	nexttimelineid	+=	1;	//	ready	for	next	timeline
	msnry.layout();
	displayPageLoaded();
}
if	(	window.location.href.indexOf(	'?'	)	>	-1	)	{
	rebuildsafeworkspacewithdata();	//	data	from	GET
}	else	{
	rebuilddefaultworkspace();	//	at	fresh	start	;)
}
$(	hashtagworkspaceid	).resizable(
	{
		//	containment	:	'parent',
		//	aspectRatio	:	true,
		handles			:	's'
		,	grid			:	[	64,	64	]
		,	autoHide	:	true
		,	ghost			:	true
		,	animate		:	true
		,	minHeight	:	256
		,	cancel		:	'.selectable'
	}
);
//	----------------------------------------------------------------------------------------------------
//	----------------------------------------	</START>	------------------------------------------------------------
//	----------------------------------------------------------------------------------------------------
