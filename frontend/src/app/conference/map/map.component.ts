import 'ol/ol.css';

import { Component, Input, OnChanges, OnInit } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';

import * as olCoordinate from 'ol/coordinate';
import { defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import { MapData, MapService } from './map.service';

import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj.js';

import { DragAndDrop, defaults as defaultInteractions } from 'ol/interaction';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format';
import * as JSZip from 'jszip';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() roomId: number;

  marker: Feature;
  marker2: Feature;
  vectorSource: VectorSource;
  vectorSource2: VectorSource;
  vectorLayer: VectorLayer;
  vectorLayer2: VectorLayer;

  coordByMouse: { lat: string; lon: string } = { lat: '', lon: '' };
  mappa: Map;

  mousePosition: MousePosition;
  mousePositionForMarker2: MousePosition;

  constructor(private mapService: MapService) {}

  createMarker2() {
    /* MARKER BLUE definizione */
    this.marker2 = new Feature({
      geometry: new Point(
        fromLonLat([+this.coordByMouse.lon, +this.coordByMouse.lat])
      ),
    });

    this.marker2.setStyle(
      new Style({
        image: new Icon({
          color: '#03477e',
          crossOrigin: 'anonymous',
          src: '../../../assets/markerDot2.svg',
          imgSize: [20, 20],
        }),
      })
    );

    let vectorSource = new VectorSource({
      features: [this.marker2],
    });

    let vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    return vectorLayer;

    /* ************************************ */
  }

  ngOnInit() {
    this.vectorLayer2 = this.createMarker2();
    console.log(this.vectorLayer2);

    /* COORDINATE AL PASSAGGIO DEL MOUSE */
    this.mousePosition = new MousePosition({
      coordinateFormat: olCoordinate.createStringXY(7),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;',
    });
    /* MAPPA E LAYER */
    this.mapService.fetchMap(this.roomId).subscribe((map) => {
      console.log('🐱‍👤 : mapData', map);

      /* MARKER ROSSO CENTRO MAPPA */

      this.marker = new Feature({
        geometry: new Point(fromLonLat([map.longcentrmap, map.latcentromap])),
      });

      this.marker.setStyle(
        new Style({
          image: new Icon({
            color: '#E21C20',
            crossOrigin: 'anonymous',
            src: '../../../assets/markerDot.svg',
            imgSize: [20, 20],
          }),
        })
      );

      this.vectorSource = new VectorSource({
        features: [this.marker],
      });

      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
      });
      /* ************************************ */

      this.mappa = new Map({
        controls: defaultControls().extend([
          this.mousePosition,
        ]) /* COORDINATE AL PASSAGGIO DEL MOUSE */,
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
                minZoom: 12,
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.nodifisici, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
              new TileLayer({
                // title: 'Nodi ottici',
                minZoom: 12,
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.nodiottici, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
              new TileLayer({
                // title: 'Tratte',
                minZoom: 12,
                source: new TileWMS({
                  url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
                  params: { LAYERS: map.tratte, TILED: true },
                  serverType: 'geoserver',
                }),
              }),
            ],
          }),
          this.vectorLayer,
          this.vectorLayer2,
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
      this.mappa.on('click', (evt) => {
        //         var numtotlayers = map.getLayers().getLength();
        // if (numtotlayers == 4) {
        //   var indexMarker = numtotlayers - 1;
        //   var ttt = this.mappa.getLayers().removeAt(indexMarker);
        // }
        //coordinate in EPSG 3857 (coord. proiettate)
        var X = evt.coordinate[0].toFixed(7);
        var Y = evt.coordinate[1].toFixed(7);

        //trasformazione coordinate da EPSG:3857 a EPSG:4326
        var lonlat = olProj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

        //coordinate in EPSG 4326 (coord. geografiche)
        var lon = lonlat[0].toFixed(7);
        var lat = lonlat[1].toFixed(7);

        // console.log('coordinateeeeeeeeeeeeee', lon, lat);

        this.coordByMouse = {
          lat: lonlat[1].toFixed(7),
          lon: lonlat[0].toFixed(7),
        };

        this.mappa.removeLayer(this.vectorLayer2);
        this.vectorLayer2 = this.createMarker2();
        this.mappa.addLayer(this.vectorLayer2);
      });
    });
  }
}
