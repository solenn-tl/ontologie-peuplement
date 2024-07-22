# Update inittial data
These requests are used to complete the initial data created from sources.

## 1. Property accounts and owners
### 1.1. Add hasTime property to each Property Account using min and max time in its ArticleDeClassement
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>

#Add valid time of a Land Property account using the min beginning date and max end date of table rows.
#CONSTRUCT{
#    ?cf add:hasTime [add:hasBeginning [add:timeStamp ?start]; add:hasEnd [add:timeStamp ?end]].
#}
INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/plots/fromregisters> {
    ?cf add:hasTime [add:hasBeginning [add:timeStamp ?start]; add:hasEnd [add:timeStamp ?end]].
    }
}
WHERE {
select ?cf (MIN(?debut) AS ?start) (MAX(?fin) AS ?end) 
where { 
        ?cf a rico:RecordPart; cad:isSourceType srctype:CompteFoncier.
        ?cf rico:hasOrHadConstituent ?classement.
        ?classement cad:isSourceType srctype:ArticleDeClassement.
        ?classement cad:mentions/add:isAttributeVersionOf/add:isAttributeOf ?landmark.
        ?landmark add:hasTime/add:hasBeginning/add:timeStamp ?debut.
        ?landmark add:hasTime/add:hasEnd/add:timeStamp ?fin.
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

insert {
    GRAPH <http://rdf.geohistoricaldata.org/plots/fromregisters> {
    ?event cad:isEventType cad_etype:OpenPropertyAccount.
    ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?debut]}
}
where { 
	?event a add:Event.
    ?event add:hasChange ?change.
    ?change add:appliedTo ?attr.
    ?attr add:isAttributeType cad_atype:PlotTaxpayer.
    ?change add:isChangeType ctype:AttributeVersionAppearance.
    ?attr add:isAttributeOf/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?cf add:hasTime/add:hasBeginning/add:timeStamp ?debut.
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

INSERT {
    GRAPH <http://rdf.geohistoricaldata.org/plots/fromregisters> {
    ?event cad:isEventType cad_etype:ClosePropertyAccount.
    ?event add:hasTime [add:timePrecision time:Year; add:timeCalendar time:Gregorian; add:timeStamp ?end]}
}
where { 
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