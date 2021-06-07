import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from './shared/shared.module';
import { TokenInterceptor } from './token.interceptor';

const config: SocketIoConfig = {
  url: `${environment.apiUrl}`, // id="socket.io_address" value="/"
  options: {
    secure: true,
    reconnection: true,
    reconnectionDelay: 1000,
    timeout: 15000,
    pingTimeout: 15000,
    pingInterval: 45000,
    query: {
      framespersecond: 15,
      audioBitrate: 44100,
    },
  },
};

@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SocketIoModule.forRoot(config),
    // IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
