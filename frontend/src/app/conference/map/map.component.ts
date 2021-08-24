import 'ol/ol.css';
import date from 'date-and-time';

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import * as olProj from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import Geolocation from 'ol/Geolocation';

import * as olCoordinate from 'ol/coordinate';
import { defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition';
import { MapService } from './map.service';

import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style';
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

import { Socket } from 'ngx-socket-io';
import { GpsService } from '../gps.service';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import CircleStyle from 'ol/style/Circle';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() roomId: number;
  @Input() followOperator: boolean;
  @Input() isInfo: boolean;

  isMarkerBluOn: boolean = false;

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

  googleStreet: TileLayer;
  openSM: TileLayer;
  satellite: TileLayer;
  nessuno: TileLayer;
  geolocation: Geolocation;

  @ViewChild('info') info: ElementRef;

  coordByMouse: { lat: string; lon: string } = { lat: '', lon: '' };
  mappa: Map;

  mousePosition: MousePosition;
  mousePositionForMarker2: MousePosition;

  resizeObservable$: Observable<Event> = fromEvent(window, 'resize');
  resizeSubscription$: Subscription;

  accuracyFeature: Feature;
  positionFeature: Feature;

  view: View;

  constructor(
    private mapService: MapService,
    private socket: Socket,
    private gps: GpsService
  ) {}

  updateSize() {
    if (this.mappa) {
      setTimeout(() => {
        this.mappa.updateSize();
      }, 200);
    }
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }

  ngOnInit() {
    /* SUBSCRIBE AL RESIZE DELLA PAGINA PER AGGIORNARE LA MAPPA  */
    this.resizeSubscription$ = this.resizeObservable$
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((evt) => {
        this.updateSize();
      });

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

    this.updateMarkerBlu(0, 0);

    /* COORDINATE AL PASSAGGIO DEL MOUSE */
    this.mousePosition = new MousePosition({
      coordinateFormat: olCoordinate.createStringXY(7),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;',
    });

    /* MAPPA E LAYER */
    this.mapService.fetchMap(this.roomId).subscribe((map) => {
      /* DRAG & DROP */
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

      /* ****************** DEFINIZIONE LAYER BASE MAPPA *******************/

      this.googleStreet = new TileLayer({
        title: 'Google Streets',
        type: 'base',
        visible: false,
        source: new XYZ({
          url: 'http://mt1.googleapis.com/vt?x={x}&y={y}&z={z}',
        }),
      } as BaseLayerOptions);

      this.openSM = new TileLayer({
        title: 'Open Street Map',
        type: 'base',
        visible: true,
        source: new OSM(),
      } as BaseLayerOptions);

      this.satellite = new TileLayer({
        title: 'Google satellite',
        type: 'base',
        visible: false,
        source: new XYZ({
          url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}?key=AIzaSyAfSMp-syOQXDlulMxr14XIV4-hgOt2DRc',
        }),
      } as BaseLayerOptions);

      this.nessuno = new TileLayer({
        // TODO ++++ SFONDO BIANCO
        title: 'Nessuno',
        type: 'base',
        visible: false,
        source: new XYZ({
          url: '',
        }),
      } as BaseLayerOptions);

      /* ********************************************************************************************* */

      this.view = new View({
        center: olProj.transform(
          [map.longcentrmap, map.latcentromap],
          'EPSG:4326',
          'EPSG:3857'
        ),
        zoom: 15,
      });

      /* INIZIALIZZAZIONE MAPPA CON TIMEOUT PER CARICAMENTO PREVENTIVO LAYER*/
      setTimeout(() => {
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
                this.googleStreet,
                this.openSM,
                this.satellite,
                this.nessuno,
              ],
            } as GroupLayerOptions),
            new LayerGroup({
              title: 'Progetto completo',
              layers: [this.pozzetto, this.nodi, this.tratte],
            } as GroupLayerOptions),
          ],
          view: this.view,
        });

        //this.updateMarkerOperatore(map.longcentrmap, map.latcentromap);

        /* CONTROLLI IN AGGIUNTA */
        const scaleLineControl = new ScaleLine();
        this.mappa.addControl(scaleLineControl);

        const fullScreenControl = new FullScreen();
        this.mappa.addControl(fullScreenControl);

        /* CONTROLLI RIMOSSI */
        const rotateMapControl = new Rotate({
          autoHide: false,
        });
        this.mappa.removeControl(rotateMapControl);

        /* LAYER SWITCHER MENU */
        const groupStyle: GroupSelectStyle = 'children';
        const opts: LsOptions = {
          reverse: true,
          groupSelectStyle: groupStyle,
          startActive: false,
          activationMode: 'click',
        };
        const layerSwitcher = new LayerSwitcher(opts);
        this.mappa.addControl(layerSwitcher);

        /* EVENTO CLICK - INDICAZIONI - INFO KMZ/L */
        this.mappa.on('click', (evt) => {
          if (this.isInfo) {
            this.displayFeatureInfo(evt.pixel);
          }
          if (this.isMarkerBluOn) {
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
            this.updateMarkerBlu(lon, lat);
            this.gps.socketEmitMarkerBlu(lat, lon);
          }
        });

        /* ************ */
        this.geolocation = new Geolocation({
          // enableHighAccuracy must be set to true to have the heading value.
          tracking: false,
          trackingOptions: {
            enableHighAccuracy: true,
          },
          projection: this.view.getProjection(),
        });

        this.geolocation.on('error', function (error) {
          console.log('errore');
        });
        this.positionFeature = new Feature();

        this.positionFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({
                color: '#FF0000',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          })
        );

        this.geolocation.on('change:position', (e) => {
          let position = e.target.getPosition();
          let coordinates = olProj.toLonLat(
            position,
            this.view.getProjection()
          );
          coordinates[1] = Math.round(coordinates[1] * 10000000) / 10000000;
          coordinates[0] = Math.round(coordinates[0] * 10000000) / 10000000;
          this.gps.coordinateSubject.next({
            latitude: coordinates[1].toString(),
            longitude: coordinates[0].toString(),
          });
          // console.log(
          //   '🐱‍👤 : coordinates',
          //   date.format(new Date(), 'HH:mm:ss'),
          //   coordinates
          // );
          this.socket.emit('gps', {
            idroom: this.roomId,
            latitudine: coordinates[1].toString(),
            longitudine: coordinates[0].toString(),
          });
          if (this.followOperator) {
            this.mappa.getView().setCenter(position);
          }
          this.positionFeature.setGeometry(
            position ? new Point(position) : null
          );
        });
        this.accuracyFeature = new Feature();
        this.geolocation.on('change:accuracyGeometry', (e) => {
          this.accuracyFeature.setGeometry(e.target.getAccuracyGeometry());
        });
        new VectorLayer({
          map: this.mappa,
          source: new VectorSource({
            features: [this.accuracyFeature, this.positionFeature],
          }),
        });

        /* ISTRUZIONI AL DRAG & DROP DEL KML-KMZ*/
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
          // console.log('qqq: ' + this.vectorLayerKML);
          this.mappa.addLayer(this.vectorLayerKML);
          this.mappa.getView().fit(this.vectorSourceKML.getExtent());
          //this.socket.emit('kmzemit', { kmz: this.vectorSourceKMLOUT });

          /// --------------------------------------
        });

        this.socket
          .fromEvent<any>('gpsUtente_idroom_' + this.roomId)
          .subscribe((gpsRemote) => {
            console.log(
              '🐱‍👤 : gpsRemote',
              date.format(new Date(), 'HH:mm:ss'),
              gpsRemote
            );
            //this.updateMarkerOperatore(gpsRemote.longitudine, gpsRemote.latitudine)
            let coordinates = [gpsRemote.longitudine, gpsRemote.latitudine];
            if (this.followOperator) {
              this.mappa
                .getView()
                .setCenter(
                  olProj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
                );
            }
            this.positionFeature.setGeometry(
              fromLonLat(coordinates)
                ? new Point(fromLonLat(coordinates))
                : null
            );
          });
        this.socket
          .fromEvent<any>('posMkrBckEnd_' + this.roomId)
          .subscribe((markerBlu) => {
            this.updateMarkerBlu(markerBlu.longitudine, markerBlu.latitudine);
          });
      }, 1000);

      this.gps.ConfigIdRoom(this.roomId);
    });

    /* SUBSCRIBE ALLE COORDINATE DEI MARKER DELLA MAPPA E TRASMISSIONE POSIZIONI TRAMITE SOCKET */
    // this.gps.coordinate$.subscribe((coords) => {
    //   if (coords && coords.length > 0) {
    //     let index = coords.length - 1;
    //     this.updateMarkerOperatore(coords[index].long, coords[index].lat);
    //   }
    // });
  }

  /* DISPLAY INFO KML/KMZ */
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

  /* DEFINIZIONE DEL MARKER BLUE (INDICAZIONI)  */
  updateMarkerBlu(long, lat) {
    if (this.mappa) {
      if (this.vectorLayer2) {
        this.mappa.removeLayer(this.vectorLayer2);
      }

      this.marker2 = new Feature({
        geometry: new Point(fromLonLat([+long, +lat])),
      });

      this.marker2.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({
              color: '#028ffa',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        })
      );

      let vectorSource = new VectorSource({
        features: [this.marker2],
      });

      this.vectorLayer2 = new VectorLayer({
        source: vectorSource,
        title: 'Marker Indicazioni',
        visible: true,
      } as BaseLayerOptions);

      this.mappa.addLayer(this.vectorLayer2);
    }
  }

  toggleMarkerBlu() {
    if (this.isMarkerBluOn) {
      this.deleteMarkerBlu();
      this.isMarkerBluOn = false;
    } else {
      this.isMarkerBluOn = true;
    }
  }

  /* RIMUOVE MARKER BLUE ED INVIA AL BACKEND LA POSIZIONE 0,0 TRAMITE SOKET */
  deleteMarkerBlu() {
    if (this.vectorLayer2) {
      this.mappa.removeLayer(this.vectorLayer2);
      this.gps.socketEmitMarkerBlu('0', '0');
    }
  }

  startGps() {
    if (this.geolocation) {
      this.geolocation.setTracking(true);
    }
  }
  stopGps() {
    if (this.geolocation) {
      this.geolocation.setTracking(false);
    }
  }
}
