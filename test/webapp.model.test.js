
var	assert	=	require(	'assert'	),	utils	=	require(	'../utils'	),	model	=	require(	'../webapp.model'	);

describe(	'testing webapp.model.js : Tripple, Mapping, InternalTrippleStore ',	function()	{
	describe(	'Tripple',	function()	{
		describe(	'constructor',	function()	{
			it(	'should be able to store unset: s, p, o',	function()	{
				var	t	=	new	model.Tripple();
				assert(	typeof(	t	)	==	'object'	);
				assert.equal(	t.s,	void	0	);
				assert.equal(	t.p,	void	0	);
				assert.equal(	t.o,	void	0	);
			}	);
			it(	'should be able to store set: s, unset: p, o',	function()	{
				var	t	=	new	model.Tripple(	7	);
				assert.equal(	t.s,	7	);
				assert.equal(	t.p,	void	0	);
				assert.equal(	t.o,	void	0	);
			}	);
			it(	'should be able to store set: p, unset: s, o',	function()	{
				var	t	=	new	model.Tripple(	void	0,	23	);
				assert.equal(	t.s,	void	0	);
				assert.equal(	t.p,	23	);
				assert.equal(	t.o,	void	0	);
			}	);
			it(	'should be able to store set: o, unset: s, p',	function()	{
				var	t	=	new	model.Tripple(	void	0,	void	0,	42	);
				assert.equal(	t.s,	void	0	);
				assert.equal(	t.p,	void	0	);
				assert.equal(	t.o,	42	);
			}	);
			it(	'should be able to store set: s, p, unset: o',	function()	{
				var	t	=	new	model.Tripple(	7,	23	);
				assert.equal(	t.s,	7	);
				assert.equal(	t.p,	23	);
				assert.equal(	t.o,	void	0	);
			}	);
			it(	'should be able to store set: s, o, unset: p',	function()	{
				var	t	=	new	model.Tripple(	7,	void	0,	42	);
				assert.equal(	t.s,	7	);
				assert.equal(	t.p,	void	0	);
				assert.equal(	t.o,	42	);
			}	);
			it(	'should be able to store set: p, o, unset: s',	function()	{
				var	t	=	new	model.Tripple(	void	0,	23,	42	);
				assert.equal(	t.s,	void	0	);
				assert.equal(	t.p,	23	);
				assert.equal(	t.o,	42	);
			}	);
			it(	'should be able to store set: s, p, o',	function()	{
				var	t	=	new	model.Tripple(	7,	23,	42	);
				assert.equal(	t.s,	7	);
				assert.equal(	t.p,	23	);
				assert.equal(	t.o,	42	);
			}	);
		}	);
		describe(	'.prototype.toString',	function()	{
			it(	'should return a valid string representation when unset: s, p, o',	function()	{
				assert.equal(	(new	model.Tripple()).toString(),	'( undefined, undefined, undefined )'	);
			}	);
			it(	'should return a valid string representation when set: s, unset: p, o ',	function()	{
				assert.equal(	(new	model.Tripple(	7	)).toString(),	'( 7, undefined, undefined )'	);
			}	);
			it(	'should return a valid string representation when set: p, unset: s, o ',	function()	{
				assert.equal(	(new	model.Tripple(	void	0,	23	)).toString(),	'( undefined, 23, undefined )'	);
			}	);
			it(	'should return a valid string representation when set: o, unset: s, p ',	function()	{
				assert.equal(	(new	model.Tripple(	void	0,	void	0,	42	)).toString(),	'( undefined, undefined, 42 )'	);
			}	);
			it(	'should return a valid string representation when set: s, p, unset: o ',	function()	{
				assert.equal(	(new	model.Tripple(	7,	23	)).toString(),	'( 7, 23, undefined )'	);
			}	);
			it(	'should return a valid string representation when set: s, o unset: p ',	function()	{
				assert.equal(	(new	model.Tripple(	7,	void	0,	42	)).toString(),	'( 7, undefined, 42 )'	);
			}	);
			it(	'should return a valid string representation when set: p, o unset: s ',	function()	{
				assert.equal(	(new	model.Tripple(	void	0,	23,	42	)).toString(),	'( undefined, 23, 42 )'	);
			}	);
			it(	'should return a valid string representation when set: s, p, o ',	function()	{
				assert.equal(	(new	model.Tripple(	7,	23,	42	)).toString(),	'( 7, 23, 42 )'	);
			}	);
		}	);
	}	);
	describe(	'Mapping',	function()	{
		describe(	'constructor',	function()	{
			it(	'should initially be an empty object',	function()	{
				var	map	=	new	model.Mapping();
				assert(	typeof(	map	)	==	'object'	);	//	it's	supposed	to	be	a	new	object
				assert.equal(	Object.keys(	map	).length,	0	);	//	which	is	initially	empty
			}	);
		}	);
		describe(	'.prototype.forEach',	function()	{
			it(	'should do nothing if the mapping has no element (i.e. initially)',	function()	{
				var	map	=	new	model.Mapping(),
					a	=	0,
					b	=	'';
				map.forEach(	function(	val,	prop	)	{
					a	+=	1;
					b	+=	prop	+	':	'	+	val	+	';	';
				}	);
				assert.equal(	a,	0	);
				assert.equal(	b,	''	);
			}	);
			it(	'should apply a function over all keys referenceing values in the Mapping and pass the ( value refered to by the current key, current key refering to the value ) arguments when calling the function',	function()	{
				var	map	=	new	model.Mapping(),
					a	=	0,
					b	=	'';
				map[	'lol 42 spacesInTheName	!	and	special	chars	and	long	name	%*'	]	=	42;
				map.toto	=	'tata';
				map[	345	]	=	-675.00985;
				map.forEach(	function(	val,	prop	)	{
					a	+=	1;
					b	+=	prop	+	':	'	+	val	+	'.	';
				}	);
				assert.equal(	a,	3	);
				assert.equal(	b.length,	'345:	-675.00985.	lol 42 spacesInTheName	!	and	special	chars	and	long	name	%*:	42.	toto:	tata.	'.length	);
			}	);
			it(	'should allow the user to modify the current value by thisMapping[ currentKey ] = newValue ',	function()	{
				var	map	=	new	model.Mapping(),
					a	=	0,
					b	=	'';
				map[	'lol	42	spacesInTheName	!	and	special	chars	and	long	name	%*'	]	=	42;
				map.toto	=	'tata';
				map[	345	]	=	-675.00985;
				assert.equal(	map[	345	],	-675.00985	);	//	assert	old	value
				map.forEach(	function(	val,	prop	)	{
					a	+=	1;
					if	(	prop	==	345	)	{
						map[	prop	]	=	768;
						b	=	prop;
					}
				}	);
				assert.equal(	a,	3	);
				assert.equal(	b,	345	);
				assert.equal(	map[	345	],	768	);	//	assert	new	value
			}	);
		}	);
		describe(	'.prototype.count',	function()	{
			it(	'should count the number of elements stored, the number of distinct keys of the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert.equal(	map.count(),	8	);
				assert.equal(	(new	model.Mapping()).count(),	0	);
			}	);
		}	);
		describe(	'.prototype.hasKey',	function()	{
			it(	'should return true if the key is in the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	map.hasKey(	'lol'	)	);
				assert(	map.hasKey(	546	)	);
				assert(	!map.hasKey(	42	)	);
				assert(	!map.hasKey(	'rogzhgjzblzjkblz'	)	);
				assert(	!(new	model.Mapping()).hasKey(	'key'	)	);
			}	);
			it(	'should return false if the key have never been part of the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	!map.hasKey(	42	)	);
				assert(	!map.hasKey(	'rogzhgjzblzjkblz'	)	);
				assert(	!(new	model.Mapping()).hasKey(	'key'	)	);
			}	);
			it(	'should return false if the key has been deleted',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	map.hasKey(	'lol'	)	);
				delete	map[	'lol'	];
				assert(	!map.hasKey(	'lol'	)	);
			}	);
		}	);
		describe(	'.prototype.hasValue',	function()	{
			it(	'should return true	if one of the values referenced in the Mapping matches',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	map.hasValue(	'rsgg'	)	);
			}	);
			it(	'should return false if the value can not be found in the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	!map.hasValue(	42	)	);
			}	);
			it(	'should return false if the value have never been referenced in the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	!map.hasValue(	'merci'	)	);
			}	);
			it(	'should return false if the last matching value referenced in the Mapping have been modified before',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	map.hasValue(	'rsgg'	)	);
				map[	'fsrgzg'	]	=	'rss';
				assert(	!map.hasValue(	'rsgg'	)	);
			}	);
			it(	'should return false if one of the value have been deleted from the Mapping',	function()	{
				var	map	=	new	model.Mapping();
				map.lol	=	'haha';
				map[	'fsrgzg'	]	=	'rsgg';
				map[	546	]	=	454535;
				map[	'fgvzhgegh'	]	=	345648;
				map[	9358367	]	=	'tgeg';
				map.tarte	=	function()	{	return	'paf!';	};
				map[	8765	]	=	{};
				map[	'eqfefzrvfbd'	]	=	[];
				assert(	map.hasValue(	'rsgg'	)	);
				delete	map[	'fsrgzg'	];
				assert(	!map.hasValue(	'rsgg'	)	);
			}	);
		}	);
		describe(	'.prototype.getKeyOfOneContainerOf',	function()	{
			it(	'should return a key of the Mapping that is referencing a value which is another data-structure implementing the hasValue() method and containing an instance of the element we are interested in',	function()	{
				var	map	=	new	model.Mapping();
				map[	'refToAnotherMap'	]	=	new	model.Mapping();
				map[	'refToAnotherMap'	][	24	]	=	42;
				assert.equal(	map.getKeyOfOneContainerOf(	'42'	),	'refToAnotherMap'	);
			}	);
			it(	'should return undefined if there is no key in the Mapping pointing to a data-structure with a matching element',	function()	{
				var	map	=	new	model.Mapping();
				map[	'refToAnotherMap'	]	=	new	model.Mapping();
				map[	'refToAnotherMap'	][	24	]	=	42;
				assert(	!map.getKeyOfOneContainerOf(	'no_element_like_this'	)	);
				assert.equal(	map.getKeyOfOneContainerOf(	'no_element_like_this'	),	void	0	);
			}	);
		}	);
		describe(	'.prototype.getCloneWithSortedKeys',	function()	{
			it(	'should preserve the original Mapping and return a different copy with elements sorted by key (if keys are comparable)',	function()	{
				var	map	=	new	model.Mapping(),
					clone	=	new	model.Mapping(),
					mapstr	=	'',
					clonestr	=	'';
				map[	'b'	]	=	2;
				map[	'a'	]	=	1;
				map[	'c'	]	=	3;
				map[	'h'	]	=	8;
				map[	'd'	]	=	4;
				map[	'e'	]	=	5;
				map[	'f'	]	=	6;
				map[	'g'	]	=	7;
				clone	=	map.getCloneWithSortedKeys();	//	sort	the	clone
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				clone.forEach(	function(	v,	k	)	{
					clonestr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'b2a1c3h8d4e5f6g7'	);
				assert.equal(	clonestr,	'a1b2c3d4e5f6g7h8'	);
				delete	map[	'g'	];
				mapstr	=	'';
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				clonestr	=	'';
				clone.forEach(	function(	v,	k	)	{
					clonestr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'b2a1c3h8d4e5f6'	);
				assert.equal(	clonestr,	'a1b2c3d4e5f6g7h8'	);
			}	);
			it(	'should preserve the original Mapping and return a similar copy if keys are already sorted',	function()	{
				var	map	=	new	model.Mapping(),
					clone	=	new	model.Mapping(),
					mapstr	=	'',
					clonestr	=	'';
				map[	'a'	]	=	1;
				map[	'b'	]	=	2;
				map[	'c'	]	=	3;
				map[	'd'	]	=	4;
				map[	'e'	]	=	5;
				map[	'f'	]	=	6;
				map[	'g'	]	=	7;
				map[	'h'	]	=	8;
				clone	=	map.getCloneWithSortedKeys();	//	sort	the	clone
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				clone.forEach(	function(	v,	k	)	{
					clonestr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6g7h8'	);
				assert.equal(	clonestr,	'a1b2c3d4e5f6g7h8'	);
			}	);
		}	);
		describe(	'.prototype.sortKeys',	function()	{
			it(	'should sort this Mapping by key (if keys are comparable)',	function()	{
				var	map	=	new	model.Mapping(),
					mapstr	=	'';
				map[	'b'	]	=	2;
				map[	'a'	]	=	1;
				map[	'c'	]	=	3;
				map[	'h'	]	=	8;
				map[	'd'	]	=	4;
				map[	'e'	]	=	5;
				map[	'f'	]	=	6;
				map[	'g'	]	=	7;
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'b2a1c3h8d4e5f6g7'	);
				map.sortKeys();	//	sort	this
				mapstr	=	'';
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6g7h8'	);
				delete	map[	'g'	];
				mapstr	=	'';
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6h8'	);
				map.sortKeys();	//	sort	this
				mapstr	=	'';
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6h8'	);
			}	);
			it(	'should do nothing if keys are comparable and already sorted',	function()	{
				var	map	=	new	model.Mapping(),
					mapstr	=	'';
				map[	'a'	]	=	1;
				map[	'b'	]	=	2;
				map[	'c'	]	=	3;
				map[	'd'	]	=	4;
				map[	'e'	]	=	5;
				map[	'f'	]	=	6;
				map[	'g'	]	=	7;
				map[	'h'	]	=	8;
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6g7h8'	);
				map.sortKeys();	//	sort	this
				mapstr	=	'';
				map.forEach(	function(	v,	k	)	{
					mapstr	+=	k	+	v;
				}	);
				assert.equal(	mapstr,	'a1b2c3d4e5f6g7h8'	);
			}	);
		}	);
		describe(	'.prototype.toString',	function()	{
			it(	'should return a string representation of the content of this Mapping',	function()	{
				var	map	=	new	model.Mapping();
				assert(	typeof(	map.toString()	)	===	'string'	);
			}	);
		}	);
	}	);
	describe(	'InternalTrippleStore',	function()	{
		describe(	'constructor',	function()	{
			it(	'should initially be a new registered instance of InternalTrippleStore',	function()	{
				var	nbinstance_before	=	model.InternalTrippleStore.nbInstance
				,		ITS								=	new	model.InternalTrippleStore()
				,		nbinstance_after	=	model.InternalTrippleStore.nbInstance
				;
				assert(	typeof(	ITS	)	==	'object'	);
				assert(	nbinstance_before	<	nbinstance_after	);
			}	);
		}	);
	}	);
}	);
