## 1. Liens entre les parcelles des plans et des états de parcelles des registres
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

INSERT {
        GRAPH <http://rdf.geohistoricaldata.org/id/test> {
            ?registersLandmark add:isSimilarTo ?mapsLandmark.
            ?mapsLandmark add:isSimilarTo ?registersLandmark.
   }}
WHERE {
        GRAPH <http://rdf.geohistoricaldata.org/plots/frommaps> {
           ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?registersLandmark add:hasAttribute ?attr1.
        ?attr1 add:isAttributeType cad_atype:PlotMention.
    
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

## 2. Calcul des écarts temporels entre des parcelles (registres) étant liées au même objet initial
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>

#Export des écarts temporels entre les états des parcelles issus des matrices
#CONSTRUCT {?mapsLandmark add:hasTimeGap [add:hasValue ?ecart; add:isFirstRL ?registerLandmark; add:isSecondRL ?registerLandmark2]}
INSERT{
    GRAPH <http://rdf.geohistoricaldata.org/id/temporaire>
    {?mapsLandmark add:hasTimeGap [add:hasValue ?ecart; 
                  add:isFirstRL ?registerLandmark; 
                  add:isSecondRL ?registerLandmark2]}}
WHERE {
    GRAPH <http://rdf.geohistoricaldata.org/id/test> 
    {?mapsLandmark add:isSimilarTo ?registerLandmark.
    ?mapsLandmark add:isSimilarTo ?registerLandmark2.}
    ?registerLandmark add:hasTime/add:hasEnd/add:timeStamp ?fin.
    ?registerLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?debut2 .
BIND(ofn:asDays(?debut2 - ?fin) as ?ecart).
FILTER ((?ecart > 0) && !(sameTerm(?registerLandmark,?registerLandmark2)))
}
```
## 3. Ajout de relations before/after entre les parcelles (registres) à l'aide des écarts temporels
```sparql
#Calcul des relations d'ordre temporel relatif entre états de parcelles issus des matrices
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>

#CONSTRUCT {?registerLandmark add:before ?registerLandmark2. ?registerLandmark2 add:after ?registerLandmark.}
INSERT {GRAPH <http://rdf.geohistoricaldata.org/id/ordre>{?registerLandmark add:before ?registerLandmark2. ?registerLandmark2 add:after ?registerLandmark.}}
WHERE {
    GRAPH <http://rdf.geohistoricaldata.org/id/temporaire> 
    {?mapsLandmark add:hasTimeGap ?gap.
    ?gap add:hasValue ?ecart.
    ?gap add:isFirstRL ?registerLandmark.
    ?gap add:isSecondRL ?registerLandmark2. 
    FILTER (!sameTerm(?registerLandmark, ?registerLandmark2))}
}
#GROUP BY ?mapsLandmark ?registerLandmark ?registerLandmark2
```

## 4.1 Création des changements et des évènements correspondants à des divisions de parcelles (registres) à partir du champ Porté à (2..* folios)
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX time: <http://www.w3.org/2006/time#>

#Crée les changements et les événements entre des parcelles de registres qui se suivent et où la parcelle 1 a au moins deux folios dans la case Porté à
construct {
?registerLandmark add:changedBy ?change.
?change a add:Change.
?change add:appliedTo ?registerLandmark.
?change add:isChangeType ctype:LandmarkDisappearance.
?change add:dependsOn ?event.
?nextPlot add:changedBy ?change2.
?change2 a add:Change.
?change2 add:appliedTo ?nextPlot.
?change2 add:isChangeType ctype:LandmarkAppearance.
?change2 add:dependsOn ?event.
?event a add:Event.
?event cad:isEventType cad_etype:Split.
?event add:hasTime [ a add:TimeInstant; add:timeStamp ?datefin; add:timeCalendar time:Gregorian;
add:timePrecision time:Year].
}
WHERE {
select ?registerLandmark ?nextPlot ?portea ?datefin (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?change) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?change2) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?event)
where {
    ?registerLandmark a add:Landmark.
    ?registerLandmark add:hasTime/add:hasEnd/add:timeStamp ?datefin.
    ?registerLandmark add:isLandmarkType cad_ltype:Plot. 
    ?registerLandmark add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    ?attrMention add:hasAttributeVersion/cad:passedTo ?portea.
    ?portea cad:isSourceType [skos:broader+ srctype:Folio]
     
    graph <http://rdf.geohistoricaldata.org/id/ordre>
    {OPTIONAL{?registerLandmark add:after ?nextPlot. }}  
}}
GROUP BY ?registerLandmark ?nextPlot ?datefin
HAVING ((count(?portea)) > 1)
ORDER BY ?datefin
```
## 4.2 Création des changements et des évènements correspondants à des divisions de parcelles (registres) à partir du champ Tiré de (ResteSV)
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX time: <http://www.w3.org/2006/time#>

#Crée les changements et les événements entre des parcelles de registres qui se suivent et où ?tirede de ?registerLandmark est égal à Reste
construct {
?registerLandmark add:changedBy ?change.
?change a add:Change.
?change add:appliedTo ?registerLandmark.
?change add:isChangeType ctype:LandmarkAppearance.
?change add:dependsOn ?event.
?nextPlot add:changedBy ?change2.
?change2 a add:Change.
?change2 add:appliedTo ?previousPlot.
?change2 add:isChangeType ctype:LandmarkDisappearance.
?change2 add:dependsOn ?event.
?event a add:Event.
?event cad:isEventType cad_etype:Split.
?event add:hasTime [ a add:TimeInstant; add:timeStamp ?datedebut; add:timeCalendar time:Gregorian;
add:timePrecision time:Year].
}
WHERE {
select ?registerLandmark ?previousPlot ?datedebut (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?change) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?change2) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/", STRUUID())) AS ?event)
where {
    ?registerLandmark a add:Landmark.
    ?registerLandmark add:hasTime/add:hasBeginning/add:timeStamp ?datedebut.
    ?registerLandmark add:isLandmarkType cad_ltype:Plot. 
    ?registerLandmark add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    ?attrMention add:hasAttributeVersion/cad:takenFrom cad_spval:ResteSV.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio.
    ?folio cad:isSourceType srctype:FolioNonBati.
     
    ?previousPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
    ?previousPlot add:hasAttribute ?attrMention2.
    ?attrMention2 add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folioPrevious.
    ?folioPrevious2 cad:isSourceType srctype:FolioNonBati.
    graph <http://rdf.geohistoricaldata.org/id/ordre>
    {?registerLandmark add:after ?previousPlot.}
    
    FILTER(sameTerm(?folio,?folioPrevious))
}
GROUP BY ?registerLandmark ?previousPlot ?datedebut
ORDER BY ?datedebut}
```
## 5. Réorganisation de la généalogie des parcelles à partir des divisions
```sparql
```