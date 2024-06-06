# README

Création et peuplement de l'ontologie Pégazus, partie dédiée au cadastre

Données : [Google Sheet](https://docs.google.com/spreadsheets/d/1I5Iy_sSkPHP_hcMSNP5uNXh6lLaVKuJtE3nlpzjQRqs/edit#gid=1716512529)

## Ollama
```
curl -fsSL https://ollama.com/install.sh | sh
```
- Test llama 3

## Prompts Mistral

Using MISTRAL AI RAG or CHAT, i want to structure cells of a table that described one ore many owners of a list of parcels. They have been manually copied from archival records from the 19th century. Text is in French

Owners are desbribed with the following syntaxe :
Example 0 : Fauvelle Antoine
Exemple 1 : ~~Cornillon→vin primeur en caractère~~→1832→Cosson notaire→à Paris
Example 2 : Legendre→B↑re↓ fontainebleau
Example 3 : Faipot→F↑ois↓ M↑d↓ de vin B↑re↓→de Fontainebleau→Delong à Essonne (fontainebleau)→(1836)
Example 4 : ~~Vincent, menuisier→(1829)→Desnet alexandre→rue de Vaugirard n°106→à Paris→(substitué en 1833)→~~(1835)→Deruelle→Pierre adrien m↑d↓ seaussier→rue mandar à Paris
Example 5 : ~~Legendre→propriétaire→Gagnon→Guillaume Gabriel→(Pour 1839)~~→Lacroi Jean→Louis Guillaume→(1846)
Example 6 : ~~Papillon En 1850 Cordier Jean pierre à Villabré~~→Pour 1860 M Guillaumot ferdinand Joseph albert, rue du moulin des prés 50
Example 7 : Gaignaud Marie Annie

There are special tokens in the text : 
~~TEXT~~ : is markdown syntaxe to say that some part of the text is stripped in the original record
→ : means that there is a line break in the original record
↑TEXT↓ : means that the text superscript in the original record

I want to split and structures each cell like this : 
- split each owner mention in the cell (so if there are two owners, having to parts in the cell)
- identify owner changes (change date and which  was the owner before change and after change)
- return the result has a JSON with the following structure trying to keep the owner in there order in the order they have been transcripted

Example 0 : Fauvelle Antoine
```json
{"cell":{"id":1,
"transcription":"~~Cornillon→vin primeur en caractère~~→1832→Cosson notaire→à Paris",
"owners":[{"owner-id":1,
"owner-lastname":"Cornillon",
"owner-activity":"vin primeur en caractère",
"is-stripped":"yes"},
{"owner-id":2,
"owner-lastname":"Cosson",
"owner-activity":"notaire",
"owner-address":"à Paris",
"is-stripped":"no"}
],
"changes":[
{"change-order":1,
"owner-before":1,
"owner-after":2,
"date":1832
}
]
}
}
```

Example 1 : ~~Cornillon→vin primeur en caractère~~→1832→Cosson notaire→à Paris
```json
{"cell":{"id":1,
"transcription":"~~Cornillon→vin primeur en caractère~~→1832→Cosson notaire→à Paris",
"owners":[{"owner-id":1,
"owner-lastname":"Cornillon",
"owner-activity":"vin primeur en caractère",
"is-stripped":"yes"},
{"owner-id":2,
"owner-lastname":"Cosson",
"owner-activity":"notaire",
"owner-address":"à Paris",
"is-stripped":"no"}
],
"changes":[
{"change-order":1,
"owner-before":1,
"owner-after":2,
"date":1832
}
]
}
}
```
Example 2 : Legendre→B↑re↓ fontainebleau
```json
{"cell":{"id":5,
"transcription":"Legendre→B↑re↓ fontainebleau",
"owners":[
{"owner-id":1,
"owner-lastname":"Legendre",
"owner-address":"B↑re↓ fontainebleau"",
"is-stripped":"no"}
]
}
}
```
Example 4 : ~~Vincent, menuisier→(1829)→Desnet alexandre→rue de Vaugirard n°106→à Paris→(substitué en 1833)→~~(1835)→Deruelle→Pierre adrien m↑d↓ seaussier→rue mandar à Paris
```json
{"cell":{"id":1,
"transcription":"~~Vincent, menuisier→(1829)→Desnet alexandre→rue de Vaugirard n°106→à Paris→(substitué en 1833)→~~(1835)→Deruelle→Pierre adrien m↑d↓ seaussier→rue mandar à Paris",
"owners":[{"owner-id":1,
"owner-lastname":"Vincent",
"owner-job":"menuisier",
"is-stripped":"yes"},
{"owner-id":2,
"owner-lastname":"Desnet",
"owner-firstname":"alexandre",
"owner-address":"rue de Vaugirard n°106→à Paris",
"is-stripped":"yes"}
{"owner-id":3,
"owner-lastname":"Deruelle",
"owner-firstname":"Pierre adrien",
"owner-activity":"m↑d↓ seaussier"
"owner-address":"rue mandar à Paris",
"is-stripped":"no"}
],
"changes":[
{"change-order":1,
"owner-before":1,
"owner-after":2,
"date":1829
},
{"change-order":2,
"owner-before":2,
"owner-after":3,
"date":1835
},
]
}
}
```json