## Liste des propriétaires 
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
select ?s ?label ?folio ?numfolio ?matrice where { 
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

## Liste des landmarks de type Plot
```sparql
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
select ?plotid where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?plotid .
}
order by ?plotid
```

## Liste des parcelles de type Plot dans le graph noyau
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

select ?id where { GRAPH <http://data.ign.fr/coreplots/>{
	?s a add:Landmark .
    ?s add:isLandmarkType cad_ltype:Plot.
    ?s dcterms:identifier ?id .
}
}
order by ?id
```

## Test en cours
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX atype: <http://rdf.geohistoricaldata.org/id/codes/address/attributeType/>

select ?id ?geom ?attrV ?changeStart
where { 
	GRAPH <http://data.ign.fr/coreplots/>{
	?s a add:Landmark .
    ?s add:isLandmarkType cad_ltype:Plot.
    ?s dcterms:identifier ?id .
    ?s add:hasAttribute ?attr .
    ?attr add:isAttributeType atype:Geometry.
    ?attr add:hasAttributeVersion ?attrV .
    ?attrV add:versionValue ?geom .
    ?attrV add:isMadeEffectiveBy ?changeStart .
	}
}
order by ?id