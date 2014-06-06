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
var	hashtagworkspaceid							=	'#webappfullcontent'
,		defaultsparqltimeout						=	60000
,		sparqlendpoint									=	[	'http://dbpedia.org/sparql'	]
,		actionhistory										=	[]
,		actionhistory_pointer						=	0
,		objectids												=	[]
,		nextobjectid										=	0
,		nextmapid												=	0
,		nexttimelineid									=	0
,		objectid_to_uri									=	new	Mapping()
,		object_has_expanded_predicates	=	new	Mapping()
;
