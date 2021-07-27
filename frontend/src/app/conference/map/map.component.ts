import 'ol/ol.css';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { MapService } from './map.service';

import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import Feature, { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj.js';
import Rotate from 'ol/control/Rotate';
import ScaleLine from 'ol/control/ScaleLine';
import FullScreen from 'ol/control/FullScreen';

import { DragAndDrop, defaults as defaultInteractions } from 'ol/interaction';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format';

import LayerSwitcher, {
  Options as LsOptions,
  GroupSelectStyle,
  BaseLayerOptions,
  GroupLayerOptions,
} from 'ol-layerswitcher';
import { KMZ } from './KMZ';
import Geometry from 'ol/geom/Geometry';
import { format } from 'ol/coordinate';

import { Socket } from 'ngx-socket-io';
import { GpsService } from '../gps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() roomId: number;
  @Input() followOperator: boolean;
  @Input() marker2Delete: boolean;
  @Input() isInfo: boolean;

  marker: Feature;
  marker2: Feature;
  vectorSource: VectorSource;
  vectorSource2: VectorSource;
  vectorSourceKML: VectorSource;
  //vectorSourceKMLOUT: VectorSource;
  vectorLayer: VectorLayer;
  vectorLayer2: VectorLayer;
  vectorLayerKML: VectorLayer;
  //vectorLayerKMLOUT: VectorLayer;

  pozzetto: TileLayer;
  tratte: TileLayer;
  nodi: TileLayer;

  @ViewChild('info') info: ElementRef;

  coordByMouse: { lat: string; lon: string } = { lat: '', lon: '' };
  mappa: Map;

  mousePosition: MousePosition;
  mousePositionForMarker2: MousePosition;

  constructor(
    private mapService: MapService,
    private socket: Socket,
    private gps: GpsService
  ) {}

  /* MARKER BLUE definizione */
  createMarker2() {
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
      title: 'Marker Indicazioni',
      visible: true,
    } as BaseLayerOptions);

    return vectorLayer;

    /* ************************************ */
  }

  ngOnInit() {
    // this.socket.on('kmzon', (res: any) => {
    //   this.vectorLayerKMLOUT = new VectorLayer({
    //     source: res.kmz,
    //     opacity: 0.7,
    //     declutter: true,
    //     updateWhileInteracting: true,
    //     title: 'KMZ / KML',
    //   } as BaseLayerOptions);

    //   this.mappa.addLayer(this.vectorLayerKMLOUT);
    //   this.mappa.getView().fit(this.vectorSourceKMLOUT.getExtent());
    // });

    this.vectorLayer2 = this.createMarker2();

    /* COORDINATE AL PASSAGGIO DEL MOUSE */
    this.mousePosition = new MousePosition({
      coordinateFormat: olCoordinate.createStringXY(7),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;',
    });

    /* MAPPA E LAYER */
    this.mapService.fetchMap(this.roomId).subscribe((map) => {
      //console.log('🐱‍👤 : mapData', map);

      /* drag &drop */
      const dragAndDropInteraction = new DragAndDrop({
        formatConstructors: [KMZ, GPX, GeoJSON, IGC, KML, TopoJSON],
      });

      /* ****************** DEFINIZIONE LAYER PROGETTO *******************/
      this.pozzetto = new TileLayer({
        title: 'Nodi fisici',
        minZoom: 12,
        source: new TileWMS({
          url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
          params: {
            LAYERS: map.nodifisici,
            TILED: true,
          },
          serverType: 'geoserver',
        }),
      } as BaseLayerOptions);

      this.tratte = new TileLayer({
        title: 'Tratte',
        minZoom: 12,
        source: new TileWMS({
          url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
          params: { LAYERS: map.tratte, TILED: true },
          serverType: 'geoserver',
        }),
      } as BaseLayerOptions);

      this.nodi = new TileLayer({
        title: 'Nodi ottici',
        minZoom: 12,
        source: new TileWMS({
          url: 'https://www.collaudolive.com:9080/geoserver/CollaudoLiveGisfo/wms',
          params: { LAYERS: map.nodiottici, TILED: true },
          serverType: 'geoserver',
        }),
      } as BaseLayerOptions);

      /* ********************************************************************************************* */

      this.mappa = new Map({
        interactions: defaultInteractions().extend([dragAndDropInteraction]),
        controls: defaultControls({ attribution: false }).extend([
          this.mousePosition,
        ]),
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
              } as BaseLayerOptions),
              new TileLayer({
                title: 'Open Street Map',
                type: 'base',
                visible: true,
                source: new OSM(),
              } as BaseLayerOptions),
              new TileLayer({
                title: 'Google satellite',
                type: 'base',
                visible: false,
                source: new XYZ({
                  url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}?key=AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc',
                }),
              } as BaseLayerOptions),
              new TileLayer({
                title: 'Nessuno',
                type: 'base',
                visible: false,
                source: new XYZ({
                  url: '',
                }),
              } as BaseLayerOptions),
            ],
          } as GroupLayerOptions),
          new LayerGroup({
            title: 'Progetto completo',
            layers: [this.pozzetto, this.nodi, this.tratte],
          } as GroupLayerOptions),
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

      this.updateMarkerOperatore(map.longcentrmap, map.latcentromap);

      this.gps.ConfigIdRoom(this.roomId);

      // setTimeout(() => {
      //   window.setInterval(() => this.gps.getLocation(), 3000);
      // }, 5000);

      /* CONTROLLI IN AGGIUNTA */
      const scaleLineControl = new ScaleLine();
      this.mappa.addControl(scaleLineControl);

      const rotateMapControl = new Rotate({
        autoHide: false,
      });
      this.mappa.removeControl(rotateMapControl);

      const fullScreenControl = new FullScreen();
      this.mappa.addControl(fullScreenControl);

      /* Layer Menu */

      const groupStyle: GroupSelectStyle = 'children';

      const opts: LsOptions = {
        reverse: true,
        groupSelectStyle: groupStyle,
        startActive: false,
        activationMode: 'click',
      };
      const layerSwitcher = new LayerSwitcher(opts);

      this.mappa.addControl(layerSwitcher);

      /* click event marker blu / display info kmz/l */

      this.mappa.on('click', (evt) => {
        if (this.isInfo) {
          this.displayFeatureInfo(evt.pixel);
        }

        if (this.marker2Delete) {
          //coordinate in EPSG 3857 (coord. proiettate)
          var X = evt.coordinate[0].toFixed(7);
          var Y = evt.coordinate[1].toFixed(7);

          //trasformazione coordinate da EPSG:3857 a EPSG:4326
          var lonlat = olProj.transform(
            evt.coordinate,
            'EPSG:3857',
            'EPSG:4326'
          );

          //coordinate in EPSG 4326 (coord. geografiche)
          var lon = lonlat[0].toFixed(7);
          var lat = lonlat[1].toFixed(7);

          this.coordByMouse = {
            lat: lonlat[1].toFixed(7),
            lon: lonlat[0].toFixed(7),
          };

          // GPS EMIT --------------------------------
          // this.socket.emit('posizioneMarker', {
          //   idroom: 1180,
          //   latitudine: lonlat[1].toFixed(7),
          //   longitudine: lonlat[0].toFixed(7),
          // });

          // GPS ON --------------------------------
          // this.socket.on('posMkrBckEnd', function (posMkrBckEnd: any) {
          //   console.log('posMkrBckEnd.idroom: ' + posMkrBckEnd.idroom);
          //   console.log('posMkrBckEnd.lat: ' + posMkrBckEnd.latitudine);
          //   console.log('posMkrBckEnd.long: ' + posMkrBckEnd.longitudine);
          // });

          this.gps.socketMarker(lat, lon);
          this.mappa.removeLayer(this.vectorLayer2);
          this.vectorLayer2 = this.createMarker2();
          this.mappa.addLayer(this.vectorLayer2);
        }
      });

      /* Drag&Drop KML KMZ*/

      dragAndDropInteraction.on('addfeatures', (event: any) => {
        // this.vectorSourceKMLOUT = new VectorSource({
        //   features: event.features,
        // });

        this.vectorSourceKML = new VectorSource({
          features: event.features,
        });

        this.vectorLayerKML = new VectorLayer({
          source: this.vectorSourceKML,
          opacity: 0.7,
          declutter: true,
          updateWhileInteracting: true,
          title: 'KMZ / KML',
        } as BaseLayerOptions);
        console.log('qqq: ' + this.vectorLayerKML);
        this.mappa.addLayer(this.vectorLayerKML);
        this.mappa.getView().fit(this.vectorSourceKML.getExtent());
        //this.socket.emit('kmzemit', { kmz: this.vectorSourceKMLOUT });
      });
    });

    this.gps.coordinate$.subscribe((coords) => {
      if (coords && coords.length > 0) {
        let index = coords.length - 1;
        this.updateMarkerOperatore(coords[index].long, coords[index].lat);
      }
    });
    this.socket
      .fromEvent<any>('gpsUtente_idroom_' + this.roomId)
      .subscribe((gpsRemote) => {
        this.updateMarkerOperatore(gpsRemote.longitudine, gpsRemote.latitudine);
      });
  }

  /* INFO KML/KMZ */

  displayFeatureInfo(pixel) {
    if (this.isInfo) {
      const features = [];
      this.mappa.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          const description =
            features[i].get('description') ||
            features[i].get('name') ||
            features[i].get('_name') ||
            features[i].get('layer');
          if (description) {
            info.push(description);
          }
        }
        document.getElementById('info').innerHTML =
          info.join('<br/>') || '&nbsp';
      } else {
        document.getElementById('info').innerHTML = '&nbsp;';
      }
    }
  }

  /* SEGUI OPERATORE */
  updateMarkerOperatore(long, lat) {
    if (this.mappa) {
      if (this.vectorLayer) {
        this.mappa.removeLayer(this.vectorLayer);
      }
      this.marker = new Feature({
        geometry: new Point(fromLonLat([long, lat])),
      });

      this.marker.setStyle(
        new Style({
          zIndex: 999,
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
        title: 'Marker Operatore',
        visible: true,
      } as BaseLayerOptions);

      this.mappa.addLayer(this.vectorLayer);

      if (this.followOperator) {
        this.mappa
          .getView()
          .setCenter(olProj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
      }

      /* rimuove marker BLU all' update */
      if (this.marker2Delete == false) {
        if (this.vectorLayer2) {
          this.mappa.removeLayer(this.vectorLayer2);
        }
      }
    }
  }
}
