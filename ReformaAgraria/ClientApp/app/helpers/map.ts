import * as L from 'leaflet';
import { FeatureCollection, GeometryObject } from 'geojson';

import { BaseLayer } from '../models/gen/baseLayer';
import { BaseLayerService } from '../services/gen/baseLayer';
import { ToraMap } from '../models/gen/toraMap';

export class MapHelper {

    static getGeojsonBaseLayer(baseLayer: BaseLayer, baseLayerService: BaseLayerService): L.GeoJSON<any> {
        let geoJsonOptions = {
            style: (feature) => {
                let color = baseLayer.color;
                if (!color) {
                    color = "#000"
                }
                return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
            },          
            onEachFeature: (feature, layer: L.FeatureGroup) => {               
            }
        };
        
        let geojsonLayer = L.geoJSON(JSON.parse(baseLayer.geojson), geoJsonOptions);    
        geojsonLayer.onAdd = (map: L.Map) => {
            let geojson = geojsonLayer.toGeoJSON() as FeatureCollection<GeometryObject, any>;
            if (geojson.features.length === 0) {
                baseLayerService.getById(baseLayer.id).subscribe(bl => {                    
                    geojsonLayer.addData(JSON.parse(bl.geojson));
                });
            }
            return geojsonLayer.eachLayer(map.addLayer, map);
        };

        return geojsonLayer;
    }

    static getGeojsonToraMap(toraMap: ToraMap, color: string) {
        var size = toraMap.toraObject.size ? (toraMap.toraObject.size / 10000).toFixed(2) + ' ha' : '-';
        var totalSubjects = toraMap.toraObject.totalSubjects || '-';

        let geoJsonOptions = {
            style: (feature) => {                
                if (!color) 
                    color = "#000";
                return { color: color, weight: feature.geometry.type === 'LineString' ? 3 : 1 }
            },     
            onEachFeature: (feature, layer: L.FeatureGroup) => {
                layer.bindPopup('<table class=\'table table-sm\'><thead><tr><th colspan=3 style=\'text-align:center\'><a href="/toradetail/' + toraMap.toraObject.id + '">' + toraMap.name + '</th></tr></thead>' +
                    '<tbody><tr><td>Kabupaten</td><td>:</td><td><a href="/home/' + toraMap.region.parent.parent.id.split('.').join('_') + '">' + toraMap.region.parent.parent.name + '</a></td></tr>' +
                    '<tr><td>Kecamatan</td><td>:</td><td><a href="/home/' + toraMap.region.parent.id.split('.').join('_') + '">' + toraMap.region.parent.name + '</td></tr>' +
                    '<tr><td>Desa</td><td>:</td><td><a href="/home/' + toraMap.region.id.split('.').join('_') + '">' + toraMap.region.name + '</td></tr>' +
                    '<tr><td>Luas</td><td>:</td><td>' + size + '</td></tr>' +
                    '<tr><td>Jumlah Penggarap</td><td>:</td><td>' + totalSubjects + '</td></tr></tbody></table>');       
            }
        };      

        return L.geoJSON(JSON.parse(toraMap.geojson), geoJsonOptions);        
    }

    static setupStyle(configStyle) {
        let resultStyle = Object.assign({}, configStyle);
        let color = MapHelper.getStyleColor(configStyle);
        if (color)
            resultStyle['color'] = color;
        return resultStyle;
    }

    static getStyleColor(configStyle, defaultColor = null) {
        if (configStyle['cmykColor'])
            return MapHelper.cmykToRgbString(configStyle['cmykColor']);
        if (configStyle['rgbColor'])
            return MapHelper.rgbToRgbString(configStyle['rgbColor']);
        return defaultColor;
    }

    static cmykToRgbString(cmyk): any {
        let c = cmyk[0], m = cmyk[1], y = cmyk[2], k = cmyk[3];
        let r, g, b;
        r = 255 - ((Math.min(1, c * (1 - k) + k)) * 255);
        g = 255 - ((Math.min(1, m * (1 - k) + k)) * 255);
        b = 255 - ((Math.min(1, y * (1 - k) + k)) * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    static rgbToRgbString(rgb): any {
        let r = rgb[0], g = rgb[1], b = rgb[2];
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    static createMarker(url, center): L.Marker {
        let bigIcon = L.icon({
            iconUrl: 'assets/markers/' + url,
            iconSize: [15, 15],
            shadowSize: [50, 64],
            iconAnchor: [22, 24],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        });

        return L.marker(center, { icon: bigIcon });
    }
}
