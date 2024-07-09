## Création du graphe

### 1. Liens sameAs entre les parcelles présentes dans le graphe central et les parcelles issues des matrices
Attention. A faire par matrice !!!
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

INSERT {
        GRAPH <http://data.ign.fr/plots/cad2/> {
            ?registersLandmark add:isSimilarTo ?mapsLandmark.
            ?mapsLandmark add:isSimilarTo ?registersLandmark.
    }}
WHERE {
        GRAPH <http://data.ign.fr/plots/frommaps/> {
           ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?registersLandmark add:hasAttribute ?attr1.
        ?attr1 add:isAttributeType cad_atype:PlotMention; add:hasAttributeVersion ?attrv1.
        ?attrv1 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
        MINUS {?registersLandmark add:isSimilarTo ?mapsLandmark}
        MINUS {?mapsLandmark add:isSimiarTo ?registersLandmark}
        ?mapsLandmark dcterms:identifier ?plotid.
        ?registersLandmark dcterms:identifier ?plotid.
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

## 3. Réordonner les versions attributs
1. Même numéro de parcelle et timeEnd = timeStart

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
        ?changeStart1 add:isSimilarTo ?changeEnd2.
        ?changeEnd2 add:isSimilarTo ?changeStart1.
        ?eventStart1 add:isSimilarTo ?eventEnd2.
        ?eventEnd2 add:isSimilarTo ?eventStart1.
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
        ?attr1 add:isAttributeType cad_atype:PlotMention.
        ?attr2 add:isAttributeType cad_atype:PlotMention.
    
        ?attr1 add:hasAttributeVersion/add:isMadeEffectiveBy ?changeStart1.
        ?attr1 add:hasAttributeVersion/add:isOutdatedBy ?changeEnd1.
        ?changeStart1 add:dependsOn ?eventStart1.
        ?changeEnd1 add:dependsOn ?eventEnd1.
        ?eventStart1 add:hasTime/add:timeStamp|add:hasEarliestTimeInstant/add:timeStamp ?timeStart1.
        ?eventEnd1 add:hasTime/add:timeStamp|add:hasLatestTimeInstant/add:timeStamp ?timeEnd1.
        BIND(YEAR(?timeEnd1) AS ?timeEndY)
    
        ?attr2 add:hasAttributeVersion/add:isMadeEffectiveBy ?changeStart2.
        ?attr2 add:hasAttributeVersion/add:isOutdatedBy ?changeEnd2.
        ?changeStart2 add:dependsOn ?eventStart2.
        ?changeEnd2 add:dependsOn ?eventEnd2.
        ?eventStart2 add:hasTime/add:timeStamp|add:hasEarliestTimeInstant/add:timeStamp ?timeStart2.
        ?eventEnd2 add:hasTime/add:timeStamp|add:hasLatestTimeInstant/add:timeStamp ?timeEnd2.
        BIND(YEAR(?timeStart2) AS ?timeStartY )
        
        filter(?timeEndY = ?timeStartY)
}
```