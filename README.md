# README

Création et peuplement de l'ontologie Pégazus, partie dédiée au cadastre

Données : [Google Sheet](https://docs.google.com/spreadsheets/d/1I5Iy_sSkPHP_hcMSNP5uNXh6lLaVKuJtE3nlpzjQRqs/edit#gid=1716512529)

## URI

## Graphes nommés
* Ontologie
```sparql
http://data.ign.fr/def/cadastre#
``` 
* Objets
```sparql
# Landmark
http://data.ign.fr/id/landmark/
# Source
http://data.ign.fr/id/source/
# Contribuable (Taxpayer)
http://data.ign.fr/id/taxpayer/
# Evenement (Event)
http://data.ign.fr/id/event/
```
* Codes 
```sparql
# Attributs specifiques au cadastre
http://data.ign.fr/id/codes/cadastre/attributeType/
# Landmarks spécifiques au cadastre
http://data.ign.fr/id/codes/cadastre/landmarkType/
# Types d'évènements
http://data.ign.fr/id/codes/cadastre/eventType/
# Valeurs spéciales mentionnées dans les documents
http://data.ign.fr/id/codes/cadastrenap/specialCellValue/
# Natures de parcelles
http://data.ign.fr/id/codes/cadastre/plotNature/
# Processus
http://data.ign.fr/id/codes/cadastre/activity/
# Types de sources
http://data.ign.fr/id/codes/cadastre/sourceType/
# Classes de machine learning
http://data.ign.fr/id/codes/cadastre/mlClasse/
```
## Ollama
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