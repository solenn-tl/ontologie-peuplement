# Javascript functions to add in triplestore

## Remove accents
```sparql
PREFIX extfn:<http://www.ontotext.com/js#>

INSERT DATA {
    [] <http://www.ontotext.com/js#register> '''

        function replaceAccent(str) {
            var accentMap = {
                'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
                'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
                'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
                'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
                'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
                'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O', 'Ü': 'U',
                'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
                'Â': 'A', 'Ê': 'E', 'Î': 'I', 'Ô': 'O', 'Û': 'U',
                'ã': 'a', 'õ': 'o', 'ñ': 'n',
                'Ã': 'A', 'Õ': 'O', 'Ñ': 'N',
                'ç': 'c', 'Ç': 'C'
            };

            return str.split('').map(function(char) {
                return accentMap[char] || char;
            }).join('');
        }
    '''
}
```

## Replace common abreviations
```sparql
PREFIX extfn:<http://www.ontotext.com/js#>

INSERT DATA {
    [] <http://www.ontotext.com/js#register> '''

        function replaceSubwords(str) {
            var subwordMap = {
                'p↑re↓': 'pierre', 
                'j↑n↓': 'jean', 
                'b↑te↓': 'baptiste', 
                'bap↑te↓': 'baptiste', 
                'jb↑te↓': 'jean baptiste',
                'f↑ois↓': 'françois', 
                'j↑d↓': 'jean', 
                'v↑e↓': 'veuve', 
                'v↑ve↓': 'veuve', 
                'h↑re↓': 'heritier',
            };

            var pattern = new RegExp(Object.keys(subwordMap).join("|"), "g");

            return str.replace(pattern, function(matched){
                return subwordMap[matched];
            });
        }
    '''
}
```