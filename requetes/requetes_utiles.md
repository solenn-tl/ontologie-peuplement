## Liste des propriétaires 
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

select ?s ?label ?folio ?numfolio ?matrice ?mtype where { 
	?s a cad:Taxpayer.
    ?s rdfs:label ?label.
    ?s cad:isTaxpayerOf/add:isAttributeVersionOf/cad:isCadastreAttributeOf ?mutation.
    ?mutation rico:isOrWasConstituentOf+ ?folio.
    ?folio cad:isSourceType srctype:Folio.
    ?folio cad:hasNumFolio ?numfolio.
    ?folio rico:isOrWasPartOf/rico:isOrWasIncludedIn ?matrice.
}
ORDER BY ?numfolio
```