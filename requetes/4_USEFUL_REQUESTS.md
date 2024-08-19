# Useful WIP requests

## Enumerate JS functions in the triplestore
```sparql
PREFIX jsfn:<http://www.ontotext.com/js#>
SELECT ?s ?o {
    ?s jsfn:enum ?o
}
```
##

```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX ofn: <http://www.ontotext.com/sparql/functions/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>

select ?relatedLandmark ?folio ?entree ?sortie ?disChange ?event ?j1 ?entree2 ?sortie2 ?nextLandmark
where { 
    ?relatedLandmark add:hasRootLandmark ?rootLandmark.
    ?nextLandmark add:hasRootLandmark ?rootLandmark.
    ?relatedLandmark (add:hasNext|add:hasOverlappingVersion) ?nextLandmark.
    
	?relatedLandmark a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?relatedLandmark add:hasTime/add:hasBeginning/add:timeStamp ?entree.
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?sortie.
    ?relatedLandmark add:hasAttribute ?attrMention.
    ?attrMention add:isAttributeType cad_atype:PlotMention.
    ?attrMention add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio.
    ?folio cad:isSourceType srctype:FolioNonBati.
    OPTIONAL{?relatedLandmark add:changedBy ?disChange.
    ?disChange add:isChangeType ctype:LandmarkDisappearance.
    ?disChange add:dependsOn ?event.}
        
    ?nextLandmark a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?nextLandmark add:hasTime/add:hasBeginning/add:timeStamp ?entree2.
    ?nextLandmark add:hasTime/add:hasEnd/add:timeStamp ?sortie2.
    ?nextLandmark add:hasAttribute ?attrMention2.
    ?attrMention2 add:isAttributeType cad_atype:PlotMention.
    
    ?attrMention add:hasAttributeVersion/cad:passedTo ?j1.
    ?attrMention2 add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?j1.
    ?j1 cad:isSourceType srctype:FolioNonBati.
    #Filter Construction/Augmentation versions
    ?attrMention2 add:hasAttributeVersion/cad:takenFrom ?tirede2.
    {?tirede2 cad:isSourceType srctype:FolioNonBati}UNION{FILTER(?tirede2 IN(cad_spval:CelluleVideSV,cad_spval:ResteSV))}

    FILTER(!sameTerm(?relatedLandmark, ?nextLandmark))
    FILTER(YEAR(?sortie) = YEAR(?entree2))
	} 
    ORDER BY ?rootLandmark ?entree ?sortie ?j1
```

## 2. Get next possible version using time and document order
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>

select * where { 
	?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?plot dcterms:identifier ?plotid.
    ?plot add:hasTime/add:hasBeginning/add:timeStamp ?start.
    ?plot add:hasTime/add:hasEnd/add:timeStamp ?end.
    OPTIONAL{?plot (add:hasNextVersionInSRCOrder|add:hasOverlappingVersionInSRCOrder) ?next}
    FILTER(?plotid = "D-14")
}
``` 

## 3. Check links between rows in the same cf
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>
PREFIX landmark: <http://rdf.geohistoricaldata.org/id/landmark/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>

select distinct ?plot1 ?folio ?start1 ?end1 ?relatedLandmark ?folioR ?startR ?endR
where { 
    ?plot1 add:hasOverlappingVersionInSRCOrder ?relatedLandmark.
    
	?plot1 a add:Landmark; add:isLandmarkType cad_ltype:Plot .
    ?plot1 dcterms:identifier ?plotid.
    ?plot1 add:hasTime/add:hasBeginning/add:timeStamp ?start1.
    ?plot1 add:hasTime/add:hasEnd/add:timeStamp ?end1.
    ?plot1 add:hasAttribute [add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folio]. 
	?folio cad:isSourceType srctype:FolioNonBati.
    
    ?relatedLandmark add:hasTime/add:hasBeginning/add:timeStamp ?startR.
    ?relatedLandmark add:hasTime/add:hasEnd/add:timeStamp ?endR.
    ?relatedLandmark add:hasAttribute [add:hasAttributeVersion/cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?folioR]. 
	?folioR cad:isSourceType srctype:FolioNonBati.
    
    FILTER NOT EXISTS{?plot1 add:hasPreviousVersionInSRCOrder ?other}
    #FILTER(?plotid = "D-19" || ?plotid = "D-19p")
}
ORDER BY ?plot1 ?startR ?start1
```

## Matching entre parcellles d'une matrice à une autre 
```sparql
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>
PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#>
PREFIX cad_spval: <http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX source: <http://rdf.geohistoricaldata.org/id/source/>
PREFIX srctype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/>

SELECT ?plot ?end ?taxpayer ?label (GROUP_CONCAT(?nature) AS ?natures) ?plot2 ?start2 ?taxpayer2 ?label2 (GROUP_CONCAT(?nature2) AS ?natures2)
WHERE { 
	?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot.
    ?plot dcterms:identifier ?plotid.
    ?plot add:hasAttribute/add:hasAttributeVersion/cad:hasPlotNature ?nature.
    ?plot add:hasTime/add:hasEnd/add:timeStamp ?end.
    ?plot add:hasAttribute/add:hasAttributeVersion ?attr.
    ?attr cad:passedTo cad_spval:CelluleVideSV.
    ?attr cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn ?matrice.
    ?attr cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?cf.
    ?cf cad:isSourceType srctype:CompteFoncier.
    ?cf rico:hasOrHadConstituent/add:hasAttribute/add:hasAttributeVersion/cad:hasTaxpayer ?taxpayer.
    ?taxpayer cad:isTaxpayerOf/add:isOutdatedBy [add:isChangeType ctype:AttributeVersionDisappearance].
    ?taxpayer cad:taxpayerLabel ?label.
    FILTER(sameTerm(?matrice,source:94_Gentilly_MAT_B_NB_1813))
    
    ?plot2 a add:Landmark; add:isLandmarkType cad_ltype:Plot.
    ?plot2 dcterms:identifier ?plotid2.
    ?plot2 add:hasAttribute/add:hasAttributeVersion/cad:hasPlotNature ?nature2.
    ?plot2 add:hasTime/add:hasBeginning/add:timeStamp ?start2.
    ?plot2 add:hasAttribute/add:hasAttributeVersion ?attr2.
    ?attr2 cad:takenFrom cad_spval:CelluleVideSV.
    ?attr2 cad:isMentionnedIn/rico:isOrWasConstituentOf+/rico:isOrWasIncludedIn ?matrice2.
    ?attr2 cad:isMentionnedIn/rico:isOrWasConstituentOf+ ?cf2.
    ?cf2 cad:isSourceType srctype:CompteFoncier.
    ?cf2 rico:hasOrHadConstituent/add:hasAttribute/add:hasAttributeVersion/cad:hasTaxpayer ?taxpayer2.
    ?taxpayer2 cad:isTaxpayerOf/add:isMadeEffectiveBy [add:isChangeType ctype:AttributeVersionAppearance].
    ?taxpayer2 cad:taxpayerLabel ?label2.
    FILTER(sameTerm(?matrice2,source:94_Gentilly_MAT_NB_1836))
    
    ?taxpayer add:isSimilarTo ?taxpayer2.
    ?plot add:hasNextVersion ?plot2.
}
GROUP BY ?plot ?end ?label ?taxpayer ?plot2 ?start2 ?taxpayer2 ?label2
ORDER BY ?plot
```