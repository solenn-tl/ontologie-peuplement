# Process to create the KG : use case of plots

## 1. Links between root landmarks and the potential versions of this landmark in other sources
Create a relation between the root landmarks and the landmarks that seems to be versions of this landmark
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

#Create a relation between the root landmarks and the landmarks that seems to be versions of this landmark
#CONSTRUCT {?relatedLandmark add:hasRootLandmark ?rootLandmark.?rootLandmark add:isRootLandmarkOf ?relatedLandmark.}

INSERT {GRAPH <http://rdf.geohistoricaldata.org/rootlandmarksrelations>{?relatedLandmark add:hasRootLandmark ?rootLandmark.?rootLandmark add:isRootLandmarkOf ?relatedLandmark.}}
WHERE {
        GRAPH <http://rdf.geohistoricaldata.org/rootlandmarks> {
           ?rootLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        ?relatedLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?relatedLandmark add:hasAttribute ?attr1.
        ?attr1 add:isAttributeType cad_atype:PlotMention.
        
        ####### Pseudo-identity constraint (ex: plots)
        ?rootLandmark dcterms:identifier ?plotidm.
        ?relatedLandmark dcterms:identifier ?plotidr.
        BIND(
        IF(STRENDS(STR(?plotidr), "p"), 
                SUBSTR(STR(?plotidr), 1, STRLEN(STR(?plotidr)) - 1), 
                ?plotidr
              ) AS ?plotid
            )
        filter(?plotidm = ?plotid)
        ###### END
}
```

## 2. Compute the temporal gap between two versions of a landmark
* Keep only the positive or equal to 0 results
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>

#CONSTRUCT{?rootLandmark add:hasTimeGap [ add:hasValue ?gap; add:isFirstRL ?relatedLandmark; add:isSecondRL ?relatedLandmark2]}
INSERT { GRAPH <http://rdf.geohistoricaldata.org/tmp>{?rootLandmark add:hasTimeGap [ add:hasValue ?gap; add:isFirstRL ?relatedLandmark; add:isSecondRL ?relatedLandmark2]}}
WHERE { 
    ?rootLandmark add:isRootLandmarkOf ?relatedLandmark.
    ?rootLandmark add:isRootLandmarkOf ?relatedLandmark2.
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?relatedLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?start2 .
	BIND(ofn:asDays(?start2 - ?end) as ?gap).
	FILTER ((?gap > 0) && !(sameTerm(?relatedLandmark,?relatedLandmark2)))
}
```
## 3. Create temporal relations between versions of plots

### 3.1 *hasPreviousVersion* and *hasNextVersion* in case of null or positive gap
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>

#CONSTRUCT {?relatedLandmark add:hasNextVersion ?relatedLandmark2. ?relatedLandmark2 add:hasPreviousVersion ?relatedLandmark.}
INSERT { GRAPH <http://rdf.geohistoricaldata.org/order>{
        ?relatedLandmark add:hasNextVersion ?relatedLandmark2.
        ?relatedLandmark2 add:hasPreviousPrevious ?relatedLandmark.}}
WHERE {
    #Requête principale pour récupérer les parcelles tn+1 dont l'écart avec tn est égal à l'écart minimal
	GRAPH <http://rdf.geohistoricaldata.org/tmp> {
        ?rootLandmark add:hasTimeGap ?gap.
    	?gap add:hasValue ?ecart.
        ?gap add:isFirstRL ?relatedLandmark.
        ?gap add:isSecondRL ?relatedLandmark2
    FILTER (?ecart = ?minecart && !sameTerm(?relatedLandmark, ?relatedLandmark2))}
    
    # Serach for minimal gap of each plot
    {SELECT ?relatedLandmark (MIN(?ecart2) AS ?minecart)
	WHERE {GRAPH <http://rdf.geohistoricaldata.org/tmp> {
    	?rootLandmark add:hasTimeGap ?gap2.
    	?gap2 add:hasValue ?ecart2.
        ?gap2 add:isFirstRL ?relatedLandmark.
        } 
	}
	GROUP BY ?relatedLandmark
    ORDER BY ?minecart}
    # End
}
```
* Then, delete the *http://rdf.geohistoricaldata.org/tmp* named graph.

### 3.2 *hasOverlappingVersion* and *isOverlappedByVersion* in case of negative gap and version have different start date
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>

# CONSTRUCT{?relatedLandmark add:hasOverlappingVersion ?relatedLandmark2. ?relatedLandmark2 add:isOverlappedByVersion ?relatedLandmark.}

INSERT{ GRAPH <http://rdf.geohistoricaldata.org/order>{?relatedLandmark add:hasOverlappingVersion ?relatedLandmark2. ?relatedLandmark2 add:isOverlappedByVersion ?relatedLandmark.}}
    WHERE {
    GRAPH <http://rdf.geohistoricaldata.org/rootlandmarksrelations> 
    {?rootLandmark add:isRootLandmarkOf ?relatedLandmark.
    ?rootLandmark add:isRootLandmarkOf ?relatedLandmark2.}
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?relatedLandmark add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?relatedLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?start2 .
    BIND(ofn:asDays(?start2 - ?end) as ?ecart).
    BIND(ofn:asDays(?start2 - ?start) as ?ecartDeb).
    FILTER ((?ecart < 0) && (?ecartDeb > 0) && !(sameTerm(?relatedLandmark,?relatedLandmark2)))
}
```
### 3.3 *hasOverlappingVersion* and *isOverlappedByVersion* in case of negative gap and version have same start date
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>

CONSTRUCT{?relatedLandmark add:isOverlappedByVersion ?relatedLandmark2. ?relatedLandmark2 add:hasOverlappingVersion ?relatedLandmark.}
#INSERT{ GRAPH <http://rdf.geohistoricaldata.org/order>{?relatedLandmark add:isOverlappedByVersion ?relatedLandmark2. ?relatedLandmark2 add:hasOverlappingVersion ?relatedLandmark.}}
WHERE {
    GRAPH <http://rdf.geohistoricaldata.org/rootlandmarksrelations> 
    {?rootLandmark add:isRootLandmarkOf ?relatedLandmark.
    ?rootLandmark add:isRootLandmarkOf ?relatedLandmark2.}
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?relatedLandmark add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?relatedLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?start2 .
    ?relatedLandmark2 add:hasTime/add:hasEnd/add:timeStamp ?end2.
    BIND(ofn:asDays(?start2 - ?end) as ?ecart).
    BIND(ofn:asDays(?start2 - ?start) as ?ecartDeb).
    BIND(ofn:asDays(?end2 - ?end) as ?ecartFin).
    FILTER ((?ecart < 0) && (?ecartDeb = 0) && (?ecartFin < 0) && !(sameTerm(?relatedLandmark,?relatedLandmark2)))
}
```

## 4. Create changes and events
### 4.1 Create LandmarkDisappearance Changes linked to Split Events using "Porté à" >= (2 folios)
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX time: <http://www.w3.org/2006/time#>

#construct {
INSERT { GRAPH <http://rdf.geohistoricaldata.org/changes_events> {
    ?event a add:Event.
    ?event cad:isEventType cad_etype:Split.
    ?change a add:Change.
    ?change add:isChangeType ctype:LandmarkDisappearance.
    ?change add:dependsOn ?event.
    ?event add:hasTime [a add:TimeInstant ;
           add:timeCalendar time:Gregorian ;
    	   add:timePrecision time:Year ;
           add:timeStamp ?end
    ].
    ?change add:appliedTo ?relatedLandmark.
    ?relatedLandmark add:changedBy ?change.
    }
}
WHERE{
SELECT ?relatedLandmark ?end (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/event/", STRUUID())) AS ?event) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change) 
WHERE {
    {?relatedLandmark a add:Landmark.
    ?relatedLandmark add:isLandmarkType cad_ltype:Plot. 
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?relatedLandmark add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    ?attrMention add:hasAttributeVersion/cad:passedTo ?portea.
    ?portea cad:isSourceType srctype:FolioNonBati.}
}
GROUP BY ?relatedLandmark ?end
HAVING(count(?portea) > 1)
ORDER BY ?end}
```
### 4.2 Create LandmarkAppearance Changes linked to Split Events using "Tiré de" = ResteSV
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>

#CONSTRUCT {?change2 a add:Change. ?change2 add:isChangeType ctype:LandmarkAppearance. ?change2 add:dependsOn ?event. ?nextLandmark add:changedBy ?change2. ?change2 add:appliedTo ?nextLandmark.}
INSERT { GRAPH <http://rdf.geohistoricaldata.org/changes_events>{
    ?change2 a add:Change. 
    ?change2 add:isChangeType ctype:LandmarkAppearance. 
    ?change2 add:dependsOn ?event. 
    ?nextLandmark add:changedBy ?change2. 
    ?change2 add:appliedTo ?nextLandmark.}
}
WHERE {
	select ?nextLandmark ?event (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change2)
	where { 
    	?relatedLandmark add:hasRootLandmark ?rootLandmark.
    	?nextLandmark add:hasRootLandmark ?rootLandmark.
    	?relatedLandmark (add:hasNext|add:hasOverlappingVersion) ?nextLandmark.
    
		?relatedLandmark a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    	?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?sortie.
    	?relatedLandmark add:hasAttribute ?attrMention.
        ?attrMention add:hasAttributeVersion/cad:passedTo ?j1.
        
    	?relatedLandmark add:changedBy ?disChange.
    	?disChange add:isChangeType ctype:LandmarkDisappearance.
    	?disChange add:dependsOn ?event.
        
    	?nextLandmark a add:Landmark; add:isLandmarkType cad_ltype:Plot .
   	 	?nextLandmark add:hasTime/add:hasBeginning/add:timeStamp ?entree2.
    	?nextLandmark add:hasAttribute ?attrMention2.
    	?attrMention2 add:isAttributeType cad_atype:PlotMention.
        ?attrMention2 add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?j1.
    	?j1 cad:isSourceType srctype:FolioNonBati.

    	?attrMention2 add:hasAttributeVersion/cad:takenFrom ?tirede2.
    	{?tirede2 cad:isSourceType srctype:FolioNonBati} UNION {FILTER(?tirede2 IN(cad_spval:CelluleVideSV,cad_spval:ResteSV))}

    	FILTER(!sameTerm(?relatedLandmark, ?nextLandmark))
    	FILTER(YEAR(?sortie) = YEAR(?entree2))
	} 
    ORDER BY ?rootLandmark ?sortie ?j1
}
```

### 4.3 Create LandmarkAppearance changes and events of initial root landmarks

### 4.4 Create LandmarkDisAppearance changes of initial root landmarks

## 5. Reorganise *add:isRootLandmarkOf* / *add:hasRootLandmark* relations taking new landmarks identified at step 4
