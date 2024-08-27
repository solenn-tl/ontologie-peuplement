/**************************************
 ***************** Map ****************
*************************************/

var map = L.map('map',{
    //Full screen settings
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    },
    layers:[wmsJacoubet],
    preferCanvas: true,
    maxZoom:22
}).setView([48.829867,2.353295],18);

L.control.scale().addTo(map);

/**************************************
 *********** Layer control ************
 *************************************/

 var baseLayers = {
    "Jacoubet (1836)":wmsJacoubet,
    "Andriveau (1849)":wmsAndriveau,
    "Atlas municipal (1888)":wmsbhdv,
    "Plan IGN (2022)":GeoportailFrance_plan,
}

var overLayers = {
    "Cadastre (1810)":cad1810secB,
    "Cadastre (1845)":cad1845C2D
}

var layerControl = L.control.layers(baseLayers, overLayers,{
        collapsed:true,
    }).addTo(map);