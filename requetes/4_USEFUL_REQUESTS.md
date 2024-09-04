# Useful WIP requests

## Enumerate JS functions in the triplestore
```sparql
PREFIX jsfn:<http://www.ontotext.com/js#>
SELECT ?s ?o {
    ?s jsfn:enum ?o
}
```

## Landmarks versions ahev un propriétaire au moins
```sparql
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>

select ?plot (count(distinct ?v) AS ?c) where {
    GRAPH <http://rdf.geohistoricaldata.org/landmarksversions> {
    ?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot.
    ?plot add:hasTime[add:hasBeginning/add:timeStamp ?start; add:hasEnd/add:timeStamp ?end].
    ?plot add:hasAttribute ?att.
    ?att add:isAttributeType cad_atype:PlotTaxpayer.
    }
    ?att add:hasAttributeVersion ?v.
}
GROUP BY ?plot
ORDER BY ?c
```

## Get aggregated attribute versions of type PlotNature for landmark versions aggregations
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?root ?plot (GROUP_CONCAT(distinct ?id) AS ?ids) (GROUP_CONCAT(distinct ?natureValue; separator=', ') AS ?groupNatureValue) ?t1 ?t2 (count(distinct ?children) AS ?rows) 
WHERE { GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations> { 
        ?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot. 
        ?plot dcterms:identifier ?id. ?plot add:hasRootLandmark ?root. } 
    ?plot add:hasTrace ?children. 
    ?plot add:hasAttribute ?nature. 
    ?nature add:isAttributeType cad_atype:PlotNature. 
    ?nature add:hasAttributeVersion ?natureV. 
    ?natureV cad:hasPlotNature/skos:prefLabel ?natureValue. 
    ?natureV add:changedBy ?change1. 
    ?change1 add:isChangeType ctype:AttributeVersionAppearance. 
    ?change1 add:dependsOn ?event1. 
    ?event1 add:hasTime/add:timeStamp ?t1. 
    ?natureV add:changedBy ?change2. 
    ?change2 add:isChangeType ctype:AttributeVersionDisappearance. 
    ?change2 add:dependsOn ?event2. 
    ?event2 add:hasTime/add:timeStamp ?t2. 
    BIND(YEAR('1813-01-01'^^xsd:dateTimeStamp) AS ?year) 
    FILTER(regex(?id, 'B-224p') || regex(?id, 'B-224$')) 
    FILTER(lang(?natureValue) = 'fr') 
    FILTER(YEAR(?t1) <= ?year && YEAR(?t2) >= ?year )} 
GROUP BY ?plot ?t1 ?t2 ?root 
ORDER BY ?ids ?plot
```

## Get aggregated attribute versions of type PlotAddress for landmark versions aggregations
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?root ?plot (GROUP_CONCAT(distinct ?id) AS ?ids) ?add ?t1 ?t2 (count(distinct ?children) AS ?rows) 
WHERE { 
    GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations> { 
        ?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot. 
        ?plot dcterms:identifier ?id. 
        ?plot add:hasRootLandmark ?root. } 
    ?plot add:hasTrace ?children. 
    # Address
    ?plot add:hasAttribute ?att.
    ?att add:isAttributeType cad_atype:PlotAddress.
    ?att add:hasAttributeVersion ?attV.
    ?attV cad:hasPlotAddress/add:relatum/skos:prefLabel ?add.
    ?attV add:changedBy ?change1. 
    ?change1 add:isChangeType ctype:AttributeVersionAppearance. 
    ?change1 add:dependsOn ?event1. 
    ?event1 add:hasTime/add:timeStamp ?t1. 
    ?attV add:changedBy ?change2. 
    ?change2 add:isChangeType ctype:AttributeVersionDisappearance. 
    ?change2 add:dependsOn ?event2. 
    ?event2 add:hasTime/add:timeStamp ?t2.
    BIND(YEAR('1860-01-01'^^xsd:dateTimeStamp) AS ?year) 
    FILTER(regex(?id, 'D-19p') || regex(?id, 'D-19$')) 
    FILTER(YEAR(?t1) <= ?year && YEAR(?t2) >= ?year )
} 
GROUP BY ?plot ?t1 ?t2 ?root ?add
ORDER BY ?ids ?plot
```

## Missing taxpayers
```sparql
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
select ?s (count(distinct ?o) AS ?c)  
where { 
    graph <http://rdf.geohistoricaldata.org/landmarksversions> {
        ?s a add:Landmark; add:isLandmarkType cad_ltype:Plot. }
        ?s add:hasAttribute/add:hasAttributeVersion/cad:hasTaxpayer ?o .
}
GROUP BY ?s
ORDER By ?c
```

## Get aggregated attribute versions of type PlotTaxpayer for landmark versions aggregations
```sparql

```