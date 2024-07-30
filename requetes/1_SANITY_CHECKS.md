# Data sanity checks

## 1. Assert End date is not before start date
Should return 0 results.
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
select * where { 
	?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?plot add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?plot add:hasTime/add:hasEnd/add:timeStamp ?end.
    FILTER(?start > ?end)
} 
```

## 2. Get next possible version using itme and document order
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>

select * where { 
	?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?plot dcterms:identifier ?plotid.
    ?plot add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?plot add:hasTime/add:hasEnd/add:timeStamp ?end.
    OPTIONAL{?plot (add:hasNextVersionInSRCOrder|add:hasOverlappingVersionInSRCOrder) ?next}
    FILTER(?plotid = "D-14")
}
``` 

## 3. Check links between rows in the same cf
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX landmark: <http://rdf.geohistoricaldata.org/id/landmark/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>

select distinct ?plot1 ?folio ?start1 ?end1 ?relatedLandmark ?folioR ?startR ?endR
where { 
    ?plot1 add:hasOverlappingVersionInSRCOrder ?relatedLandmark.
    
	?plot1 a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?plot1 dcterms:identifier ?plotid.
    ?plot1 add:hasTime/add:hasBeginning/add:timeStamp ?start1.
    ?plot1 add:hasTime/add:hasEnd/add:timeStamp ?end1.
    ?plot1 add:hasAttribute [add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio]. 
	?folio cad:isSourceType srctype:FolioNonBati.
    
    ?relatedLandmark add:hasTime/add:hasBeginning/add:timeStamp ?startR.
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?endR.
    ?relatedLandmark add:hasAttribute [add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folioR]. 
	?folioR cad:isSourceType srctype:FolioNonBati.
    
    FILTER NOT EXISTS{?plot1 add:hasPreviousVersionInSRCOrder ?other}
    #FILTER(?plotid = "D-19" || ?plotid = "D-19p")
}
ORDER BY ?plot1 ?startR ?start1