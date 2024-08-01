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

INSERT { GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarks>{?cf add:hasTime [add:hasBeginning [add:timeStamp ?cfStart]; add:hasEnd [add:timeStamp ?cfEnd]].}}
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
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX time: <http://www.w3.org/2006/time#>

#CONSTRUCT {?event cad:isEventType cad_etype:OpenPropertyAccount. ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?start]}

INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarks> {
    ?event cad:isEventType cad_etype:OpenPropertyAccount.
    ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?debut]}
}
WHERE { 
	?event a add:Event.
    ?event add:hasChange ?change.
    ?change add:appliedTo ?attr.
    ?attr add:isAttributeType cad_atype:PlotTaxpayer.
    ?change add:isChangeType ctype:AttributeVersionAppearance.
    ?attr add:isAttributeOf/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?cf add:hasTime/add:hasBeginning/add:timeStamp ?start.
}
```
### 1.3 Update Event related to the last taxpayer of a property account
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX time: <http://www.w3.org/2006/time#>

#CONSTRUCT {?event cad:isEventType cad_etype:ClosePropertyAccount. ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?end]}

INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/relatedlandmarks> {
    ?event cad:isEventType cad_etype:ClosePropertyAccount.
    ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?end]}}
WHERE { 
	?event a add:Event.
    ?event add:hasChange ?change.
    ?change add:appliedTo ?attr.
    ?attr add:isAttributeType cad_atype:PlotTaxpayer.
    ?change add:isChangeType ctype:AttributeVersionDisappearance.
    ?attr add:isAttributeOf/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?cf add:hasTime/add:hasEnd/add:timeStamp ?end.
}
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