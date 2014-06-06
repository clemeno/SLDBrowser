//	init	visuals
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
//	display	elements
var	img_loading_dark_32	=	'<img	src="img/loading_in_the_dark_002.gif"	'
			+	'alt="Chargement…"	title="Loading…"	width="24px"	height="24px"	/>'
,		img_valid_32	=	'<img	src="img/valid.png"	alt="Valide"	title="Ok"	width="24px"	height="24px"	/>'
,		img_wrong_32	=	'<img	src="img/wrong.png"	alt="Erreur"	title="Wrong"	width="24px"	height="24px"	/>'
,		img_images_32	=	'<img	src="img/loadbar001.gif"	alt="Images…"	title="Images…"	width="24px"	height="24px"	/>'
;
//	=======	initial	operations	=======
//	===	functions	===
//	loading
function	displayPageLoading()			{	$(	'#loading'	).html(	img_loading_dark_32	);	}
//	loaded
function	displayPageLoaded()				{	$(	'#loading'	).html(	img_valid_32				);	}
//	error
function	displayPageError()				{	$(	'#loading'	).html(	img_wrong_32				);	}
//	images	loading
function	displayPageImageLoading()	{	$(	'#loading'	).html(	img_images_32				);	}
