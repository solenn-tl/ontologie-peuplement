# I. Liage des landmarks qui font référence au même objet

## Remarque
Il faut traiter chaque matrice d'un cadastre individuellement. Les matrices d'un même cadastre doivent être traitées dans l'ordre chronologique

## Même landmark qu'un landmark initial
1. Dans la matrice qui suit immédiatement la création du cadastre:
    - Même *Numéro de parcelle* ET 
    - *Tiré de* est vide ET 
    - *Date d'entrée* est égal à la date d'ouverture de la matrice (crips ou au plus tôt)

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

INSERT {
        GRAPH <http://data.ign.fr/plots/cad1> {
            ?registersLandmark add:isSimilarTo ?mapsLandmark.
    }}
WHERE {
        GRAPH <http://data.ign.fr/plots/frommaps/> {
            ?mapsLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        }
        GRAPH <http://data.ign.fr/plots/fromregisters/> {
            ?registersLandmark a add:Landmark ; add:isLandmarkType cad_ltype:Plot.
        	?registersLandmark add:hasAttribute ?attr .
            ?attr add:isAttributeType cad_atype:PlotMention .
            ?attr add:hasAttributeVersion ?attrV .
            ?attrV cad:isMentionnedIn ?classement .
            OPTIONAL{?attrV cad:takenFrom ?tirede} .
            OPTIONAL{?attrV cad:passedTo ?portea} .
            OPTIONAL{?attrV add:hasTime/add:hasBeginning/add:timeStamp ?crispbegin}.
            OPTIONAL{?attrV add:hasEarliestTimeInstant/add:timeStamp ?earliest}.
            OPTIONAL{?attrV add:hasTime/add:hasEnd/add:timeStamp ?crispend}.
            OPTIONAL{?attrV add:hasLatestTimeInstant/add:timeStamp ?latest}.
            filter(?tirede = cad_spval:CelluleVideSV)
			#filter(?portea = cad_spval:CelluleVideSV)
    	    #filter(?earliest = "1848-01-01T00:00:00"^^xsd:dateTime || ?crispbegin = "1848-01-01T00:00:00"^^xsd:dateTime)
            filter(?earliest = "1813-01-01T00:00:00"^^xsd:dateTime || ?crispbegin = "1813-01-01T00:00:00"^^xsd:dateTime)
           }
        MINUS {?registersLandmark owl:sameAs ?mapsLandmark}
        ?mapsLandmark dcterms:identifier ?plotid.
        ?registersLandmark dcterms:identifier ?plotid.
}
```
Cette requête créée un lien *owl:sameAs* entre des parcelles (articles de classement) issus des matrices et les parcelles initialisées à partir du plan.

2. Lier les parcelles (articles de classement) qui sont liées à une parcelle du plan et qui ne renvoient pas à une division/fusion.
- Itératif (chaque "génération")
- Dans le graphe des articles de classement :
    - Même identifiant de parcelle (ou proche ???)
    - Dans la même matrice
    - la parcelle a une propriété *owl:sameAs* 
    - *cad:generation* (Datatype property) : itération à laquelle appartient l'article de classement.
    - "Porté à" (n) = "Tiré de" (n+1) ET regarder le type de valeurs dans "Porté à" et "Tiré de"


PREFIX cad_atype: <http://data.ign.fr/id/codes/cadastre/attributeType/>
PREFIX rico: <https://www.ica.org/standards/RiC/ontology#>
PREFIX srctype: <http://data.ign.fr/id/codes/cadastre/sourceType/>
PREFIX source: <http://data.ign.fr/id/source/>
PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX cad_ltype: <http://data.ign.fr/id/codes/cadastre/landmarkType/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX cad: <http://data.ign.fr/def/cadastre#>
PREFIX mlclasse: <http://data.ign.fr/id/codes/cadastre/mlClasse/>
PREFIX cad_spval: <http://data.ign.fr/id/codes/cadastrenap/specialCellValue/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

select ?plot ?id ?nature ?line_order_in_cf ?textstyle ?folio ?numfolio ?cf ?num_cf_in_folio ?tirede ?portea ?crispbegin ?earliest ?crispend ?latest (count(?plotmap) as ?count)
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
    OPTIONAL{?attrV add:hasTime/add:hasBeginning/add:timeStamp ?crispbegin}.
    OPTIONAL{?attrV add:hasEarliestTimeInstant/add:timeStamp ?earliest}.
    OPTIONAL{?attrV add:hasTime/add:hasEnd/add:timeStamp ?crispend}.
    OPTIONAL{?attrV add:hasLatestTimeInstant/add:timeStamp ?latest}.
    #Source
    ?classement cad:isSourceType srctype:ArticleDeClassement .
    ?classement dcterms:identifier ?line_order_in_cf .
    ?iclassement rico:isOrWasDigitalInstantiationOf ?classement.
    ## Style
    OPTIONAL{?iclassement cad:hasClasse/cad:hasClasseValue ?textstyle}
    #Documents
    ?cf rico:hasOrHadConstituent ?classement .
    ?cf cad:isSourceType srctype:CompteFoncier .
    ?cf rico:isOrWasConstituentOf ?folio .
    ?cf dcterms:identifier ?num_cf_in_folio .
    ?folio cad:isSourceType srctype:FolioNonBati .
    ?folio rico:isOrWasConstituentOf ?page .
    ?folio cad:hasNumFolio ?numfolio .
    ?page rico:isOrWasIncludedIn source:94_Gentilly_MAT_NB_1848 .
    #Nature
    ?plot add:hasAttribute ?attrNat .
    ?attrNat add:isAttributeType cad_atype:PlotNature .
    ?attrNat add:hasAttributeVersion ?attrNatV .
    ?attrNatV cad:hasPlotNature ?nature .
    #Filtre
    ?plot owl:sameAs ?plotmap
}
group by ?plot ?id ?nature ?line_order_in_cf ?textstyle ?folio ?numfolio ?cf ?num_cf_in_folio ?tirede ?portea ?crispbegin ?earliest ?crispend ?latest
order by ?id ?line_order_in_cf