import 'ol/ol.css';

import { Component, OnInit } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';

@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.page.html',
  styleUrls: ['./test-map.page.scss'],
})
export class TestMapPage implements OnInit {
  constructor() {}

  ngOnInit() {
    //Settaggio componenti progetto
    let nodifisici = 'CollaudoLiveGisfo:prj_nodes';
    let nodiottici = 'CollaudoLiveGisfo:view_pcab_nodes';
    let tratte = 'CollaudoLiveGisfo:prj_lines_trenches';
    let edifopta = 'CollaudoLiveGisfo:view_connessione_edificio_pta';

    let latcentromap = '39.9930840239375';
    let longcentrmap = '9.6895549549637';
    let nomegisfo = 'Baunei';

    // Elaborazioni shape
    if (edifopta != '') {
      nodifisici = nodifisici + ', ' + edifopta;
      nodiottici = nodiottici + ', ' + edifopta;
      tratte = tratte + ', ' + edifopta;
    } else {
      nodifisici = nodifisici;
      nodiottici = nodiottici;
      tratte = tratte;
    }
    //-------------------------------------------------------

    new Map({
      target: 'map',
      layers: [
        new LayerGroup({
          title: 'Sfondi cartografici',
          layers: [
            new TileLayer({
              title: 'Google Streets',
              type: 'base',
              visible: false,
              source: new XYZ({
                url: 'http://mt1.googleapis.com/vt?x={x}&y={y}&z={z}',
              }),
            }),
            new TileLayer({
              title: 'Open Street Map',
              type: 'base',
              visible: false,
              source: new OSM(),
            }),
            new TileLayer({
              title: 'Google satellite',
              type: 'base',
              visible: true,
              source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}?key=AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc',
              }),
            }),
            new TileLayer({
              title: 'Nessuno',
              type: 'base',
              visible: false,
            }),
          ],
        }),
        new LayerGroup({
          title: 'Progetto completo',
          layers: [
            new TileLayer({
              title: 'Nodi fisici',
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: { LAYERS: nodifisici, TILED: true },
                serverType: 'geoserver',
              }),
            }),
            new TileLayer({
              title: 'Nodi ottici',
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: { LAYERS: nodiottici, TILED: true },
                serverType: 'geoserver',
              }),
            }),
            new TileLayer({
              title: 'Tratte',
              source: new TileWMS({
                url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                params: { LAYERS: tratte, TILED: true },
                serverType: 'geoserver',
              }),
            }),
          ],
        }),
      ],
      view: new View({
        center: olProj.transform(
          [longcentrmap, latcentromap],
          'EPSG:4326',
          'EPSG:3857'
        ),
        zoom: 15,
      }),
    });

    // LayerSwitcher (legenda)
    /* let layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'group'
    });
    Map.addControl(layerSwitcher); */

    //Map.addLayer(new LayerSwitcher({ reverse: false }));
  }
}
