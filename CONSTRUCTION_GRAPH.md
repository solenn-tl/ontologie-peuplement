## 1. Liens entre les parcelles des plans et des états de parcelles des registres
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>

CONSTRUCT {
    ?registersLandmark add:hasRootLandmark ?mapsLandmark.
    ?mapsLandmark add:isRootLandmarkOf ?registersLandmark.
   }
WHERE {
        GRAPH <http://rdf.geohistoricaldata.org/plots/frommaps> {
           ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?registersLandmark add:hasAttribute ?attr1.
        ?attr1 add:isAttributeType cad_atype:PlotMention.
    
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

## 2. Calcul des écarts temporels entre des parcelles (registres) étant liées au même objet initial
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>

CONSTRUCT {?mapsLandmark add:hasTimeGap [add:hasValue ?ecart; 
                         add:isFirstRL ?registerLandmark; 
                         add:isSecondRL ?registerLandmark2]}
WHERE {
    GRAPH <http://rdf.geohistoricaldata.org/issimilar> 
    {?mapsLandmark add:hasRootLandmark ?registerLandmark.
    ?mapsLandmark add:hasRootLandmark ?registerLandmark2.}
    ?registerLandmark add:hasTime/add:hasEnd/add:timeStamp ?fin.
    ?registerLandmark add:hasAttributeVersion/cad:passedTo ?folio.
    ?registerLandmark2 add:hasTime/add:hasBeginning/add:timeStamp ?debut2 .
    ?registerLandmark2 add:hasAttribute ?attrM2.
    ?attrM2 add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf ?folio.
    ?folio cad:isSourceType srctype:FolioNonBati.
    
	BIND(ofn:asDays(?debut2 - ?fin) as ?ecart).
	FILTER ((?ecart > 0) && !(sameTerm(?registerLandmark,?registerLandmark2)))
}
```
## 3. Ajout de relations before/after entre les parcelles (registres) à l'aide des écarts temporels
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>

#SELECT ?registerLandmark ?registerLandmark2 ?ecart
CONSTRUCT {?registerLandmark add:hasNext ?registerLandmark2.
    ?registerLandmark2 add:hasPrevious ?registerLandmark.
}
WHERE {
    #Requête principale pour récupérer les parcelles tn+1 dont l'écart avec tn est égal à l'écart minimal
	GRAPH <http://rdf.geohistoricaldata.org/temporaire> {
    	?mapsLandmark add:hasTimeGap ?gap.
    	?gap add:hasValue ?ecart.
        ?gap add:isFirstRL ?registerLandmark.
        ?gap add:isSecondRL ?registerLandmark2} 
    FILTER (!sameTerm(?registerLandmark, ?registerLandmark2))
	FILTER(?ecart = ?minecart)
    
    # Sous-requête pour récupérer l'écart min lié à une parcelle
    {SELECT ?registerLandmark (MIN(?ecart2) AS ?minecart)
	WHERE {GRAPH <http://rdf.geohistoricaldata.org/temporaire> {
    	?mapsLandmark add:hasTimeGap ?gap2.
    	?gap2 add:hasValue ?ecart2.
        ?gap2 add:isFirstRL ?registerLandmark.} 
	}
	GROUP BY ?registerLandmark
    ORDER BY ?minecart}
    # Fin sous-requête
}
```

## 4.1 Création des changements et des évènements "Disparition de landmark" faisant suite à des divisions de parcelles (registres) détectées à partir du champ Porté à (2..* folios)
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX time: <http://www.w3.org/2006/time#>

construct {
    ?event a add:Event.
    ?change a add:Change.
    ?change2 a add:Change.
    ?change add:dependsOn ?event.
    ?change2 add:dependsOn ?event.
    ?event cad:isEventType cad_etype:Split.
    ?change add:isChangeType ctype:LandmarkDisappearance.
    ?event add:hasTime [a add:TimeInstant ;
           add:timeCalendar time:Gregorian ;
    	   add:timePrecision time:Year ;
           add:timeStamp ?datefin
    ].
    ?change add:appliedTo ?registerLandmark.
    ?registerLandmark add:changedBy ?change.
}
WHERE{
SELECT ?registerLandmark ?plotid ?datefin (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/event/", STRUUID())) AS ?event) (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change) 
WHERE {
    {?registerLandmark a add:Landmark.
    ?registerLandmark add:isLandmarkType cad_ltype:Plot. 
    ?registerLandmark dcterms:identifier ?plotid.
    ?registerLandmark add:hasTime/add:hasEnd/add:timeStamp ?datefin.
    ?registerLandmark add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    ?attrMention add:hasAttributeVersion/cad:passedTo ?portea.
    ?portea cad:isSourceType srctype:FolioNonBati.}
    UNION {
            GRAPH <http://rdf.geohistoricaldata.org/ordre>{
                ?registerLandmark add:hasNext ?nextPlot}
    }
}
GROUP BY ?registerLandmark ?plotid ?datefin
HAVING(count(?portea) > 1)
ORDER BY ?datefin}
```
## 4.2 Création des changements "Création de landmarks" faisant suite à une disparition ("Tiré de" = Reste ou Folio)
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>

construct {
    ?change2 a add:Change.
    ?change2 add:isChangeType ctype:LandmarkAppearance.
    ?change2 add:appliedTo ?nextplot.
    ?nextplot add:changedBy ?change2.
    ?change2 add:dependsOn ?event.
}
WHERE {
    select ?event (IRI(CONCAT("http://rdf.geohistoricaldata.org/id/change/",STRUUID())) AS ?change2) ?nextplot
    where { 
        ?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot.
        ?plot add:changedBy ?change.
        ?change a add:Change; add:isChangeType ctype:LandmarkDisappearance.
        ?change add:dependsOn ?event.
        ?event a add:Event ; cad:isEventType cad_etype:Split.
        ?plot add:hasNext ?nextplot.
        
        ?nextplot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?nextplot add:hasAttribute ?attrM.
        ?attrM add:isAttributeType cad_atype:PlotMention.
        ?attrM add:hasAttributeVersion ?tirede.
        {?tirede cad:takenFrom cad_spval:ResteSV } UNION {?tirede cad:takenFrom ?folio. ?folio cad:isSourceType srctype:FolioNonBati}
    }
    GROUP BY ?nextplot ?event
}
```

## 5. Réorganisation de la généalogie des parcelles à partir des divisions
**Partie à revoir**
### 5.1 Similarité entre les parcelles produites par division et les états de parcelles suivants
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>

#Récupérer toutes les parcelles qui sont add:after une nouvelle parcelle
#Rattacher ces parcelles à la nouvelle parcelle
insert { graph <http://rdf.geohistoricaldata.org/issimilar> {
#construct{
	?newPlot add:isRootLandmarkOf ?nextPlot.
    ?nextPlot add:hasRootLandmark ?newPlot.
    }
}
where { 
     ?event a add:Event.
     ?event cad:isEventType cad_etype:Split.
     ?event add:hasTime/add:timeStamp ?time.
     ?change add:dependsOn ?event.
     ?change2 add:dependsOn ?event.
     ?change add:isChangeType ctype:LandmarkDisappearance.
     ?change2 add:isChangeType ctype:LandmarkAppearance.
     ?change add:appliedTo ?oldPlot.
     ?change2 add:appliedTo ?newPlot.
    
     ?oldPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
     ?oldPlot add:hasAttribute ?attrM.
     ?attrM add:isAttributeType cad_atype:PlotMention.
    
     ?newPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
     ?newPlot add:hasAttribute ?attrM2.
     ?attrM2 add:isAttributeType cad_atype:PlotMention.
     
     ?nextPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
     ?nextPlot add:hasAttribute ?attrM3.
     ?attrM3 add:isAttributeType cad_atype:PlotMention.
     
    ?oldPlot add:hasNext ?newPlot.
    ?newPlot add:hasNext ?nextPlot
    FILTER(!sameTerm(?newPlot,?nextPlot))
}
```
### 5.2 Supression des liens add:isSimilarTo entre les parcelles mères et les parcelles filles et leurs descendantes + Ajouts de liens de parenté
Pas sûr que ça soit toujours utile
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_etype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/Type/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>

DELETE { GRAPH <http://rdf.geohistoricaldata.org/issimilar>{
	?mapsLandmark add:isRootLandmarkOf ?newPlot.
    ?mapsLandmark2 add:isRootLandmarkOf ?nextPlot.
    ?newPlot add:hasRootLandmark ?mapsLandmark.
    ?nextPlot add:isRootLandmarkOf ?mapsLandmark2.
    }}
INSERT {GRAPH <http://rdf.geohistoricaldata.org/parenting> 
#CONSTRUCT
{
    ?mapsLandmark cad:hasNext ?newPlot.
    ?newPlot cad:hasPrevious ?mapsLandmark.}
}
WHERE { 
     ?newPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
     ?newPlot add:hasAttribute ?attrM2.
     ?attrM2 add:isAttributeType cad_atype:PlotMention.
     
     ?nextPlot a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
     ?nextPlot add:hasAttribute ?attrM3.
     ?attrM3 add:isAttributeType cad_atype:PlotMention.
     
    ?newPlot add:isSimilarTo ?nextPlot
    FILTER(!sameTerm(?newPlot,?nextPlot))
	
    GRAPH <http://rdf.geohistoricaldata.org/plots/frommaps> {
        ?mapsLandmark a add:Landmark.
    }
    GRAPH <http://rdf.geohistoricaldata.org/plots/frommaps> {
        ?mapsLandmark2 a add:Landmark.
    }
    ?mapsLandmark add:isRootLandmarkOf ?newPlot.
    ?mapsLandmark2 add:isRootLandmarkOf ?nextPlot
}
```
### 5.3 Lien entre la première mention d'une parcelle dans la première matrice et l'objet du plan
Pas sur que ça serve...
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX source: <http://rdf.geohistoricaldata.org/id/source/>
PREFIX dcterms: <http://purl.org/dc/terms/>

#construct {
INSERT { GRAPH <http://rdf.grohistoricaldata.org/parenting>{
    ?mapsLandmark cad:hasNext ?registersLandmark.
    ?registersLandmark cad:hasPrevious ?mapsLandmark.
}
}
#select *
where { 
    GRAPH <http://rdf.geohistoricaldata.org/plots/frommaps>{
		?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot .
        
    }
    
    GRAPH <http://rdf.geohistoricaldata.org/plots/fromregisters>{
        ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        ?registersLandmark add:hasAttribute ?attrM.
        ?registersLandmark add:hasTime/add:hasBeginning/add:timeStamp ?debut.
        ?attrM add:isAttributeType cad_atype:PlotMention.
        ?attrM add:hasAttributeVersion/cad:takenFrom cad_spval:CelluleVideSV.
        ?attrM add:hasAttributeVersion/cad:isMentionnedIn ?classement.}
        ?classement rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn ?matrice.
       FILTER(?matrice = source:94_Gentilly_MAT_NB_1848 || ?matrice = source:94_Gentilly_MAT_B_NB_1813)

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