import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Router, NavigationExtras, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuController, LoadingController, ModalController, IonTabs } from "@ionic/angular";
import { RestService } from "../services/rest.service";
import { MessagesService } from "../services/messages.service";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GestionValorescatastralesPage } from '../gestion-valorescatastrales/gestion-valorescatastrales.page';
import { GestionValorescatastralesNoasignacionPage } from '../gestion-valorescatastrales-noasignacion/gestion-valorescatastrales-noasignacion.page';
import { GestionNoasignacionPage } from '../gestion-noasignacion/gestion-noasignacion.page';


@Component({
  selector: "app-main-list",
  templateUrl: "./main-list.page.html",
  styleUrls: ["./main-list.page.scss"]
})
export class MainListPage implements OnInit {
  ngOnInit() {
    this.checkProfile();
  }
  account: any[];
  findText: string = "";
  loading: any;
  u: any;
  total: number;
  gestionadas: number;
  pagadas: number;
  argumento = null;
  refrescar = null;
  routerSubscription:any;
  modulosExternos: boolean = false;
  constructor(
    private mensaje: MessagesService,
    private iab: InAppBrowser,
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController,
    private geolocation: Geolocation,
    private service: RestService,
    public loadingCtrl: LoadingController,
    private clipboard: Clipboard,
    private activateRoute: ActivatedRoute,
    private modalController: ModalController

  ) { 

  }

  async checkProfile() {
    let modulosNoAsignacion = await this.storage.get("ModulosNoAsignacion");

    if( modulosNoAsignacion == 'Activado') {
      this.modulosExternos= true;
    }
    console.log("valores", this.modulosExternos);

  }

  ionViewDidEnter() {
    this.refresh();
    console.log('Entra a el didenter')
  }

  doRefresh(event) {
    console.log('A hecho el refresh');
    this.router.navigate(['home/main-list']);
    this.refresh();
    setTimeout(() => {
       console.log('Async operation has ended');
       event.target.complete();
    }, 1000);
  }


  async getInfo() {
    this.total = await this.service.getTotalaccounts();
    this.gestionadas = await this.service.getTotalaccountsManagded();
    this.pagadas = await this.service.getTotalAccountsPaid();
  }

  async goMapPage(item) {
    let position = { lat: item.latitud, lng: item.longitud };
    console.log("Entra a ver la position");
    console.log(position);
    let navigationExtras: NavigationExtras = {
      state: {
        position: position
      }
    };

    this.router.navigate(["account-map-list"], navigationExtras);
  }
  async goMapDirectionsPage(item) {
    let position = { lat: item.latitud, lng: item.longitud };
    console.log("Entra a ver la position");
    console.log(position);
    let navigationExtras: NavigationExtras = {
      state: {
        position: position
      }
    };

    this.router.navigate(["map-indications"], navigationExtras);
  }

  async goPanoramaView(item) {
    let position = {
      lat: parseFloat(item.latitud),
      lng: parseFloat(item.longitud)
    };
    console.log("Entra a ver la position");
    console.log(position);
    let navigationExtras: NavigationExtras = {
      state: {
        position: position
      }
    };

    this.router.navigate(["streetview"], navigationExtras);
  }

  goDetail() {
    this.router.navigate(["/detail"]);

  }


  async mostrarModulos() {
    console.log("Mostrar modulos de gestion sin asignacion");
    const modal = await this.modalController.create({
      component: GestionNoasignacionPage
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
      console.log("trata de salir");
      this.router.navigate(['home/main-list']);
    })
  }


  // async valoresCatastrales() {
  //   console.log("Entrando a carta valores catastrales sin asignacion");
  //   const modal = await this.modalController.create({
  //     component: GestionValorescatastralesNoasignacionPage,
  //     // componentProps: {
  //     //  Data:Data }

  //   });

  //   await modal.present();
  //   modal.onDidDismiss().then(data => {
  //     //console.log(data)
  //     console.log('trata de salir')

  //     this.router.navigate(['/home/main-list']);
  //   })

  // }

  async getDetail(accountNumber) {
    console.log("this is account to be saved: " + accountNumber);
    await this.storage.set("accountNumber", accountNumber);
    this.goDetail();
  }

  async goPhotos(accountNumber) {
    await this.storage.set("accountNumber", accountNumber);
    this.goPhotosPage();
  }
  goPhotosPage() {
    this.router.navigate(["/photos-detail"])
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  find(event) {
    this.findText = event.detail.value;
    console.log(this.findText);
  }
  async getAccountInfo() {
    //realiza la carga de informacion que existe en la base interna sqlite
    this.account = null;
    this.account = await this.service.getDataVisitList();
    /*   await this.service.getList().subscribe(data=>{
        this.account = data
        console.log('Y al fin lo tengo')
        console.log(this.account)
      }); */


    console.log(this.account);
    if (this.account.length == 0) {
      this.mensaje.showAlert(
        "Debes sincronizar primero para comenzar con las gestiones!!"
      );
      this.router.navigate(["home/sync-page"])
    }
  }

  async refresh() {
    this.account = null
    console.log('Se trata de refrescar la lista')
    this.loading = await this.loadingCtrl.create({
      message: "Cargando lista..."
    });
    await this.loading.present();
    await this.getInfo();
    await this.getAccountInfo();
    await this.checkProfile();
    this.loading.dismiss()
  }
  async getPagadas() {
    this.account = null;
    this.account = await this.service.getDataVisitListPaid();
  }
  async getFaltantes() {
    this.account = null;
    this.account = await this.service.getDataVisitListLeft();
  }
  async getGestionadas() {
    this.account = null;
    this.account = await this.service.getDataVisitListManaged();
  }

  async openLink(item) {
    this.loading = await this.loadingCtrl.create({
      message: "Obteniendo tu ubicación..."
    });
    await this.loading.present();
    const position = await this.geolocation.getCurrentPosition();
    this.loading.dismiss();
    let myLatitude = position.coords.latitude;
    let myLongitude = position.coords.longitude;
    let latitud = parseFloat(item.latitud);
    let longitud = parseFloat(item.longitud);

    let link = `https://www.google.com/maps/dir/'${myLatitude},${myLongitude}'/${latitud},${longitud}`;

    console.log(link);
    this.iab.create(link, "_system", { location: "yes", zoom: "yes" });
  }
  async copyAccount(account) {
    // this.clipboard.copy(account);
    // this.mensaje.showToast('Numero de cuenta copiado al portapapeles ' + account)
     await this.storage.set("accountNumber", account);
     console.log(account);
    this.router.navigate(["gestion-page"]);
  }

  filter(type) {
    switch (type) {
      case 1: this.refresh(); break;
      case 2: this.getGestionadas(); break;
      case 3: this.getFaltantes(); break;
      case 4: this.getPagadas(); break;
    }
  }
}
