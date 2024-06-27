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
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX source: <http://data.ign.fr/id/source/>

select ?plot ?id 
from <http://data.ign.fr/plots/fromregisters/>
from <http://data.ign.fr/otherslandmarks>
from <http://data.ign.fr/sources_and_owners/>
where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?id .
    ?plot add:hasAttribute ?attr .
    ?attr add:isAttributeType cad_atype:PlotMention .
    ?attr add:hasAttributeVersion ?attrV .
    ?attrV cad:isMentionnedIn ?classement .
    ?classement cad:isSourceType srctype:ArticleDeClassement .
    ?record rico:hasOrHadConstituent* ?classement.
    ?record rico:isOrWasConstituentOf ?folio.
    ?folio cad:isSourceType srctype:FolioNonBati.
    ?folio rico:isOrWasConstituentOf ?page .
    ?page rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
}
order by ?id
```

## Attribut PlotMention
```sparql
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX source: <http://data.ign.fr/id/source/>

select ?plot ?id ?folio ?numfolio ?tirede ?portea ?crispbegin ?earliest ?crispend ?latest
from <http://data.ign.fr/plots/fromregisters/>
from <http://data.ign.fr/otherslandmarks>
from <http://data.ign.fr/sources_and_owners/>
where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?id .
    #Etat de parcelle
    ?plot add:hasAttribute ?attr .
    ?attr add:isAttributeType cad_atype:PlotMention .
    ?attr add:hasAttributeVersion ?attrV .
    ?attrV cad:isMentionnedIn ?classement .
    OPTIONAL{?attrV cad:takenFrom ?tirede} .
    OPTIONAL{?attrV cad:passedTo ?portea} .
    OPTIONAL{?attrV add:hasTime/add:hasBeginning/add:timeStamp ?crispbegin}
    OPTIONAL{?attrV add:hasEarliestTimeInstant/add:timeStamp ?earliest}
    OPTIONAL{?attrV add:hasTime/add:hasEnd/add:timeStamp ?crispend}
    OPTIONAL{?attrV add:hasLatestTimeInstant/add:timeStamp ?latest}
    #Source
    ?classement cad:isSourceType srctype:ArticleDeClassement .
    ?record rico:hasOrHadConstituent* ?classement .
    ?record rico:isOrWasConstituentOf ?folio .
    ?folio cad:isSourceType srctype:FolioNonBati .
    ?folio rico:isOrWasConstituentOf ?page .
    ?folio cad:hasNumFolio ?numfolio .
    ?page rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    #Filtre
    filter(?id = "D-5")
}
order by ?id
```

##Attribut PlotNature
```sparql
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX source: <http://data.ign.fr/id/source/>

select ?plot ?id ?folio ?numfolio ?nature
from <http://data.ign.fr/plots/fromregisters/>
from <http://data.ign.fr/otherslandmarks>
from <http://data.ign.fr/sources_and_owners/>
where { 
	?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?id .
    #Etat de parcelle
    ?plot add:hasAttribute ?attr .
    ?attr add:isAttributeType cad_atype:PlotMention .
    ?attr add:hasAttributeVersion ?attrV .
    ?attrV cad:isMentionnedIn ?classement .
    #Nature
    ?plot add:hasAttribute ?attrNat .
    ?attrNat add:isAttributeType cad_atype:PlotNature .
    ?attrNat add:hasAttributeVersion ?attrNatV .
    ?attrNatV cad:hasPlotNature ?nature .
    #Source
    ?classement cad:isSourceType srctype:ArticleDeClassement .
    ?record rico:hasOrHadConstituent* ?classement .
    ?record rico:isOrWasConstituentOf ?folio .
    ?folio cad:isSourceType srctype:FolioNonBati .
    ?folio rico:isOrWasConstituentOf ?page .
    ?folio cad:hasNumFolio ?numfolio .
    ?page rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    #Filtre
    filter(?id = "D-5")
}
order by ?id
```