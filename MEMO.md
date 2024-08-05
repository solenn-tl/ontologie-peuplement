# Mémo outils
## Installations
### Ollama
* Installation
```
curl -fsSL https://ollama.com/install.sh | sh
```
* Paramétrer les variables HTTP_PROXY et HTTPS_PROXY
* Lancer ollama
```
ollama serve
```
* Télécharger un modèle
```
ollama pull MODEL
```
* Liste des modèles téléchargés
```
ollama list
```

## Données
* Gestion des divisions de parcelles qui interveinnent avant l'ouverture de la matrice
* Divisions non détctable avec les "Porté à"
* Fusions de parcelles avec le même ID dans un même compte foncier 


##  Discussion avec Charly
### Créer les aggrégations
```sparql
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX addr: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX factoids: <http://rdf.geohistoricaldata.org/id/address/factoids/>
INSERT {GRAPH ?g {?rootLandmark a addr:Landmark . 
    ?rootLandmark addr:isRootLandmarkOf ?landmark .}} 
WHERE {    
    BIND (<http://localhost:7200/repositories/factoids_ville_de_paris/rdf-graphs/tmp_named_graph> AS ?g)    
    {        
    SELECT DISTINCT ?siblingLabel WHERE {            
        ?landmark addr:hiddenLabelSibling ?siblingLabel .        }    }    
    BIND(URI(CONCAT(STR(URI(factoids:)), "RL_", STRUUID())) AS ?rootLandmark)    
    ?landmark addr:hiddenLabelSibling ?siblingLabel .}
```

### Créer les attributs pour un root landmark
```sparql
PREFIX addr: <http://rdf.geohistoricaldata.org/def/address#>
PREFIX factoids: <http://rdf.geohistoricaldata.org/id/address/factoids/>
CONSTRUCT {    
    ?rootLandmark addr:hasAttribute ?rootAttribute .    
    ?rootAttribute a addr:Attribute ; addr:isAttributeType ?attrType .
} WHERE {{ 
    SELECT DISTINCT ?rootLandmark ?attrType 
    WHERE { ?rootLandmark addr:isRootLandmarkOf ?landmark .
            ?landmark addr:hasAttribute ?attr .
            ?attr addr:isAttributeType ?attrType .}}    
    BIND(URI(CONCAT(STR(URI(factoids:)), "ATTR_", STRUUID())) AS ?rootAttribute)
}
```

### Créer les versions d'attributs
```sparql
PREFIX addr: <http://rdf.geohistoricaldata.org/def/address#>
CONSTRUCT {    ?rootAttr addr:hasAttributeVersion ?attrVers .} 
WHERE {    {        
    SELECT DISTINCT ?rootLandmark ?rootAttr ?rootAttrType 
    WHERE {            
        ?rootLandmark addr:hasAttribute ?rootAttr  .            
        ?attr addr:isAttributeType ?rootAttrType .        
    }}    
        ?rootLandmark addr:isRootLandmarkOf ?landmark .    
        ?landmark addr:hasAttribute ?attr .    
        ?attr addr:isAttributeType ?rootAttrType ; addr:hasAttributeVersion ?attrVers.
}
```

```sparql
CONSTRUCT {    
    ?rootAttr addr:hasAttributeVersion ?rootAttrVers .    
    ?rootAttrVers addr:isRootOf ?attrVers .} 
WHERE {    {        
    SELECT DISTINCT ?rootLandmark ?rootAttr ?rootAttrType 
    WHERE {            
        ?rootLandmark addr:hasAttribute ?rootAttr  .            
        ?attr addr:isAttributeType ?rootAttrType .        
        }    }    
        ?rootLandmark addr:isRootLandmarkOf ?landmark .    
        ?landmark addr:hasAttribute ?attr .    
        ?attr addr:isAttributeType ?rootAttrType ; addr:hasAttributeVersion ?attrVers.    
        BIND(URI(CONCAT(STR(URI(factoids:)), "RAV_", STRUUID())) AS ?rootAttrVers)}
```