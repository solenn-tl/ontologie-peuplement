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