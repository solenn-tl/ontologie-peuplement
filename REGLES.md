## Création du graphe

### 1. Lier les états de parcelles qui ont le même identifiant
* Les états de parcelles issus des registres sont tous liés à la parcelle *Mère* créée à partir du plan.
* Les parcelles XXX-p sont inclues à ce stade.

```sparql
PREFIX ltype: <http://rdf.geohistoricaldata.org/id/codes/address/landmarkType/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX source: <http://data.ign.fr/id/source/>

INSERT{GRAPH <http://data.ign.fr/plots/cad2/> {
        ?attr1 add:isSimilarTo ?attr2.
        ?attr2 add:isSimilarTo ?attr1.
    }}
WHERE {
    GRAPH <http://data.ign.fr/plots/frommaps/> {
        ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
    }
    	
        ?registersLandmark1 a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        #récupérer des attributs de la même matrice
        ?registersLandmark1 add:hasAttribute ?attrs.
        ?attrs add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrsv1.
        ?attrsv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    
        ?registersLandmark2 a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        #récupérer des attributs de la même matrice
        ?registersLandmark2 add:hasAttribute ?attrss.
        ?attrss add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrssv1.
        ?attrssv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
		
        ?registersLandmark1 add:isSimilarTo ?mapsLandmark.
        ?registersLandmark2 add:isSimilarTo ?mapsLandmark.
        ?registersLandmark1 add:hasAttribute ?attr1.
        ?registersLandmark2 add:hasAttribute ?attr2.
        ?mapsLandmark add:hasAttribute ?attr3.
        ?attr1 add:isAttributeType ?t.
        ?attr2 add:isAttributeType ?t.
        ?attr3 add:isAttributeType ?t.
}
```

## 2. Si deux attributs de même type : créer un lien same As entre eux
!! Attention, on ne parle pas des versions, seulement des attributs
```sparql
PREFIX ltype: <http://rdf.geohistoricaldata.org/id/codes/address/landmarkType/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX source: <http://data.ign.fr/id/source/>

INSERT{GRAPH <http://data.ign.fr/plots/cad2/> {
        ?attr1 add:isSimilarTo ?attr2.
        ?attr2 add:isSimilarTo ?attr1.
    }}
WHERE {
        GRAPH <http://data.ign.fr/plots/frommaps/> {
            ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
    	
        ?registersLandmark1 a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        #récupérer des attributs de la même matrice
        ?registersLandmark1 add:hasAttribute ?attrs.
        ?attrs add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrsv1.
        ?attrsv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    
        ?registersLandmark2 a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        #récupérer des attributs de la même matrice
        ?registersLandmark2 add:hasAttribute ?attrss.
        ?attrss add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrssv1.
        ?attrssv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
		
        ?registersLandmark1 add:isSimilarTo ?mapsLandmark.
        ?registersLandmark2 add:isSimilarTo ?mapsLandmark.
        ?registersLandmark1 add:hasAttribute ?attr1.
        ?registersLandmark2 add:hasAttribute ?attr2.
        ?mapsLandmark add:hasAttribute ?attr3.
        ?attr1 add:isAttributeType ?t.
        ?attr2 add:isAttributeType ?t.
        ?attr3 add:isAttributeType ?t.
}
```

## 3. Caractériser les évènements

| Condition                        | Evènement concerné | Type d'évènement                                  |
| -------------------------------- | ------------------ | ------------------------------------------------- |
| Porté à = 2..* folios            | Event End          | Landmark Split (+ Création d'un nouveau landmark) |
| Tiré de = 2..* folios            | Event Start        | Landmark Merge (+ Création d'un nouveau landmark) |
| Tiré de = ResteSV                | Event Start        | Landmark Split                                    |
| Tiré de = ConstructionNouvelleSV | Event Start        | Construction                                      |
| Porté à = DemolitionSV           | Event End          | Demotion                                          |
|                                  |                    |                                                   |