import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { S3Service } from "../app/services/s3.service";
import { SystemVariableService } from "../app/services/system-variable";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";
import { firebaseConfig } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AngularFireStorage } from "@angular/fire/storage";
import { GoogleMaps } from "@ionic-native/google-maps/ngx";
import { SQLite } from "@ionic-native/sqlite/ngx";
//import 'firebase/firestore';
//import 'firebase/storage';
import { PipesModule } from "./pipes/pipes.module";
import { AngularFirestore } from "@angular/fire/firestore";
import { CustomTag } from "../app/main-mapcluster/main-mapcluster.page";
import { Base64 } from "@ionic-native/base64/ngx";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { NativeGeocoder } from "@ionic-native/native-geocoder/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Network } from "@ionic-native/network/ngx";
import { File } from "@ionic-native/file/ngx";


@NgModule({
  declarations: [AppComponent, CustomTag],
  entryComponents: [CustomTag],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [
    Clipboard,
    Base64,
    File,
    NativeGeocoder,
    InAppBrowser,
    BackgroundGeolocation,
    UniqueDeviceID,
    AndroidPermissions,
    SystemVariableService,
    S3Service,
    AppVersion,
    Network,
    AngularFirestore,
    GoogleMaps,
    Geolocation,
    StatusBar,
    Camera,
    WebView,
    SQLite,
    PipesModule,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
