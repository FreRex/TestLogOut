import 'ol/ol.css';

import { Component, Input, OnInit } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import { MapData, MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() roomId: number;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.fetchMap(this.roomId).subscribe((map: Map) => {
      console.log('🐱‍👤 : mapData', map);

      new Map({
        target: 'map',
        layers: [
          new LayerGroup({
            // title: 'Sfondi cartografici',
            layers: [
              new TileLayer({
                // title: 'Google Streets',
                // type: 'base',
                visible: true,
                source: new XYZ({
                  url: 'http://mt1.googleapis.com/vt?x={x}&y={y}&z={z}',
                }),
              }),
              new TileLayer({
                // title: 'Open Street Map',
                // type: 'base',
                visible: false,
                source: new OSM(),
              }),
              new TileLayer({
                // title: 'Google satellite',
                // type: 'base',
                visible: false,
                source: new XYZ({
                  url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}?key=AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc',
                }),
              }),
              new TileLayer({
                // title: 'Nessuno',
                // type: 'base',
                visible: false,
              }),
            ],
          }),
          new LayerGroup({
            // title: 'Progetto completo',
            layers: [
              new TileLayer({
                // title: 'Nodi fisici',
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.nodifisici, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
              new TileLayer({
                // title: 'Nodi ottici',
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.nodiottici, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
              new TileLayer({
                // title: 'Tratte',
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.tratte, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
            ],
          }),
        ],
        view: new View({
          center: olProj.transform(
            [map.longcentrmap, map.latcentromap],
            'EPSG:4326',
            'EPSG:3857'
          ),
          zoom: 15,
        }),
      });

      // LayerSwitcher (legenda)
      /* 
      let layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'group'
    });
    Map.addControl(layerSwitcher); 
    */
      //Map.addLayer(new LayerSwitcher({ reverse: false }));
    });
  }
}
