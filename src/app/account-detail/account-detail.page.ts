import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { RestService } from "../services/rest.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { MessagesService } from '../services/messages.service';

@Component({
  selector: "app-account-detail",
  templateUrl: "./account-detail.page.html",
  styleUrls: ["./account-detail.page.scss"]
})
export class AccountDetailPage implements OnInit {
  accountNumber: string;
  adeudo: string;
  ultimaObservacion: string;
  direccionPredio: string;
  role: number;
  user_role: string;
  lastConection: string;
  userName: string;
  infoAccount: any;
  loading: any;
  propietario: boolean = true;
  info: boolean = false;
  pagos: boolean = false;
  historial: boolean;
  valores: boolean;
  mapa: boolean;
  buttonActivate: boolean = false;

  telefonoPropietario: string;
  nombrePropietario: string;
  correoPropietario: string;
  celularPropietario: string;
  nombreUsuario: string;
  telefonoUsuario: string;
  celularUsuario: string;
  correoUsuario: string;
  fechaLocalizacion: string='1999-09-09';
  isChange: boolean= false;

  fechaActual : string=''
  idaspUser: string;

  constructor(
    private mensaje : MessagesService,
    private storage: Storage,
    private service: RestService,
    public loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.getCrendentials();

    this.getAccountNumber();
    this.setRole();
    this.getFechaActual();
  }

  getFechaActual(){
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); 
    
  this.fechaActual = ionicDate.toISOString();
  let fecha = this.fechaActual.split('T')
  this.fechaActual = fecha[0]
  console.log('Esta es la fecha Actual :::::::::::' + this.fechaActual)
  
  }


  async getCrendentials() {
    this.userName = await this.storage.get("UserName");
    this.user_role = await this.storage.get("IdRol");
    this.idaspUser = await this.storage.get("IdAspUser");
  }
  async getAccountNumber() {
    this.loading = await this.loadingCtrl.create({
      message: "Cargando informacion de la cuenta..."
    });
    await this.loading.present();

    this.accountNumber = await this.storage.get("accountNumber");
    this.user_role = await this.storage.get("IdRol");

    console.log("esta es la cuenta en el storage " + this.accountNumber);
    this.infoAccount = await this.service.getInfoAccount(this.accountNumber);
    this.nombrePropietario = this.infoAccount[0].nombre_propietario;
    this.telefonoPropietario = this.infoAccount[0].telefono_propietario;
    this.celularPropietario = this.infoAccount[0].celular_propietario;
    this.correoPropietario = this.infoAccount[0].correo_electronico_propietario;

    console.log(this.infoAccount);
    this.loading.dismiss();
  }
  setRole() {
    switch (this.role) {
      case 1:
        this.user_role = "Administrador";
        break;
      case 2:
        this.user_role = "Gestor ejecutivo";
        break;
      case 5:
        this.user_role = "Gestor cobranza";
        break;
      case 7:
        this.user_role = "Reductor";
        break;
      default:
        this.user_role = "Superman";
    }
  }
  isActivated(id: number) {
    switch (id) {
      case 1:
        this.propietario = true;
        this.info = false;
        this.pagos = false;
        this.valores = false;
        this.historial = false;
        this.mapa = false;
        break;
      case 2:
        this.info = true;
        this.propietario = false;
        this.pagos = false;
        this.valores = false;
        this.historial = false;
        this.mapa = false;
        break;
      case 3:
        this.propietario = false;
        this.info = false;
        this.pagos = true;
        this.valores = false;
        this.historial = false;
        this.mapa = false;
        break;
      case 4:
        this.propietario = false;
        this.info = false;
        this.pagos = false;
        this.valores = true;
        this.historial = false;
        this.mapa = false;
        break;
      case 5:
        this.propietario = false;
        this.info = false;
        this.pagos = false;
        this.valores = false;
        this.historial = true;
        this.mapa = false;
        break;
      case 6:
        this.propietario = false;
        this.info = false;
        this.pagos = false;
        this.valores = false;
        this.historial = false;
        this.mapa = true;
        break;
    }
  }

 
  async saveConfirm(type) {
console.log(this.isChange)
    if(this.isChange == true){

      if(this.fechaLocalizacion =='1999-09-09' && type == 1){this.mensaje.showAlert('Ingresa la fecha de localización')}
else{
    const alert = await this.alertController.create({
      header: "Confirmar!",
      message:
        "La información editada se guardará y se verá reflejada despues de sincronizar con el servidor de implementta!!!",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
            this.isChange = false
          }
        },
        {
          text: "Guardar",
          handler: () => {
              this.saveDataPropietario(type);
              this.isChange = false    
          }
        }
      ]
    });

    await alert.present();}
  
  
  }


    else{this.mensaje.showAlert('No hay cambios que guardar :(')}
  }
  saveDataPropietario(type) {
    let fecha = this.fechaLocalizacion.split("T");
    let dateString = fecha[0];
    let newDate = new Date(dateString).toISOString();
    console.log(dateString);
    console.log(newDate);
    let data
    if (type == 2){
       data = {
        cuenta: this.accountNumber,
        nombre: this.nombreUsuario,
        telefono: this.telefonoUsuario,
        celular: this.celularUsuario,
        correo: this.correoUsuario,
        fecha: newDate,
        fechaCaptura: this.fechaActual,
        idaspUser: this.idaspUser,
        idRol: this.user_role,
        type: type
      };
    }else{
     data = {
       cuenta: this.accountNumber,
       nombre: this.nombrePropietario,
       telefono: this.telefonoPropietario,
       celular: this.celularPropietario,
       correo: this.correoPropietario,
       fecha: newDate,
       fechaCaptura: this.fechaActual,
       idaspUser: this.idaspUser,
       idRol: this.user_role,
       type: type
     };}
    console.log(data);
    this.service.setPropietario(data);
  }
 
  isChanged(){
    this.isChange = true
  }
}
