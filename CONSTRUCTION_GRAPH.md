## 1. Liens entre les parcelles des plans et des états de parcelles des registres
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
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX source: <http://data.ign.fr/id/source/>

INSERT {
        GRAPH <http://data.ign.fr/plots/temporaire/> {
            ?registersLandmark add:isSimilarTo ?mapsLandmark.
            ?mapsLandmark add:isSimilarTo ?registersLandmark. 
    }}
WHERE {
        GRAPH <http://data.ign.fr/plots/frommaps/> {
           ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?registersLandmark add:hasAttribute ?attr1.
        ?attr1 add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrv1.
        ?attrv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    
        MINUS {?registersLandmark add:isSimilarTo ?mapsLandmark}
        MINUS {?mapsLandmark add:isSimilarTo ?registersLandmark}
        ?mapsLandmark dcterms:identifier ?plotidm.
        ?registersLandmark dcterms:identifier ?plotidr.
        BIND(
             IF(STRENDS(STR(?plotidr), "p"), 
                SUBSTR(STR(?plotidr), 1, STRLEN(STR(?plotidr)) - 1), 
                ?plotidr
              ) AS ?plotid
            )
        filter(?plotidm = ?plotid)
}
```

## 2. Before/After
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>
CONSTRUCT{?mapsLandmark add:hasTimeGap [ add:hasValue ?ecart; add:isFirstRL ?registerLandmark; add:isSecondRL ?registerLandmark2]}
    WHERE {
    GRAPH <http://data.ign.fr/id/temporaire/> 
    {?mapsLandmark add:isSimilarTo ?registerLandmark.
    ?mapsLandmark add:isSimilarTo ?registerLandmark2.}
    ?registerLandmark add:hasTime/add:hasEnd/add:timeStamp ?fin.
    ?registerLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?debut2 .
BIND(ofn:asDays(?debut2 - ?fin) as ?ecart).
FILTER ((?ecart > 0) && !(sameTerm(?registerLandmark,?registerLandmark2)))
}
```

```sparql
#Calcul des relations d'ordre temporel relatif entre états de parcelles issus des matrices
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>
CONSTRUCT {?registerLandmark add:before ?registerLandmark2. ?registerLandmark2 add:after ?registerLandmark.}
    WHERE {
    GRAPH <http://data.ign.fr/id/temporaire/> 
    {?mapsLandmark add:hasTimeGap ?gap.
    ?gap add:hasValue ?ecart.
    ?gap add:isFirstRL ?registerLandmark.
    ?gap add:isSecondRL ?registerLandmark2.
FILTER (!sameTerm(?registerLandmark, ?registerLandmark2))
    }} GROUP BY ?mapsLandmark ?registerLandmark ?registerLandmark2
```