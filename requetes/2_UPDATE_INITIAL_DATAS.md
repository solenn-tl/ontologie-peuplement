# Update initial data
These requests are used to complete the initial data created from sources.

## 1. Property accounts and taxpayers
### 1.1. Add *hasTime* property to each *PropertyAccount* using min and max time in its *ArticleDeClassement*
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>

#Add valid time of a Land Property account using the min beginning date and max end date of table rows.
#CONSTRUCT{?cf add:hasTime [add:hasBeginning [add:timeStamp ?cfStart]; add:hasEnd [add:timeStamp ?cfEnd]].}

INSERT { GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarkssources>{?cf add:hasTime [add:hasBeginning [add:timeStamp ?cfStart]; add:hasEnd [add:timeStamp ?cfEnd]].}}
WHERE {
    SELECT ?cf (MIN(?start) AS ?cfStart) (MAX(?end) AS ?cfEnd) 
    WHERE { 
            ?cf a rico:RecordPart; cad:isSourceType srctype:CompteFoncier.
            ?cf rico:hasOrHadConstituent ?classement.
            ?classement cad:isSourceType srctype:ArticleDeClassement.
            ?classement cad:mentions/add:isAttributeVersionOf/add:isAttributeOf ?landmark.
            ?landmark add:hasTime/add:hasBeginning/add:timeStamp ?start.
            ?landmark add:hasTime/add:hasEnd/add:timeStamp ?end.
        }
    GROUP BY ?cf
}
```
### 1.2 Update Event related to the first taxpayer of a property account
```sparql
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX time: <http://www.w3.org/2006/time#>

INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarkssources> {
    ?event add:hasTime[add:timeStamp ?start; add:timePrecision time:Year; add:timeCalendar time:Gregorian].
	?event cad:isEventType cad_etype:OpenPropertyAccount.}
}
WHERE {SELECT ?cf ?start ?mutation ?version ?change ?event
    WHERE { 
        ?cf a rico:RecordResource.
        ?cf cad:isSourceType srctype:CompteFoncier.
        ?cf add:hasTime/add:hasBeginning/add:timeStamp ?start.
        ?cf rico:hasOrHadConstituent ?mutation.
        ?mutation cad:isSourceType srctype:ArticleDeMutation.
        ?mutation add:hasAttribute/add:hasAttributeVersion ?version.
        ?version add:isMadeEffectiveBy ?change.
        ?change add:dependsOn ?event.
        FILTER NOT EXISTS{?event cad:isEventType cad_etype:TaxpayerMutation.}
    }
}
```
### 1.3 Update Event related to the last taxpayer of a property account
```sparql
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX time: <http://www.w3.org/2006/time#>

INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarkssources> {
    ?event add:hasTime[add:timeStamp ?end; add:timePrecision time:Year; add:timeCalendar time:Gregorian].
	?event cad:isEventType cad_etype:ClosePropertyAccount.}
}
WHERE {SELECT ?cf ?start ?mutation ?version ?change ?event
    WHERE { 
        ?cf a rico:RecordResource.
        ?cf cad:isSourceType srctype:CompteFoncier.
        ?cf add:hasTime/add:hasEnd/add:timeStamp ?end.
        ?cf rico:hasOrHadConstituent ?mutation.
        ?mutation cad:isSourceType srctype:ArticleDeMutation.
        ?mutation add:hasAttribute/add:hasAttributeVersion ?version.
        ?version add:isOutdatedBy ?change.
        ?change add:dependsOn ?event.
        FILTER NOT EXISTS{?event cad:isEventType cad_etype:TaxpayerMutation.}
    }
}
```
### 1.4 Create taxpayers attribute version.s of a landmark version
* start(plotversion) <= start(taxpayer) && end(plotversion) >= (taxpayer)
```sparql
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX time: <http://www.w3.org/2006/time#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>

CONSTRUCT{
    ?plotversion add:hasAttribute ?plottaxpayerattribute.
    ?plottaxpayerattribute a add:Attribute; 
       add:isAttributeType cad_atype:PlotTaxpayer; 
       add:hasAttributeVersion ?plottaxpayerversion.
    ?plottaxpayerversion a add:AttributeVersion;
    	add:hasTaxpayer ?taxpayer;
    	add:hasRootAttribute ?taxpayerVersion.
    ?taxpayerVersion add:isRootAttributeOf ?plottaxpayerversion.
    ?plottaxpayerversion add:isMadeEffectiveBy ?change1taxpayer.
    ?plottaxpayerversion add:isOutdatedBy ?change2taxpayer.
    ?change1taxpayer a add:Change.
    ?change1taxpayer add:isChangeType ctype:AttributeVersionAppearance.
    ?change2taxpayer a add:Change.
    ?change2taxpayer add:uisChangeType ctype:AttributeVersionDisappearance.
    ?change1taxpayer add:dependsOn ?event1taxpayer.
    ?change2taxpayer add:dependsOn ?event2taxpayer.
    ?change1taxpayer add:appliedTo ?plottaxpayerversion.
    ?change2taxpayer add:appliedTo ?plotaxpayerversion.
    ?event1taxpayer add:hasTime[add:timeStamp ?starttax;add:timePrecision time:Year;add:timeCalendar time:Gregorian].
    ?event2taxpayer add:hasTime[add:timeStamp ?endtax;add:timePrecision time:Year;add:timeCalendar time:Gregorian].
}
WHERE {
    SELECT distinct ?plotversion ?start ?end ?cf ?startcf ?endcf ?taxpayerVersion ?taxpayer ?starttax ?endtax (UUID() AS ?plottaxpayerattribute) (UUID() AS ?plottaxpayerversion) (URI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change1taxpayer) (URI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change2taxpayer) (URI(CONCAT("http://rdf.geohistoricaldata.org/id/event/",STRUUID())) AS ?event1taxpayer) (URI(CONCAT("http://rdf.geohistoricaldata.org/id/event/",STRUUID())) AS ?event2taxpayer)
    WHERE { 
    GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarks> {
        ?plotversion a add:Landmark; add:isLandmarkType cad_ltype:Plot.
    }
    ?plotversion add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?plotversion add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?plotversion add:hasAttribute/add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?cf add:hasTime/add:hasBeginning/add:timeStamp ?startcf.
    ?cf add:hasTime/add:hasEnd/add:timeStamp ?endcf.
    ?cf rico:hasOrHadConstituent ?mutation.
    ?mutation cad:isSourceType srctype:ArticleDeMutation.
    ?mutation add:hasAttribute/add:hasAttributeVersion ?taxpayerVersion.
    ?taxpayerVersion cad:hasTaxpayer ?taxpayer.
    ?taxpayerVersion add:isMadeEffectiveBy ?change1.
    ?taxpayerVersion add:isOutdatedBy ?change2.
    ?change1 add:dependsOn ?event1.
    ?change2 add:dependsOn ?event2.
    ?event1 add:hasTime/add:timeStamp ?starttax.
    ?event2 add:hasTime/add:timeStamp ?endtax.
    FILTER(?start <= ?starttax && ?end >= ?endtax)
}
ORDER BY ?plotversion}
```
## 2. Taxpayers

### 2.1 Create keys to compare taxpayers names
```sparql
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX jsfn: <http://www.ontotext.com/js#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

INSERT {GRAPH<http://rdf.geohistoricaldata.org/taxpayerkeys>{
    ?taxpayer skos:hiddenLabel ?hiddenLabel}}
WHERE {
    BIND(CONCAT(?labelWALower,?surnameEmpty,?statusEmpty) AS ?hiddenLabel)
            
	{SELECT ?taxpayer ?label ?surname ?status ?labelWALower (COALESCE(?surnameWALower,"") AS ?surnameEmpty) (COALESCE(?statusWALower,"") AS ?statusEmpty)
	WHERE { 
	    ?taxpayer a cad:Taxpayer .
        ?taxpayer cad:isTaxpayerOf ?attrV.
        ?taxpayer cad:taxpayerLabel ?label.
        OPTIONAL{?taxpayer cad:taxpayerStatus ?status}.
        OPTIONAL{?taxpayer cad:taxpayerFirstName ?surname}.
        BIND(REPLACE(lcase(jsfn:replaceAccent(?label)),"[.*$^:;, ]+","") AS ?labelWALower)
        BIND(jsfn:replaceSubwords(REPLACE(lcase(jsfn:replaceAccent(?surname)),"[.*$^:;, ]+","")) AS ?surnameWALower)
        BIND(jsfn:replaceSubwords(REPLACE(lcase(jsfn:replaceAccent(?status)),"[.*$^:;, ]+","")) AS ?statusWALower)
	}
    }
}
```