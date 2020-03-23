import { loadModules, loadCss } from "esri-loader";
import {AsyncStorage} from 'AsyncStorage';
import Axios from 'axios';

const version = '4.13';
const options = {version};

class ArcGIS {
    constructor() {

    }

view = null
map = null

loadGraphicArray(layer, name) {
    let graphics =[];
    let arc = layer.map(el => ({
        geometry: new this.Point({
            longitude: el.geometry.coordinates[0],
            latitude: el.geometry.coordinates[1]
        }),
        attributes: el.proprieties
    }))
    this.createLayer(arc, name)
}

createLayer(graphics, name) {
    const layer = new this.FeatureLayer({
        title: name,
        source: graphics,
        objectIdField: "OBJECTID",
        fields: [
            { name: "OBJECTID", type: "oid" },
            { name: "nome", type: "string" },
            { name: "ip_helper", type: "string" },
            { name: "setor", type: "string" }
        ],
        populateTemplate: {
            title: "{nome}",
            content:"<b>IP:</b> {ip_helper}<br>" + 
                    "<b>Local:</b> {sector}"
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: "favicon.ico",
                width: 28,
                height: 28,
            }
        }
    })
    this.addToView(layer)
}

addToView(layer) {
    this.view.map.add(layer);
    layer.when(() => {
        layer.queryExtent().then(response => {
            if (response.extent.heigth < 100) this.view.extent = response.extent
            this.view.center = [response.extent.center.x, response.extent.center.y]
        })
    })
}

loader() {
    loadCss()
    loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/FeatureLayer',
        'esri/widgets/Locate',
        'esri/widgets/Search',
        'esri/widgets/Expand',
        'esri/widgets/BasemapToggle',
        'esri/widgets/BasemapGallery',
        'esri/Graphic',
        'esri/widgets/LayerList',
        'esri/symbols/PictureFillSymbol',
        'esri/geometry/geometryEngine',
        'esri/geometry/Point'
    ]).then(([Map, MapView, 
        FeatureLayer, Locate, Search, Expand, BasemapToggle,
        BasemapGallery, Graphic, LayerList, PictureFillSymbol, 
        geometryEngine, Point
    ]) => {
                            this.Map = Map
                            this.MapView = MapView
                            this.FeatureLayer = FeatureLayer
                            this.Locate = Locate
                            this.Search = Search
                            this.Expand = Expand
                            this.BasemapToggle = BasemapToggle
                            this.BasemapGallery = BasemapGallery
                            this.Graphic = Graphic
                            this.LayerList = LayerList
                            this.PictureFillSymbol = PictureFillSymbol
                            this.geometryEngine = geometryEngine
                            this.Point = Point

                            this.map = new this.Map({
                                basemap: "dark-gray-vector"
                            })

                            this.view = new this.MapView({
                                container: "viewDiv",
                                map: this.map,
                                center: [-46.67, -23.55],
                                zoom: 13
                            })

                            this.setEvents()
                    })
}


setEvents() {
    this.view.when(() => {
        let validToken = "";
        try{
            let value = AsyncStorage.getItem('@api:token').then(token => {
                
                 const t = `Bearer ${token}`

                 console.log(token);

                 Axios.get('https://app.helpertecnologia.com.br/api/helper', {
                     headers: {
                      "Authorization": t,
                     }
                 })
                 .then(response => {
                     this.listaHelpers = [...response.data]
                     for(let i in this.listaHelpers){
                         this.listaHelpers[i].text = this.listaHelpers[i].nomeHelper
                     }
                     this.loadGraphicArray(this.listaHelpers, "Helpers")
                 }).catch(err=>{ console.log(err)})
                 this.carregarWidgets()
            });
        }catch (e) {
            console.log(e);
        }
        
    })
}

carregarWidgets() {
    this.searchWidget = new this.Search({
        view: this.view,
        allPlaceholder: "Entre com um endereço para pesquisa",
    });

    this.view.ui.add(this.searchWidget, "top-right");

    this.layerList = new this.Expand({
        expandIconClass: 'esri-icon-hollow-eye',
        expandTooltip: "Lista de Camadas",
        expanded: false,
        autoColapse: true,
        content: new this.LayerList({ view:this.view }),
        view:this.view
    })

    this.locateBtn = new this.Locate({ view:this.view });

    this.view.ui.add(this.locateBtn, "top-left");

    this.basemapToggle = new this.BasemapToggle({
        view:this.view,
        nextBasemap: "topo-vector"
    });

    this.basemapGallery = new this.BasemapGallery({
        view: this.view,
        toogle: true,
        source: {
            portal: {
                url: "https://www.arcgis.com",
                useVectorBasemaps: true
            }
        }
    });

    this.basemapSelector = new this.Expand({
        expandIconClass: 'esri-icon-basemap',
        expandTooltip: "Basemap Gallery",
        expanded: false,
        autoColapse: true,
        view: this.view,
        content: this.basemapGallery
    });
    this.view.ui.add([this.basemapToggle, this.basemapSelector, this.layerList], "bottom-left")
 }

}

export default ArcGIS;