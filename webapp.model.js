// webapp model
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
//	Triple
var	Triple	=	function(	s,	p,	o	)	{
	this.s	=	s	||	void	0;
	this.p	=	p	||	void	0;
	this.o	=	o	||	void	0;
};
Triple.prototype.toString	=	function()	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	return	'( '	+	this.s	+	', '	+	this.p	+	', '	+	this.o	+	' )';
};



// Mapping
var	Mapping	=	function(){};	//	empty	object
Mapping.prototype.forEach	=	function(	fun	)	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	||	(	typeof	fun	!==	"function"	)	)	{	throw	new	TypeError;	}
	var	obj			=	Object(	this	)
	,		context	=	(	arguments.length	>=	2	)?	arguments[	1	]	:	void	0
	,		prop		=	void	0
	;
	for	(	prop	in	obj	)	{
		if	(	obj.hasOwnProperty(	prop	)	)	{
			fun.call(	context,	obj[	prop	],	prop,	obj	);
		}
	}
};
Mapping.prototype.count	=	function()	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	return	Object.keys(	this	).length;
};
Mapping.prototype.hasKey	=	function(	e	)	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	return	this.hasOwnProperty(	e	);
};
Mapping.prototype.hasValue	=	function(	e	)	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	var	prop	=	void	0;
	for(	prop	in	this	)	{
		if(	this.hasOwnProperty(	prop	)	&&	(	this[	prop	]	==	e	)	)	{
			return	true;
		}
	}
	return	false;
};
Mapping.prototype.getKeyOfOneContainerOf	=	function(	e	)	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	var	prop	=	void	0;
	for	(	prop	in	this	)	{
		if	(	this.hasOwnProperty(	prop	)	&&	(	this[	prop	].hasValue(	e	)	)	)	{
			return	prop;
		}
	}
	return	void	0;
};
Mapping.prototype.getCloneWithSortedKeys	=	function()	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	var	self				=	this
	,		prop				=	void	0
	,		key_array		=	[]
	,		new_mapping	=	new	Mapping()
	;
	for	(	prop	in	this	)	{
		if	(	this.hasOwnProperty(	prop	)	)	{
			key_array.push(	prop	);
		}
	}
	key_array.sort(	function(	a,b	)	{	if	(	a	<	b	)	{	return	-1;	}	if	(	a	>	b	)	{	return	1;	}	return	0;	}	);
	key_array.forEach(	function(	key	)	{
		new_mapping[	key	]	=	self[	key	];
	});
	return	new_mapping;
};
Mapping.prototype.sortKeys	=	function()	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	var	self				=	this
	,		prop				=	void	0
	,		key_array		=	[]
	,		new_mapping	=	new	Mapping()
	;
	for	(	prop	in	this	)	{
		if	(	this.hasOwnProperty(	prop	)	)	{
			key_array.push(	prop	);
		}
	}
	key_array.sort(	function(	a,b	)	{	if	(	a	<	b	)	{	return	-1;	}	if	(	a	>	b	)	{	return	1;	}	return	0;	}	);
	key_array.forEach(	function(	key	)	{
		new_mapping[	key	]	=	self[	key	];
		delete	self[	key	];
		self[	key	]	=	new_mapping[	key	];
	});
	//	return	new_mapping;
};
Mapping.prototype.toString	=	function()	{
	if	(	(	this	===	void	0	)	||	(	this	===	null	)	)	{	throw	new	TypeError;	}
	var	display_str	=	'{'	+	"\n"
	,		iter				=	0
	;
	this.forEach(
		function(	value,key	)	{
			iter	+=	1;
			display_str	+=	"\t";
			if	(	(	1	<	iter	)	&&	(	iter	<	this.count()	)	)	{
				display_str	+=	",\n";
			}
			display_str	+=	key	+	'	:	'	+	value;
		}
	);
	display_str	+=	"\n}";
	return	display_str;
};



//	internal	graph	:	Internal	Triple	Store	Class
//	______________________________________________________________________________________________________
//	InternalTripleStore	---------------------------------------------------------------------------------
//	______________________________________________________________________________________________________
var	InternalTripleStore	=	function(){
	//	constructor
	this.constructor.nbInstance	+=	1;
	//	private	----------
		//	private	data
	var	_spo	=	new	Mapping()
	,		_pos	=	new	Mapping()
	,		_osp	=	new	Mapping()
		//	private	stats
	,		_nb_committed_updates		=	0
	,		_nb_operations_request	=	0
		//	internal	private	methods
	,		_internal_statsUpdate_afterOp	=	function(	bSuccess	)	{
				//	allways
				_nb_operations_request	+=	1;
				//	conditional
				if	(	bSuccess	)	{
					_nb_committed_updates	+=	1;
				}
				return	bSuccess;
			}
	;
	//	private	methods
	function	_addTripleToIndex(	index,	a,	b,	c	)	{
		var	bSuccess	=	false;
		try	{
			if	(	!index.hasKey(	a	)	)	{
				index[	a	]	=	new	Mapping();
			}
			if	(	!index[	a	].hasKey(	b	)	)	{
				index[	a	][	b	]	=	[];
			}
			if	(	!index[	a	][	b	].hasValue(	c	)	)	{
				index[	a	][	b	].push(	c	);
			}
			bSuccess	=	true;
		}	catch	(	actionFailed	)	{
			bSuccess	=	false;
		}	finally	{
			return	_internal_statsUpdate_afterOp(	bSuccess	);
		}
	}
	function	_removeTripleFromIndex(	index,	a,	b,	c	)	{
		var	bSuccess	=	false;
		try	{
			var	idToDel		=	index[	a	][	b	].indexOf(	c	);
			bSuccess	=	(	idToDel	>	-1	)
			if	(	bSuccess	)	{
				//	step	1:	remove	c	first,	if	any	matching	c
				index[	a	][	b	].splice(	idToDel,	1	);
			}
			//	then	or	just:	update	the	b	set
			if	(	index[	a	][	b	].length	<	1	)	{
				delete	index[	a	][	b	];
				bSuccess	=	true;
			}
			//	then	or	just:	update	the	a	set
			if	(	index[	a	].count()	<	1	)	{
				delete	index[	a	];
				bSuccess	=	true;
			}
		}	catch	(	unknownTriple	)	{
			bSuccess	=	false;
		}	finally	{
			return	_internal_statsUpdate_afterOp(	bSuccess	);
		}
	}
	//	privileged	----------
	//	privileged	methods
	//	privileged	triple	combination
	this.getTriplesMatching	=	function(	t	)	{
		var	triples	=	[];
		try	{
			//	wildcard	_	implementation	:	any	unknown/falsy/unset	t	attribute
			if	(	!!t.s	)	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{	//	(	s,	p,	o	)	->	nothing	or	exactly	one	match
						if	(	_spo[	t.s	][	t.p	].hasValue(	t.o	)	)	{
									triples.push(	new	Triple(	t.s	,	t.p	,	t.o	)	);	//	match
						}
					}	else	{	//	(	s,	p,	_	)
						_spo[	t.s	][	t.p	].forEach(	function(	o_	)	{
									triples.push(	new	Triple(	t.s	,	t.p	,	o_	)	);	//	match
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{	//	(	s,	_,	o	)
						_osp[	t.o	][	t.s	].forEach(	function(	p_	)	{
									triples.push(	new	Triple(	t.s	,	p_	,	t.o	)	);	//	match
						}	);
					}	else	{	//	(	s,	_,	_	)
						_spo[	t.s	].forEach(	function(	O_,	p_	)	{
							O_.forEach(	function(	o_	)	{
									triples.push(	new	Triple(	t.s	,	p_	,	o_	)	);	//	match
							}	);
						}	);
					}
				}
			}	else	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{	//	(	_,	p,	o	)
						_pos[	t.p	][	t.o	].forEach(	function(	s_	)	{
									triples.push(	new	Triple(	s_	,	t.p	,	t.o	)	);	//	match
						}	);
					}	else	{	//	(	_,	p,	_	)
						_pos[	t.p	].forEach(	function(	S_,	o_	)	{
							S_.forEach(	function(	s_	)	{
									triples.push(	new	Triple(	s_	,	t.p	,	o_	)	);	//	match
							}	);
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{	//	(	_,	_,	o	)
						_osp[	t.o	].forEach(	function(	P_,	s_	)	{
							P_.forEach(	function(	p_	)	{
									triples.push(	new	Triple(	s_	,	p_	,	t.o	)	);	//	match
							}	);
						}	);
					}	else	{//	(	_,	_,	_	)	->	nothing	or	everything	match
						_spo.forEach(	function(	P_,s_	)	{
							P_.forEach(	function(	O_,p_	)	{
								O_.forEach(	function(	o_	)	{
									triples.push(	new	Triple(	s_	,	p_	,	o_	)	);	//	match
								}	);
							}	);
						}	);
					}
				}
			}
		}	catch	(	nothingLikeThatInIndex	)	{
		}	finally	{
			//	case	1	:	triples.length	===	0	(if	"no	match")	;
			//	case	2	:	triples.length	===	1	(if	"exact	match!")	;
			//	case	3	:	triples.length	>	1	(if	"multiple	match")
			return	triples;
		}
	};
	//	explicit	shorcut	to	getTriplesMatching's	branch	for	(	any	subject,	any	predicate,	any	object	)
	//	returns	all	known	triples	of	this	store	!
	this.getAllTriples	=	function()	{
		var	triples	=	[];
		_spo.forEach(	function(	P_,s_	)	{
			P_.forEach(	function(	O_,p_	)	{
				O_.forEach(	function(	o_	)	{
					triples.push(	new	Triple(	s_,	p_,	o_	)	);	//	match
				}	);
			}	);
		}	);
		return	triples;
	};
	//	>>>>>	based	on	this.getTriplesMatching's	implementation	<<<<<
	//	just	counts	the	number	of	triples	matching	the	input
	this.countTriplesMatching	=	function(	t	)	{
		var	n	=	0;//	no	matching	triple	in	store	by	default
		try	{
			if	(	!!t.s	)	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{
						if	(	_spo[	t.s	][	t.p	].hasValue(	t.o	)	)	{
							n	+=	1;	//	count
						}
					}	else	{
						_spo[	t.s	][	t.p	].forEach(	function(	o_	)	{
							n	+=	1;	//	count
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{
						_osp[	t.o	][	t.s	].forEach(	function(	p_	)	{
							n	+=	1;	//	count
						}	);
					}	else	{
						_spo[	t.s	].forEach(	function(	O_,	p_	)	{
							O_.forEach(	function(	o_	)	{
								n	+=	1;	//	count
							}	);
						}	);
					}
				}
			}	else	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{
						_pos[	t.p	][	t.o	].forEach(	function(	s_	)	{
							n	+=	1;	//	count
						}	);
					}	else	{
						_pos[	t.p	].forEach(	function(	S_,	o_	)	{
							S_.forEach(	function(	s_	)	{
								n	+=	1;	//	count
							}	);
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{
						_osp[	t.o	][	t.s	].forEach(	function(	p_	)	{
							n	+=	1;	//	count
						}	);
					}	else	{
						_spo.forEach(	function(	P_,s_	)	{
							P_.forEach(	function(	O_,p_	)	{
								O_.forEach(	function(	o_	)	{
									n	+=	1;	//	count
								}	);
							}	);
						}	);
					}
				}
			}
		}	catch	(	noIndex	)	{
			n	=	-1;	//	return	-1	on	failure	to	count
		}	finally	{
			return	n;
		}
	};
	//	privileged	add
	this.addTriple	=	function(	t	)	{
		return	(
			(
				_addTripleToIndex(	_spo,	t.s,	t.p,	t.o	)
			)	&&	(
				_addTripleToIndex(	_pos,	t.p,	t.o,	t.s	)
			)	&&	(
				_addTripleToIndex(	_osp,	t.o,	t.s,	t.p	)
			)
		);
	};
	//	privileged	remove
	this.removeTriple	=	function(	t	)	{
		var	failures	=	[];
		this.getTriplesMatching(	t	).forEach(
			function(	t_	)	{
				if	(
					!(
						(
							_removeTripleFromIndex(	_spo,	t_.s,	t_.p,	t_.o	)
						)	&&	(
							_removeTripleFromIndex(	_pos,	t_.p,	t_.o,	t_.s	)
						)	&&	(
							_removeTripleFromIndex(	_osp,	t_.o,	t_.s,	t_.p	)
						)
					)
				)	{
					failures.push(	t_	);	//	try again later on this one
				}
			}
		);
		return	failures;	//	if	(	failures.length	===	0	)	{/*	full	success	!	*/	}
	};
	//	public	----------
	//	public	attr
};
//	public	----------
//	public	meth
//	prototype	----------
//	prototype	attr
//	public	static	----------
InternalTripleStore.nbInstance	=	0;
//	//	tests
//	function	testbutton1()	{
//		var
//			store	=	new	InternalTripleStore(),
//			testTriples	=	new	Array(
//				new	Triple(	':Benabar'	,':job',':Singer'	),
//				new	Triple(	':Lorie'		,':job',':Singer'	),
//				new	Triple(	':Benabar'	,':sex',':Male'		),
//				new	Triple(	':Lorie'		,':sex',':Female'	)
//			),
//			whoHasJobSinger	=	new	Triple(	false,':job',':Singer'	)
//		;
//		testTriples.forEach(
//			function(	t	)	{
//				if	(	!store.addTriple(	t	)	)	{alert(	t	+	'	not	added,try	again	later'	);}
//			}
//		);
//		alert(
//			'Number	of	triples	matching	whoHasJobSinger:	'	+	"\n"	+
//			store.countTriplesMatching(	whoHasJobSinger	)
//		);
//		alert(
//			'Triples	matching	whoHasJobSinger:	'	+	"\n"	+
//			store.getTriplesMatching(	whoHasJobSinger	).join(	"\n"	)
//		);
//	}
//	_______________________________________________________________________________________________________
//	/InternalTripleStore	---------------------------------------------------------------------------------
//	_______________________________________________________________________________________________________



//	declare	knownPredicates	and	suggestionsFor
var	knownPredicates	=	new	Mapping()
,		suggestionsFor	=	new	Mapping()
;

knownPredicates[	'label'		]	=	new	Mapping();
knownPredicates[	'date'		]	=	new	Mapping();
knownPredicates[	'date'		][	'YMD'				]	=	new	Mapping();
knownPredicates[	'date'		][	'YMD'				][	'iso8601'		]	=	[];
knownPredicates[	'date'		][	'YMD'				][	'xsd:date'	]	=	[ 'http://dbpedia.org/ontology/birthDate'					];
knownPredicates[	'date'		][	'YMDHIS'		]	=	new	Mapping();
knownPredicates[	'date'		][	'YMDHIS'		][	'xsd:date'	]	=	[];
knownPredicates[	'number'	]	=	new	Mapping();
knownPredicates[	'geo'			]	=	new	Mapping();
knownPredicates[	'geo'			][	'longitude'	]	=	new	Mapping();
knownPredicates[	'geo'			][	'longitude'	][	'wgs84'			]	=	[ 'http://www.w3.org/2003/01/geo/wgs84_pos#long'	];
knownPredicates[	'geo'			][	'latitude'	]	=	new	Mapping();
knownPredicates[	'geo'			][	'latitude'	][	'wgs84'			]	=	[	'http://www.w3.org/2003/01/geo/wgs84_pos#lat'		];



module.exports.Triple	=	Triple;//@grep	for_mocha
module.exports.Mapping	=	Mapping;//@grep	for_mocha
module.exports.InternalTripleStore	=	InternalTripleStore;//@grep	for_mocha
module.exports.knownPredicates	=	knownPredicates;//@grep	for_mocha
module.exports.suggestionsFor	=	suggestionsFor;//@grep	for_mocha
