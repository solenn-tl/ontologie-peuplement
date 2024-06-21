from rdflib import Namespace

# Ontologies
## Main
cad = Namespace("http://data.ign.fr/def/cadastre#")
add = Namespace("http://rdf.geohistoricaldata.org/def/address#")

## Others
rico = Namespace("https://www.ica.org/standards/RiC/ontology#")
fpo = Namespace("https://github.com/johnBradley501/FPO/raw/master/fpo.owl#")
time = Namespace("http://www.w3.org/2006/time#")

#Objet URI
landmarkuri = Namespace("http://data.ign.fr/id/landmark/")
srcuri = Namespace("http://data.ign.fr/id/source/")
owneruri = Namespace("http://data.ign.fr/id/owner/")

#SKOS URIs
## cadastre
cad_atype = Namespace("http://data.ign.fr/id/codes/cadastre/attributeType/")
cad_ltype = Namespace("http://data.ign.fr/id/codes/cadastre/landmarkType/")
srctype = Namespace("http://data.ign.fr/id/codes/cadastre/sourceType/")
cad_act = Namespace("http://data.ign.fr/id/codes/cadastre/activity/")
mlclasse = Namespace("http://data.ign.fr/id/codes/cadastre/mlClasse/")
## address
atype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/attributeType/")
ltype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/landmarkType/")
lrtype = Namespace("http://rdf.geohistoricaldata.org/id/codes/address/landmarkRelationType/")