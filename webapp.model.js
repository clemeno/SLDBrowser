// webapp model
//	Tripple
var	Tripple	=	function(	s,	p,	o	)	{
	this.s	=	s	||	void	0;
	this.p	=	p	||	void	0;
	this.o	=	o	||	void	0;
};
Tripple.prototype.toString	=	function()	{
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



//	internal	graph	:	Internal	Tripple	Store	Class	
//	______________________________________________________________________________________________________	
//	InternalTrippleStore	---------------------------------------------------------------------------------	
//	______________________________________________________________________________________________________	
var	InternalTrippleStore	=	function(){
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
	function	_addTrippleToIndex(	index,	a,	b,	c	)	{
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
	function	_removeTrippleFromIndex(	index,	a,	b,	c	)	{
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
		}	catch	(	unknownTripple	)	{
			bSuccess	=	false;
		}	finally	{
			return	_internal_statsUpdate_afterOp(	bSuccess	);
		}
	}
	//	privileged	----------	
	//	privileged	methods	
	//	privileged	tripple	combination	
	this.getTripplesMatching	=	function(	t	)	{
		var	tripples	=	[];
		try	{
			//	wildcard	_	implementation	:	any	unknown/falsy/unset	t	attribute	
			if	(	!!t.s	)	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{	//	(	s,	p,	o	)	->	nothing	or	exactly	one	match	
						if	(	_spo[	t.s	][	t.p	].hasValue(	t.o	)	)	{
									tripples.push(	new	Tripple(	t.s	,	t.p	,	t.o	)	);	//	match
						}
					}	else	{	//	(	s,	p,	_	)	
						_spo[	t.s	][	t.p	].forEach(	function(	o_	)	{
									tripples.push(	new	Tripple(	t.s	,	t.p	,	o_	)	);	//	match
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{	//	(	s,	_,	o	)	
						_osp[	t.o	][	t.s	].forEach(	function(	p_	)	{
									tripples.push(	new	Tripple(	t.s	,	p_	,	t.o	)	);	//	match
						}	);
					}	else	{	//	(	s,	_,	_	)	
						_spo[	t.s	].forEach(	function(	O_,	p_	)	{
							O_.forEach(	function(	o_	)	{
									tripples.push(	new	Tripple(	t.s	,	p_	,	o_	)	);	//	match
							}	);
						}	);

					}
				}
			}	else	{
				if	(	!!t.p	)	{
					if	(	!!t.o	)	{	//	(	_,	p,	o	)	
						_pos[	t.p	][	t.o	].forEach(	function(	s_	)	{
									tripples.push(	new	Tripple(	s_	,	t.p	,	t.o	)	);	//	match
						}	);
					}	else	{	//	(	_,	p,	_	)	
						_pos[	t.p	].forEach(	function(	S_,	o_	)	{
							S_.forEach(	function(	s_	)	{
									tripples.push(	new	Tripple(	s_	,	t.p	,	o_	)	);	//	match
							}	);
						}	);
					}
				}	else	{
					if	(	!!t.o	)	{	//	(	_,	_,	o	)	
						_osp[	t.o	].forEach(	function(	P_,	s_	)	{
							P_.forEach(	function(	p_	)	{
									tripples.push(	new	Tripple(	s_	,	p_	,	t.o	)	);	//	match
							}	);
						}	);
					}	else	{//	(	_,	_,	_	)	->	nothing	or	everything	match
						_spo.forEach(	function(	P_,s_	)	{
							P_.forEach(	function(	O_,p_	)	{
								O_.forEach(	function(	o_	)	{
									tripples.push(	new	Tripple(	s_	,	p_	,	o_	)	);	//	match
								}	);
							}	);
						}	);
					}
				}
			}
		}	catch	(	nothingLikeThatInIndex	)	{
		}	finally	{
			//	case	1	:	tripples.length	===	0	(if	"no	match")	;
			//	case	2	:	tripples.length	===	1	(if	"exact	match!")	;
			//	case	3	:	tripples.length	>	1	(if	"multiple	match")	
			return	tripples;
		}
	};
	//	explicit	shorcut	to	getTripplesMatching's	branch	for	(	any	subject,	any	predicate,	any	object	)
	//	returns	all	known	tripples	of	this	store	!
	this.getAllTripples	=	function()	{
		var	tripples	=	[];
		_spo.forEach(	function(	P_,s_	)	{
			P_.forEach(	function(	O_,p_	)	{
				O_.forEach(	function(	o_	)	{
					tripples.push(	new	Tripple(	s_,	p_,	o_	)	);	//	match
				}	);
			}	);
		}	);
		return	tripples;
	};
	//	>>>>>	based	on	this.getTripplesMatching's	implementation	<<<<<	
	//	just	counts	the	number	of	tripples	matching	the	input	
	this.countTripplesMatching	=	function(	t	)	{
		var	n	=	0;//	no	matching	tripple	in	store	by	default	
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
	this.addTripple	=	function(	t	)	{
		return	(	
			(
				_addTrippleToIndex(	_spo,	t.s,	t.p,	t.o	)
			)	&&	(
				_addTrippleToIndex(	_pos,	t.p,	t.o,	t.s	)
			)	&&	(
				_addTrippleToIndex(	_osp,	t.o,	t.s,	t.p	)
			)	
		);
	};
	//	privileged	remove	
	this.removeTripple	=	function(	t	)	{
		var	failures	=	[];
		this.getTripplesMatching(	t	).forEach(	
			function(	t_	)	{
				if	(	
					!(
						(
							_removeTrippleFromIndex(	_spo,	t_.s,	t_.p,	t_.o	)
						)	&&	(
							_removeTrippleFromIndex(	_pos,	t_.p,	t_.o,	t_.s	)
						)	&&	(
							_removeTrippleFromIndex(	_osp,	t_.o,	t_.s,	t_.p	)
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
InternalTrippleStore.nbInstance	=	0;
//	//	tests	
//	function	testbutton1()	{
//		var	
//			store	=	new	InternalTrippleStore(),
//			testTripples	=	new	Array(	
//				new	Tripple(	':Benabar'	,':job',':Singer'	),
//				new	Tripple(	':Lorie'		,':job',':Singer'	),
//				new	Tripple(	':Benabar'	,':sex',':Male'		),
//				new	Tripple(	':Lorie'		,':sex',':Female'	)	
//			),
//			whoHasJobSinger	=	new	Tripple(	false,':job',':Singer'	)	
//		;
//		testTripples.forEach(	
//			function(	t	)	{
//				if	(	!store.addTripple(	t	)	)	{alert(	t	+	'	not	added,try	again	later'	);}
//			}
//		);
//		alert(	
//			'Number	of	tripples	matching	whoHasJobSinger:	'	+	"\n"	+	
//			store.countTripplesMatching(	whoHasJobSinger	)	
//		);
//		alert(	
//			'Tripples	matching	whoHasJobSinger:	'	+	"\n"	+	
//			store.getTripplesMatching(	whoHasJobSinger	).join(	"\n"	)	
//		);
//	}
//	_______________________________________________________________________________________________________
//	/InternalTrippleStore	---------------------------------------------------------------------------------	
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



module.exports.Tripple	=	Tripple;//@grep	for_mocha	
module.exports.Mapping	=	Mapping;//@grep	for_mocha	
module.exports.InternalTrippleStore	=	InternalTrippleStore;//@grep	for_mocha	
module.exports.knownPredicates	=	knownPredicates;//@grep	for_mocha	
module.exports.suggestionsFor	=	suggestionsFor;//@grep	for_mocha	
