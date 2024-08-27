# Useful WIP requests

## Enumerate JS functions in the triplestore
```sparql
PREFIX jsfn:<http://www.ontotext.com/js#>
SELECT ?s ?o {
    ?s jsfn:enum ?o
}
```
## Get aggregated attribute versions of type PlotNature for landmark versions aggregations
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?plot (GROUP_CONCAT(?id) AS ?ids) ?natureValue ?t1 ?t2
WHERE { 
    GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregation> {
		?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot.
        ?plot dcterms:identifier ?id.
	}
    ?plot add:hasAttribute ?nature.
    ?nature add:isAttributeType cad_atype:PlotNature.
    ?nature add:hasAttributeVersion ?natureV.
    ?natureV cad:hasPlotNature ?natureValue.
    ?natureV add:changedBy ?change1.
    ?change1 add:isChangeType ctype:AttributeVersionAppearance.
    ?change1 add:dependsOn ?event1.
    ?event1 add:hasTime/add:timeStamp ?t1.
    ?natureV add:changedBy ?change2.
    ?change2 add:isChangeType ctype:AttributeVersionDisappearance.
    ?change2 add:dependsOn ?event2.
    ?event2 add:hasTime/add:timeStamp ?t2.
    BIND(YEAR("1858-01-01"^^xsd:dateTimeStamp) AS ?year)
    FILTER(regex(?id, "D-19"))
    FILTER(YEAR(?t1) <= ?year && YEAR(?t2) >= ?year )
} 
GROUP BY ?plot ?natureValue ?t1 ?t2
ORDER BY ?ids ?plot
```