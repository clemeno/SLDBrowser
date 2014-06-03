// init visuals 

// display elements 
var img_loading_dark_32 = '<img src="img/loading_in_the_dark_002.gif" alt="Chargement…" title="Loading…" width="24px" height="24px" />', 
	img_valid_32 = '<img src="img/valid.png" alt="Valide" title="Ok" width="24px" height="24px" />', 
	img_wrong_32 = '<img src="img/wrong.png" alt="Erreur" title="Wrong" width="24px" height="24px" />', 
	img_images_32 = '<img src="img/loadbar001.gif" alt="Images…" title="Images…" width="24px" height="24px" />'; 
// ======= initial operations =======
// === functions === 
// loading 
function displayPageLoading() {
	$( '#loading' ).html( img_loading_dark_32 ); 
}
// loaded 
function displayPageLoaded() {
	$( '#loading' ).html( img_valid_32 ); 
}
// error 
function displayPageError() {
	$( '#loading' ).html( img_wrong_32 ); 
}
// images loading 
function displayPageImageLoading() {
	$( '#loading' ).html( img_images_32 ); 
}