# I. Liage des landmarks qui font référence au même objet

## Remarque
Il faut traiter chaque matrice d'un cadastre individuellement. Les matrices d'un même cadastre doivent être traitées dans l'ordre chronologique

## Même landmark qu'un landmark initial
1. Dans la matrice qui suit immédiatement la création du cadastre:
    - Même *Numéro de parcelle* ET 
    - *Tiré de* est vide ET 
    - *Date d'entrée* est égal à la date d'ouverture de la matrice

```sparql
PREFIX ltype: <http://rdf.geohistoricaldata.org/id/codes/address/landmarkType/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

INSERT {
        GRAPH <http://data.ign.fr/plots/> {
            ?registersLandmark add:isSimilarTo ?mapsLandmark.
    }}
WHERE {
        GRAPH <http://data.ign.fr/plots/frommaps/> {
            ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        GRAPH <http://data.ign.fr/plots/fromregisters/> {
            ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        	?registersLandmark add:hasAttribute ?attr .
            ?attr add:isAttributeType cad_atype:PlotMention .
            ?attr add:hasAttributeVersion ?attrV .
            ?attrV cad:isMentionnedIn ?classement .
            OPTIONAL{?attrV cad:takenFrom ?tirede} .
            OPTIONAL{?attrV cad:passedTo ?portea} .
            OPTIONAL{?attrV add:hasTime/add:hasBeginning/add:timeStamp ?crispbegin}.
            OPTIONAL{?attrV add:hasEarliestTimeInstant/add:timeStamp ?earliest}.
            OPTIONAL{?attrV add:hasTime/add:hasEnd/add:timeStamp ?crispend}.
            OPTIONAL{?attrV add:hasLatestTimeInstant/add:timeStamp ?latest}.
            filter(?tirede = cad_spval:CelluleVideSV)
			#filter(?portea = cad_spval:CelluleVideSV)
    	    filter(?earliest = "1848-01-01T00:00:00"^^xsd:dateTime || ?crispbegin = "1848-01-01T00:00:00"^^xsd:dateTime)
           }
        MINUS {?registersLandmark add:isSimilarTo ?mapsLandmark}
        ?mapsLandmark dcterms:identifier ?plotid.
        ?registersLandmark dcterms:identifier ?plotid.
    
}
```
Cette requête créée un lien *add:isSimilarTo* entre des parcelles (articles de classement) issus des matrices et les parcelles initialisées à partir du plan.

2. Lier les parcelles (articles de classement) qui sont liées à une parcelle du plan et qui ne renvoient pas à une division/fusion.
- Dans le graphe des articles de classement :
    - la parcelle a une propriété *add:isSimilarTo*
    - même identifiant de parcelle
    - 

