// GET DATA FOR GEOJSON
var query1_geojson = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> "+
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/> "+
"PREFIX dcterms: <http://purl.org/dc/terms/> "+
"PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/> "+
"SELECT ?rootPlot ?id ?geom_wkt ?cadastreVersionId "+
"WHERE { GRAPH <http://rdf.geohistoricaldata.org/rootlandmarks> {"+
"?rootPlot a add:Landmark; "+
"add:isLandmarkType cad_ltype:Plot; "+
"dcterms:identifier ?id; "+
"add:hasAttribute[add:hasAttributeVersion [add:versionValue ?geom_wkt]]. "+
"BIND(IF(STRSTARTS(?id, 'B'),'1810','1848') AS ?cadastreVersionId)"//where staement is not closed

//for a clicked geometry, return the attributes
var query2_data = 
"PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> " +
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/> " +
"PREFIX cad_atype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/attributeType/> " +
"PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#> " +
"PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/> " +
"PREFIX dcterms: <http://purl.org/dc/terms/> " +
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
"PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
"SELECT ?root ?geom ?plot (GROUP_CONCAT(distinct ?id) AS ?ids) (GROUP_CONCAT(distinct ?natureValue; separator=', ') AS ?groupNatureValue) ?t1 ?t2 (count(distinct ?children) AS ?rows) WHERE { " +
"GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations> { " +
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot. " +
"?plot dcterms:identifier ?id. " +
"?plot add:hasRootLandmark ?root. " +
"} " +
"?plot add:hasTrace ?children. " +
"?plot add:hasAttribute ?nature. " +
"?nature add:isAttributeType cad_atype:PlotNature. " +
"?nature add:hasAttributeVersion ?natureV. " +
"?natureV cad:hasPlotNature/skos:prefLabel ?natureValue. " +
"?natureV add:changedBy ?change1. " +
"?change1 add:isChangeType ctype:AttributeVersionAppearance. " +
"?change1 add:dependsOn ?event1. " +
"?event1 add:hasTime/add:timeStamp ?t1. " +
"?natureV add:changedBy ?change2. " +
"?change2 add:isChangeType ctype:AttributeVersionDisappearance. " +
"?change2 add:dependsOn ?event2. " +
"?event2 add:hasTime/add:timeStamp ?t2. "


var query3_1_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>" +
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>" +
"select (count(distinct ?plot) AS ?numplot) where { " +
"GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations>{" +
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot." +
"}}"

var query3_2_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>" +
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>" +
"select (count(distinct ?plot) AS ?numplot) where { " +
"GRAPH <http://rdf.geohistoricaldata.org/rootlandmarks>{" +
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot." +
"}}"

var query3_3_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#>" +
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/>" +
"select (count(distinct ?plot) AS ?numplot) where { " +
"GRAPH <http://rdf.geohistoricaldata.org/landmarksversions>{" +
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot." +
"}}"

var query3_4_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> " +
"PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/> " +
"select (count(?change) AS ?numChangeApp) where { "+
    "GRAPH <http://rdf.geohistoricaldata.org/changes_events>{"+
        "?change a add:Change; add:isChangeType ctype:LandmarkAppearance.}}"

var query3_5_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> " +
"PREFIX ctype: <http://rdf.geohistoricaldata.org/id/codes/address/changeType/> " +
"select (count(?change) AS ?numChangeDis) where { "+
    "GRAPH <http://rdf.geohistoricaldata.org/changes_events>{"+
        "?change a add:Change; add:isChangeType ctype:LandmarkDisappearance.}}"

var query3_6_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> " + 
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/> " + 
"PREFIX dcterms: <http://purl.org/dc/terms/> " + 
"SELECT distinct ?plotid (count(?plot) AS ?numplot) WHERE {  " + 
"GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations>{ " + 
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot. " + 
"?plot dcterms:identifier ?id. " + 
"BIND(IF(STRENDS(STR(?id), 'p'), SUBSTR(STR(?id), 1, STRLEN(STR(?id)) - 1), ?id) AS ?plotid)}} " + 
"GROUP BY ?plotid " + 
"ORDER By ?numplot ?plotid"

var query3_7_stats = "PREFIX add: <http://rdf.geohistoricaldata.org/def/address#> " +
"PREFIX cad_ltype: <http://rdf.geohistoricaldata.org/id/codes/cadastre/landmarkType/> " +
"PREFIX dcterms: <http://purl.org/dc/terms/> " +
"PREFIX cad: <http://rdf.geohistoricaldata.org/def/cadastre#> " +
"SELECT ?plotid ?numplot " +
"WHERE {SELECT distinct ?plot ?plotid (count(distinct ?child) AS ?numplot) WHERE {  " +
"GRAPH <http://rdf.geohistoricaldata.org/landmarksaggregations>{ " +
"?plot a add:Landmark; add:isLandmarkType cad_ltype:Plot. " +
"?plot dcterms:identifier ?id. " +
"?plot add:isParentOf ?child. " +
"BIND(IF(STRENDS(STR(?id), 'p'), SUBSTR(STR(?id), 1, STRLEN(STR(?id)) - 1), ?id) AS ?plotid)}} " +
"GROUP BY ?plot ?plotid " +
"ORDER BY ?numplot}"

/*************************************************
 ******************* FUNCTIONS *******************
 *************************************************/
//Init load data on load page
function onPageLoad(){
    requestGeoJSONData();
    requestCount(query3_2_stats,'numplot','stats','countRoot','Nombre de <i>Landmarks</i> sur les plans (1810 et 1845)');
    requestCount(query3_3_stats,'numplot','stats','countVersion','Nombre de versions de <i>Landmarks</i> issues des matrices');
    requestCount(query3_1_stats,'numplot','stats','countAgg','Nombre d\'aggrégations de <i>Landmarks</i>');
    requestCount(query3_4_stats,'numChangeApp','stats','countChangeApp','Nombre d\'apparitions de <i>Landmarks</i>');
    requestCount(query3_5_stats,'numChangeDis','stats','countChangeDis','Nombre de disparitions de <i>Landmarks</i>');
    requestDataForHistogram(query3_6_stats,'stats','histogram','Nombre d\'aggrégation par numéros de parcelles','Numéros de parcelles','Effectif')
}

 var extract = '';

 function createGeoJson(JSobject){
    /**
     * Fonction qui créée un GEOJSON dans la mémoire du navigateur à partir du JSON retourné par le triplestore
     * Input : SPARQL request result in application/json format
     * Output : Geojson
     * Source : https://github.com/dhlab-epfl/leaflet-sparql/blob/master/index.html
     */
  
    //Initialise la structure du geojson
    var geojson = {"type": "FeatureCollection", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } }, "features": []}
    //Pour chaque feature du json retourné par la requête SPARQL :
    $.each(JSobject.results.bindings, function(i,bindings){
       var polygon = bindings.geom_wkt.value.replace('<http://www.opengis.net/def/crs/OGC/1.3/CRS84>','')
      //Init feature
      feature = {
        type:"Feature",
        geometry: $.geo.WKT.parse(polygon),
        properties: {}
      };
      //Créée les propriétés
      $.each(JSobject.head.vars, function(j, property){
        feature.properties[property] = bindings[property].value;
      });
      //Ajoute la feature au GEOJSON
      geojson.features.push(feature);
    });
    console.log(geojson)
    // Si le geojson est vide, afficher une boite de dialogue avec un message
    if (geojson['features'].length == 0) {
      alert('Pas de données correspondant à cette recherche.')
      message.innerHTML = '';
      //resdiv.innerHTML = '';
      //loadperioddiv.innerHTML = '<p style="text-align: center; height: fit-content;"><small>❓ Le filtre temporel permet de faire varier l\'affichage des points préalablement chargés sur la carte sans lancer une nouvelle recherche.</small></p>'
    } else {
      //Sinon retourner le geojson
      return geojson
    }
  };

// Function to get the ID of the clicked feature
function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.id) {
        layer.bindTooltip(feature.properties.id, {
            permanent: false, 
            direction: 'center', // Position the tooltip at the center of the polygon
            className: 'leaflet-tooltip' // Custom class for styling
        });
    }
    layer.on({
        click: function() {
            var featureId = feature.properties.id;
            console.log('Feature ID:', featureId);
            requestFeatureData(featureId)
        }
    });
}


// Function to be executed when radio button is changed
function handleRadioChange() {
        const selectedValue = document.querySelector('input[name="cadastre"]:checked').value;
        console.log('Selected Cadastre:', selectedValue);
        map.removeLayer(extract);
        requestGeoJSONData();
        // You can add any additional logic here
}

// Get all radio buttons
const radioButtons = document.querySelectorAll('input[name="cadastre"]');

// Attach the change event listener to each radio button
radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});


function requestGeoJSONData() {

    //Check which cadastre version is selected to choose the geometries to display
    const radios = document.getElementsByName('cadastre');
    let selectedValue = '';
    for (const radio of radios) {
        if (radio.checked) {
        selectedValue = radio.value;
        break;
        }
    }
    query1 = query1_geojson + "FILTER (?cadastreVersionId = '" + selectedValue + "')}}"
    
    finalquery1 = endpointURL + '?query=' + encodeURIComponent(query1) + "&?application/json";
    //console.log(finalquery1)
  
    //AJAX REQUEST
    $.ajax({
        url: finalquery1,
        Accept: "application/sparql-results+json",
        contentType:"application/sparql-results+json",
        crossdomain:true,
        dataType:"json",
        data:''
    }).done((promise) => {

        // Création d'un geojson à partir du json retourné par le triplestore
        jsonData = createGeoJson(promise)
        extract = L.geoJSON(jsonData,{
            onEachFeature: onEachFeature,
            style: function(feature){
                return {
                    color: 'black',
                    weight: 1,
                    fillColor: 'blue',
                    fillOpacity: 0.5
                }
            },
        });
        // Ajouter la couche des clusters mises à jour à la carte
        extract.addTo(map);
    })
    };


function replaceString(str, targetString, replacement = "") {
    return str.replace(targetString, replacement);
}

function keepFirstFourChars(str) {
    return str.substring(0, 4);
}
    
function groupAndDisplayData(jsonData) {
            // Check if bindings array exists and is an array
            if (!jsonData) {
                console.error("Invalid or missing data.");
                return;
            }
    
            // Step 1: Sort the data by t1, then t2, then plot
            jsonData.sort((a, b) => {
                // Compare t1 dates
                const t1Comparison = new Date(a.t1.value) - new Date(b.t1.value);
                if (t1Comparison !== 0) {
                    return t1Comparison; // Sort by t1
                }
                // If t1 dates are equal, compare t2 dates
                const t2Comparison = new Date(a.t2.value) - new Date(b.t2.value);
                if (t2Comparison !== 0) {
                    return t2Comparison; // Sort by t2
                }
                // If t1 and t2 dates are equal, compare plot IDs
                return a.plot.value.localeCompare(b.plot.value); // Sort by plot ID
            });

    // Step 2: Generate HTML table content
    let tableHTML = "<table border='1'><tr><th>ID de l'aggrégation (nb de lignes de matrices)</th><th>Num.</th><th>Nature</th><th>Début</th><th>Fin</th></tr>";

    jsonData.forEach(row => {
            tableHTML += "<tr>";
            tableHTML += `<td><small><b>${replaceString(row.plot.value,"http://rdf.geohistoricaldata.org/id/landmark/")}</b> (${row.rows.value})</small></td>`;
            tableHTML += `<td>${row.ids.value}</td>`;
            tableHTML += `<td>${replaceString(row.groupNatureValue.value,"http://rdf.geohistoricaldata.org/id/codes/cadastre/plotNature/")}</td>`;
            tableHTML += `<td>${keepFirstFourChars(row.t1.value)}</td>`;
            tableHTML += `<td>${keepFirstFourChars(row.t2.value)}</td>`;
            tableHTML += "</tr>";
        });

    tableHTML += "</table>";

    // Step 3: Insert the table into the HTML
    document.getElementById("legend").innerHTML = tableHTML;
}
    

function requestFeatureData(id){
    var year = document.getElementById('input-number').value

    var additional_part = "BIND(YEAR('" + year + "-01-01'^^xsd:dateTimeStamp) AS ?year) " +
    "FILTER(regex(?id, '" + id +"p') || regex(?id, '" + id +"$')) " +
    "FILTER(lang(?natureValue) = 'fr') " + 
    "FILTER(YEAR(?t1) <= ?year && YEAR(?t2) >= ?year )" +
    "} " +
    "GROUP BY ?plot ?t1 ?t2 ?root ?geom " +
    "ORDER BY ?ids ?plot";

    query2 = query2_data + additional_part
    console.log(query2)
    finalquery2 = endpointURL + '?query=' + encodeURIComponent(query2) + "&?application/json";
    //console.log(finalquery2)

    //AJAX REQUEST
    $.ajax({
        url: finalquery2,
        Accept: "application/sparql-results+json",
        contentType:"application/sparql-results+json",
        crossdomain:true,
        dataType:"json",
        data:''
    }).done((promise) => {
        console.log(promise)
        groupAndDisplayData(promise.results.bindings);
    })
}


async function requestCount(request,countname,divid,newdivid,newdivtext){

    var parentDiv = document.getElementById(divid);
    var newDiv = document.createElement('div');
    finalquery = endpointURL + '?query=' + encodeURIComponent(request) + "&?application/json";

    //AJAX REQUEST
    $.ajax({
        url: finalquery,
        Accept: "application/sparql-results+json",
        contentType:"application/sparql-results+json",
        crossdomain:true,
        dataType:"json",
        data:''
    }).done((promise) => {
        
        var count = promise.results.bindings[0][countname].value;
        // Optionally, add some content or set attributes to the new div
        newDiv.innerHTML = '<p>' + newdivtext + ' : ' + count + '</p>';
        newDiv.id = newdivid; // Setting an ID
        // Append the new div to the parent div
        parentDiv.appendChild(newDiv);
    })
}

function requestDataForHistogram(request,divid,newdivid,title,xaxis,yaxis){
    finalquery = endpointURL + '?query=' + encodeURIComponent(request) + "&?application/json";

    //AJAX REQUEST
    $.ajax({
        url: finalquery,
        Accept: "application/sparql-results+json",
        contentType:"application/sparql-results+json",
        crossdomain:true,
        dataType:"json",
        data:''
    }).done((promise) => {
        var parentDiv = document.getElementById(divid);
        var newDiv = document.createElement(newdivid);
        parentDiv.appendChild(newDiv);
        newDiv.id = newdivid; // Setting an ID
    
       // Extract plotid and numplot values
       var plotIds = promise.results.bindings.map(item => item.plotid.value);
       var numPlots = promise.results.bindings.map(item => parseInt(item.numplot.value));
   
       // Define the data for Plotly
       const trace = {
           x: plotIds, // X-axis: plotid
           y: numPlots, // Y-axis: numplot
           type: 'bar'  // Type of chart: bar (for histogram)
       };
   
       const layout = {
           title: title,
           xaxis: { title: xaxis },
           yaxis: { title: yaxis },
           margin: { t: 50, l: 50, r: 50, b: 100 }, // Optional: adjust margins
           autosize: true
       };
       const config = { responsive: true };
   
       // Render the plot
       Plotly.newPlot(newdivid, [trace], layout, config);
    })
}