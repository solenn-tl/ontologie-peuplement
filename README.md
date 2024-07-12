# README

Création et peuplement de l'ontologie Pégazus, partie dédiée au cadastre

Données : [Google Sheet](https://docs.google.com/spreadsheets/d/1I5Iy_sSkPHP_hcMSNP5uNXh6lLaVKuJtE3nlpzjQRqs/edit#gid=1716512529)

## URIs
* Ontologie
```sparql
http://rdf.geohistoricaldata.org/def/cadastre#
``` 
* Objets
```sparql
# Landmark
http://rdf.geohistoricaldata.org/id/landmark/
# Source
http://rdf.geohistoricaldata.org/id/source/
# Contribuable (Taxpayer)
http://rdf.geohistoricaldata.org/id/taxpayer/
# Evenement (Event)
http://rdf.geohistoricaldata.org/id/event/
# Change
http://rdf.geohistoricaldata.org/id/change/
```
* Codes 
```sparql
# Attributs specifiques au cadastre
http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/
# Landmarks spécifiques au cadastre
http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/
# Types d'évènements
http://rdf.geohistoricaldata.org/id/codes/cadastre/eventType/
# Valeurs spéciales mentionnées dans les documents
http://rdf.geohistoricaldata.org/id/codes/cadastre/specialCellValue/
# Natures de parcelles
http://rdf.geohistoricaldata.org/id/codes/cadastre/plotNature/
# Processus
http://rdf.geohistoricaldata.org/id/codes/cadastre/activity/
# Types de sources
http://rdf.geohistoricaldata.org/id/codes/cadastre/sourceType/
# Classes de machine learning
http://rdf.geohistoricaldata.org/id/codes/cadastre/mlClasse/
```
## Graphes nommés
### Créés au départ
* Ontologie (+ activités)
```sparql
http://rdf.geohistoricaldata.org/ontology
``` 
* Parcelles (états initiaux créés à partir des plans)
```sparql
http://rdf.geohistoricaldata.org/plots/frommaps
``` 
* Parcelles (états issus des articles de classement) et propriétaires
```sparql
http://rdf.geohistoricaldata.org/plots/fromregisters
``` 
* Autres landmarks (communes, sections, lieux-dits, etc.)
```sparql
http://rdf.geohistoricaldata.org/otherslandmarks
``` 
* Sources (registres et images)
```sparql
http://rdf.geohistoricaldata.org/sources
``` 