## Liste des propriétaires mentionnés dans les folios (non bâti)
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
    ?folio cad:isSourceType srctype:FolioNonBati.
    ?folio cad:hasNumFolio ?numfolio.
    ?folio rico:isOrWasPartOf/rico:isOrWasIncludedIn ?matrice.
}
ORDER BY ?numfolio
```

## Liste des parcelles
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

select ?plot ?id 
from <http://data.ign.fr/plots/frommaps/>
from <http://data.ign.fr/otherslandmarks>
from <http://data.ign.fr/sources_and_owners/>
where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?id .
}
order by ?id
```
Remplacer ```<http://data.ign.fr/plots/frommaps/>``` par ```<http://data.ign.fr/plots/fromregisters/>``` pour voir les états de parcelles issus des matrices.

## Liste des parcelles issues d'une matrice
```
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

select ?plot ?id 
from <http://data.ign.fr/plots/fromregisters/>
from <http://data.ign.fr/otherslandmarks>
from <http://data.ign.fr/sources_and_owners/>
where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?id .
}
order by ?id
```