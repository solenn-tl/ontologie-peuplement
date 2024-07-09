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
        MINUS {?mapsLandmark add:isSimilarTo ?registersLandmark}
        ?mapsLandmark dcterms:identifier ?plotidm.
        ?registersLandmark dcterms:identifier ?plotidr.
        BIND(
             IF(STRENDS(STR(?plotidr), "p"), 
                SUBSTR(STR(?plotidr), 1, STRLEN(STR(?plotidr)) - 1), 
                ?plotidr
              ) AS ?plotid
            )
        filter(?plotidm = ?plotid)
}
```

## 2. Caractériser les évènements à l'aide des colonnes de reports de folios

| Condition                                             | Evènement concerné | Type d'évènement                                    |
| ----------------------------------------------------- | ------------------ | --------------------------------------------------- |
| Porté à = 2..* folios                                 | Event End          | Split (+ Création de 2 nouveaux landmarks)          |
| Tiré de = 2..* folios                                 | Event Start        | Merge (+ Création d'un nouveau landmark)            |
| Porté à = 1 folio (= actuel)                          | Event End          | Mise à jour attributaire (à caractériser plus tard)                  |
| Porté à = 1 folio (!= actuel)                          | Event End          | Mutation de contribuable                  |
| Tiré de = 1 folio (= actuel)                          | Event Start        | Mise à jour attributaire (à caractériser plus tard) |
| Tiré de = 1 folio (!= actuel)                         | Event Start        | Mutation de contribuable                            |
| Tiré de = ResteSV                                     | Event Start        | Split                                               |
| Tiré de = ConstructionNouvelleSV                      | Event Start        | Construction                                        |
| Porté à = DemolitionSV                                | Event End          | Demotion                                            |
| Porté à = VoiePubliqueSV                              | Event End          | Split (+ ? Création nouveau landmark ?)             |
| Tiré de = AdditionConstructionSV + 1 folio (= actuel) | Event Start        | BuiltPlotEvent                                      |
| Tiré de = AdditionConstructionSV                      | Event Start        | BuiltPlotEvent                                      |
| Porté à = AdditionConstructionSV + 1 folio (= actuel) | Event End          | BuiltPlotEvent                                      |
| Porté à = AdditionConstructionSV                      | Event End          | BuiltPlotEvent                                      |
| Tiré de = AugmentationSV                              | Event Start        | BuiltPlotEvent                                      |
| Tiré de = Omission{{date}}                            | Event Start        | Omission (? impacte sur les dates de validité ?)    |

Après : Créer les parcelles filles à partir des évènements qui impliquent la création de nouveaux landmarks (Merge et Split)

### 2.1 Porté à = 2..* folios 
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX source: <http://data.ign.fr/id/source/>
PREFIX cad_etype: <http://data.ign.fr/id/codes/cadastre/eventType/>
PREFIX landmark: <http://data.ign.fr/id/landmark/>

INSERT {
    GRAPH <http://data.ign.fr/plots/cad2/> {
       ?eventEnd cad:isEventType cad_etype:Split
    }
}
WHERE {
  {SELECT ?plot ?plotid ?matrice ?folio ?cf ?rowid (COUNT(?portea) AS ?nextfolios) ?timeStartY ?timeEndY ?eventEnd
  WHERE {
    ?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot .
    ?plot dcterms:identifier ?plotid .
    ?plot add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    
    # Documents
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn ?matrice.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio.
    ?attrMention add:hasAttributeVersion/cad:takenFrom ?tirede.
    ?attrMention add:hasAttributeVersion/cad:passedTo ?portea.
    ?portea cad:hasNumFolio ?portealabel.
    ?portea cad:isSourceType [skos:broader+ srctype:Folio].
    ?folio cad:isSourceType [skos:broader+ srctype:Folio].
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn ?classement.
    ?classement dcterms:identifier ?rowid.
    
    # Changes and Events
    ?attrMention add:hasAttributeVersion/add:isMadeEffectiveBy ?changeStart.
    ?attrMention add:hasAttributeVersion/add:isOutdatedBy ?changeEnd.
    ?changeStart add:dependsOn ?eventStart.
    ?changeEnd add:dependsOn ?eventEnd.
    ?eventStart add:hasTime/add:timeStamp|add:hasEarliestTimeInstant/add:timeStamp ?timeStart.
    ?eventEnd add:hasTime/add:timeStamp|add:hasLatestTimeInstant/add:timeStamp ?timeEnd.
    BIND(YEAR(?timeStart) AS ?timeStartY)
    BIND(YEAR(?timeEnd) AS ?timeEndY)

    # Filters
    FILTER(?matrice = source:94_Gentilly_MAT_NB_1848)
    }
  GROUP BY ?plot ?plotid ?matrice ?folio ?cf ?rowid ?timeStartY ?timeEndY ?eventEnd
  HAVING(COUNT(?portea) > 1)
  ORDER BY ?folio ?rowid
  }
}

## 2.2 Tiré de = 2..* folios 
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX source: <http://data.ign.fr/id/source/>
PREFIX cad_etype: <http://data.ign.fr/id/codes/cadastre/eventType/>
PREFIX landmark: <http://data.ign.fr/id/landmark/>

INSERT {
    GRAPH <http://data.ign.fr/plots/cad2/> {
       ?eventStart cad:isEventType cad_etype:Merge
    }
}
WHERE {
  {SELECT ?plot ?plotid ?matrice ?folio ?cf ?rowid (COUNT(?tirede) AS ?previousfolios) ?timeStartY ?timeEndY ?eventEnd
  WHERE {
    ?plot a add:Landmark .
    ?plot add:isLandmarkType cad_ltype:Plot .
    ?plot dcterms:identifier ?plotid .
    ?plot add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    
    # Documents
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn ?matrice.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio.
    ?attrMention add:hasAttributeVersion/cad:takenFrom ?tirede.
    ?attrMention add:hasAttributeVersion/cad:passedTo ?portea.
    ?portea cad:hasNumFolio ?portealabel.
    ?portea cad:isSourceType [skos:broader+ srctype:Folio].
    ?folio cad:isSourceType [skos:broader+ srctype:Folio].
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn ?classement.
    ?classement dcterms:identifier ?rowid.
    
    # Changes and Events
    ?attrMention add:hasAttributeVersion/add:isMadeEffectiveBy ?changeStart.
    ?attrMention add:hasAttributeVersion/add:isOutdatedBy ?changeEnd.
    ?changeStart add:dependsOn ?eventStart.
    ?changeEnd add:dependsOn ?eventEnd.
    ?eventStart add:hasTime/add:timeStamp|add:hasEarliestTimeInstant/add:timeStamp ?timeStart.
    ?eventEnd add:hasTime/add:timeStamp|add:hasLatestTimeInstant/add:timeStamp ?timeEnd.
    BIND(YEAR(?timeStart) AS ?timeStartY)
    BIND(YEAR(?timeEnd) AS ?timeEndY)

    # Filters
    FILTER(?matrice = source:94_Gentilly_MAT_NB_1848)
  }
  GROUP BY ?plot ?plotid ?matrice ?folio ?cf ?rowid ?timeStartY ?timeEndY ?eventEnd
  HAVING(COUNT(?tirede) > 1)
  ORDER BY ?folio ?rowid
  }
}
```

## 