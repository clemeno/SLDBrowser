var hashtagworkspaceid = '#webappfullcontent', 
	defaultsparqltimeout = 60000, 
	sparqlendpoint = [ 'http://dbpedia.org/sparql' ], 
	actionhistory = [], 
	actionhistory_pointer = 0, 
	objectids = [], 
	nextobjectid = 0, 
	nextmapid = 0, 
	nexttimelineid = 0, 
	objectid_to_uri = new Mapping(), 
	object_has_expanded_predicates = new Mapping(); 