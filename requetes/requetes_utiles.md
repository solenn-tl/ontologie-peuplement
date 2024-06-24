##
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>

select * where { 
	?s a cad:Taxpayer.
    ?s rdfs:label ?label.
    ?s cad:isTaxpayerOf/add:isAttributeVersionOf/cad:isCadastreAttributeOf ?mutation.
    ?mutation rico:isOrWasConstituentOf ?record.
    ?record cad:isSourceType srctype:Folio.
    ?record rico:isOrWasIncludeOrIncluded+ ?recordset.
    ?recordset cad:isSourceType srctype:Matrice.
}
ORDER BY ?label
```