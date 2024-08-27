/*Tiles*/
var wmsJacoubet = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:jacoubet_1836',
    attribution: 'Atlas général de la Ville, des faubourgs et des monuments de Paris - Jacoubet - 1836 © <a target="_blank" href="https://geohistoricaldata.org/">GeoHistoricalData</a>'
    });

var wmsAndriveau = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:andriveau_1849',
    attribution: 'Plan de Paris contenant l\'enceinte des fortifications - Andriveau-Goujon - 1849 © <a target="_blank" href="https://geohistoricaldata.org/">GeoHistoricalData</a>'
    });

var wmsbhdv = L.tileLayer.wms('https://geohistoricaldata.org/geoserver/ows?SERVICE=WMS&',{
    layers:'paris-rasters:BHdV_PL_ATL20Ardt_1888',
    attribution: 'Atlas municipal - 1888 © <a target="_blank" href="https://geohistoricaldata.org/">GeoHistoricalData</a>'
    });

var GeoportailFrance_plan = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [[-75, -180], [81, 180]],
    minZoom: 2,
    maxZoom: 18,
    apikey: 'choisirgeoportail',
    format: 'image/png',
    style: 'normal'
});

/////////////// Overlays

var cad1810secB_path = "./img/1810_sectionb.png"
var cad1810secB_bounds = [[48.800186062, 2.325580572], [48.833287326, 2.368990879]];
var cad1810secB = L.imageOverlay(cad1810secB_path, cad1810secB_bounds);

var cad1845secD_path = "./img/1848_sectiond.png"
var cad1845secD_bounds = [[48.824459116, 2.35240111], [48.831391821, 2.360783728]];
var cad1845secD = L.imageOverlay(cad1845secD_path, cad1845secD_bounds);

var cad1845secC2_path = "./img/1848_sectionc2.png"
var cad1845secC2_bounds = [[48.822347166, 2.344730747], [48.830738866, 2.35432461]];
var cad1845secC2 = L.imageOverlay(cad1845secC2_path, cad1845secC2_bounds);

var cad1845C2D = L.layerGroup([cad1845secD]);