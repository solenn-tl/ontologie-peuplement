from rdflib import Namespace

# Ontologies
## Main
cad = Namespace("http://data.ign.fr/def/cadastre#")
add = Namespace("http://rdf.geohistoricaldata.org/def/address#")

## Others
rico = Namespace("https://www.ica.org/standards/RiC/ontology#")
fpo = Namespace("https://github.com/johnBradley501/FPO/raw/master/fpo.owl#")
time = Namespace("http://www.w3.org/2006/time#")
geo = Namespace("http://www.opengis.net/ont/geosparql#")
ogc = Namespace("http://www.opengis.net/def/crs/OGC/1.3/")
geofla = Namespace("http://data.ign.fr/def/geofla#")
pwikidata = Namespace("http://www.wikidata.org/wiki/Property:")

#Objet URI
landmarkuri = Namespace("http://data.ign.fr/id/landmark/")
srcuri = Namespace("http://data.ign.fr/id/source/")
owneruri = Namespace("http://data.ign.fr/id/taxpayer/")
eventuri = Namespace("http://data.ign.fr/id/event/")

#SKOS URIs
## cadastre
cad_atype = Namespace("http://data.ign.fr/id/codes/cadastre/attributeType/")
cad_ltype = Namespace("http://data.ign.fr/id/codes/cadastre/landmarkType/")
cad_etype = Namespace("http://data.ign.fr/id/codes/cadastre/eventType/")
cad_spval = Namespace("http://data.ign.fr/id/codes/cadastrenap/specialCellValue/")
activity = Namespace("http://data.ign.fr/id/codes/cadastre/activity/")
srctype = Namespace("http://data.ign.fr/id/codes/cadastre/sourceType/")
mlclasse = Namespace("http://data.ign.fr/id/codes/cadastre/mlClasse/")
pnature = Namespace("http://data.ign.fr/id/codes/cadastre/plotNature/")

## address
atype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/attributeType/")
ltype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/landmarkType/")
lrtype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/landmarkRelationType/")
ctype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/changeType/")