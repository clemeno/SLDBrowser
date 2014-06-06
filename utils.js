//	utils
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
//	---	object	---
//	keys
if(!Object.keys){Object.keys=(function(){'use	strict';var	hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!({toString:null}).propertyIsEnumerable('toString'),dontEnums=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','propertyIsEnumerable','constructor'],dontEnumsLength=dontEnums.length;return	function(obj){if(typeof	obj!=='object'&&(typeof	obj!=='function'||obj===null)){throw	new	TypeError('Object.keys	called	on	non-object')}var	result=[],prop,i;for(prop	in	obj){if(hasOwnProperty.call(obj,prop)){result.push(prop)}}if(hasDontEnumBug){for(i=0;i<dontEnumsLength;i++){if(hasOwnProperty.call(obj,dontEnums[i])){result.push(dontEnums[i])}}}return	result}}())}
//	---	array	---
//	foreach
if(!Array.prototype.forEach){Array.prototype.forEach=function(e){"use	strict";if(this===void	0||this===null)throw	new	TypeError;var	t=Object(this);var	n=t.length>>>0;if(typeof	e!=="function")throw	new	TypeError;var	r=arguments.length>=2?arguments[1]:void	0;for(var	i=0;i<n;i++){if(i	in	t)e.call(r,t[i],i,t)}}}
//	some
if(!Array.prototype.some){Array.prototype.some=function(e){"use	strict";if(this===void	0||this===null)throw	new	TypeError;var	t=Object(this);var	n=t.length>>>0;if(typeof	e!=="function")throw	new	TypeError;var	r=arguments.length>=2?arguments[1]:void	0;for(var	i=0;i<n;i++){if(i	in	t&&e.call(r,t[i],i,t))return	true}return	false}}
//	every
if(!Array.prototype.every){Array.prototype.every=function(e){"use	strict";if(this===void	0||this===null)throw	new	TypeError;var	t=Object(this);var	n=t.length>>>0;if(typeof	e!=="function")throw	new	TypeError;var	r=arguments.length>=2?arguments[1]:void	0;for(var	i=0;i<n;i++){if(i	in	t&&!e.call(r,t[i],i,t))return	false}return	true}}

//	test	perso
if(!Array.prototype.hasValue){Array.prototype.hasValue=function(e){"use	strict";if(this===void	0||this===null)throw	new	TypeError;var	t=Object(this),	n=t.length>>>0;for(var	i=0;i<n;i++){if(i	in	t&&t[i]==e)return	true}return	false}}

function	parseDate(	instr,	dformat	)	{
	var	inputstr				=	instr.trim()		||	''
	,		dateformat			=	dformat.trim()	||	''
	,		pos							=	0
	,		index						=	0
	,		strlength				=	inputstr.length
	,		formatlength		=	dateformat.length
	,		validnumbers		=	[	'0',	'1',	'2',	'3',	'4',	'5',	'6',	'7',	'8',	'9'	]
	,		monthnames			=	[
				''
				,	'Jan'
				,	'Feb'
				,	'Mar'
				,	'Apr'
				,	'May'
				,	'Jun'
				,	'Jul'
				,	'Aug'
				,	'Sep'
				,	'Oct'
				,	'Nov'
				,	'Dec'
			]
	,		fullmonthnames	=	[
				''
				,	'January'
				,	'February'
				,	'March'
				,	'April'
				,	'May'
				,	'June'
				,	'July'
				,	'August'
				,	'September'
				,	'October'
				,	'November'
				,	'December'
			]
	,		Y								=	''
	,		M								=	''
	,		D								=	''
	,		H								=	''
	,		I								=	''
	,		S								=	''
	,		bInsidePattern	=	false
	;
	while	(	(	index	<	strlength	)&&(	pos	<	formatlength	)	)	{
		if	(	validnumbers.hasValue(	inputstr[	index	]	)	)	{
			var	ich	=		inputstr[	index	].toString()
			,		fch	=	dateformat[	pos		].toString()
			;
			bInsidePattern	=	true;	//	enter	or	inside	a	matching	pattern
			if					(	fch	==	'Y'	)	{	Y	+=	ich;
			}	else	if	(	fch	==	'M'	)	{	M	+=	ich;
			}	else	if	(	fch	==	'D'	)	{	D	+=	ich;
			}	else	if	(	fch	==	'H'	)	{	H	+=	ich;
			}	else	if	(	fch	==	'I'	)	{	I	+=	ich;
			}	else	if	(	fch	==	'S'	)	{	S	+=	ich;
			}
		}	else	{
			if	(	bInsidePattern	)	{
				bInsidePattern	=	false;	//	exit	just	after	a	matching	pattern
				pos	+=	1;
			}
			//	out	of	a	matching	pattern
		}
		index	+=	1;
	}
	//	zerofill
	while	(	Y.length	<	4	)	{	Y	=	'0'	+	Y;	}
	while	(	M.length	<	2	)	{	M	=	'0'	+	M;	}
	while	(	D.length	<	2	)	{	D	=	'0'	+	D;	}
	while	(	H.length	<	2	)	{	H	=	'0'	+	H;	}
	while	(	I.length	<	2	)	{	I	=	'0'	+	I;	}
	while	(	S.length	<	2	)	{	S	=	'0'	+	S;	}
	return	{
		fullyear				:	Y																																						||	'0000'
		,	year					:	parseInt(	Y,	10	)																													||	0
		,	fullmonth			:	M																																						||	'00'
		,	month					:	parseInt(	M,	10	)																													||	0
		,	monthtext			:			monthnames[	(	(	parseInt(	M,	10	)	<	13	)?	parseInt(	M,	10	)	:	0	)	||	0				]
		,	fullmonthtext	:	fullmonthnames[	(	(	parseInt(	M,	10	)	<	13	)?	parseInt(	M,	10	)	:	0	)	||	0				]
		,	fullday				:	D																																						||	'00'
		,	day						:	parseInt(	D,	10	)																													||	0
		,	fullhour			:	H																																						||	'00'
		,	hour					:	parseInt(	H,	10	)																													||	0
		,	fullminute		:	I																																						||	'00'
		,	minute				:	parseInt(	I,	10	)																													||	0
		,	fullsecond		:	S																																						||	'00'
		,	second				:	parseInt(	S,	10	)																													||	0
	};
}

//	html	insert
function	insertAfter(	e,	t	)	{	e.parentNode.insertBefore(	t,	e.nextSibling	);	}
//	Array	perso.	implementations
//	function	in_array(e,t){var	n=t.length,r=0;while(t[r]!=e&&r<n){r++}return	r<n}
//	function	in_index(e,t){var	n;for(n	in	t){if(n==e){return	true}}return	false}
//	url_data.GET
var	url_data={GET:function(e,t){var	n=new	RegExp("[\\?&]"+e+"=([^&#]*)"),r=n.exec(window.location.href);if(r==null){return	t||null}return	r[1]}};

//	clean	input
function	getCleanTopbarEndpoint()	{	return	$(	'#defaultendpoint'	).val().trim();					}
function	getCleanTopbarUri()				{	return	$(	'#defaultentryuri'	).val().trim();					}
function	setCleanTopbarUri(	uri	)	{					$(	'#defaultentryuri'	).val(	uri.trim()	);	}

//	toggle	node	things
function	toggleBigImage1(	e	)	{	$(	e	).toggleClass(	'bigimg1'	);	}
function	nodetogglecontent(	button,	oidstr	)	{
	if(	$(	button	).html()	==	'-'	)	{
			$(	button	).html(	'+'	);
			$(	'#'	+	oidstr	+	'	.hideable'	).hide();
	}	else	{
			$(	button	).html(	'-'	);
			$(	'#'	+	oidstr	+	'	.hideable'	).fadeIn();
	}
}



module.exports.parseDate	=	parseDate;	//@grep	for_mocha

