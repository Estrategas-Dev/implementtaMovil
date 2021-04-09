import { Injectable } from "@angular/core";
import { SQLiteObject } from "@ionic-native/sqlite/ngx";
import { HttpClient } from "@angular/common/http";
import { Base64 } from "@ionic-native/base64/ngx";
import { S3Service } from "./s3.service";
import { LoadingController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { MessagesService } from "./messages.service";
import { NetworkService } from "./network.service";
import { File } from "@ionic-native/file/ngx";
import { BehaviorSubject } from 'rxjs';
import { unwatchFile } from 'fs';

export interface Dev {
  id: number,
  cuenta: string,
  full: string,
  nombre_propietario: string,
  latitud: string,
  longitud: string,
  calle_predio: string,
  adeudo: string,
  gestionada: string,
  colonia_predio: string
}

@Injectable({
  providedIn: "root"
})


export class RestService {

  list = new BehaviorSubject([]);
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  arrayUrls: any
  array: any;
  db: SQLiteObject = null;
  apiUrl0 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_obtenerCuentasMovil";
  apiUrl1 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_getImagesImplementtaMovil";
  apiUrl2 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_userVerifyImplementtaMovil";
  apiUrl3 =
    "https://implementta.net/andro/ImplementtaMovilChecador.aspx?query=sp_registroAsistenciaV3";
  apiUrl4 =
    "https://implementta.net/andro/ImplementtaMovilChecador.aspx?query=sp_getInfoAsistencia";
  apiUrl5 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_savePhotosImplementta";
  apiUrl6 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_registroGestorMovil";
  apiUrl61 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_RegistroAbogadoApk_Movil";
  apiUrl62 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_RegistroReductoresMovil";
  apiUrl7 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_registroRecorridoMovil";
  apiUrl8 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_registroAbogadoMovil";
  apiUrl10 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_actualizaDirecciones";
  apiUrl11 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_actualizaDomicilios";
  apiUrl12 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_actualizaDatos";
  apiurl13 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_ObtenerTipoPlaza";
  apiurl14 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_RegistroCartaInvitacionMovil";
  apiurl15 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_HistorialAccionesMovil";
  apiurl16 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_cuentaPadron";
  apiurl17 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_registroInspeccionMovil";
  apiurl18 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_registroValoresMovil";
  apiurl19 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_NombresGestoresInspeccion"
  apiurl20 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_RegistroInspeccionAgua";
  apiurl21 =
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_RegistroInspeccionPredio";


  loading: any;
  lista: any[];
  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private file: File,
    private storage: Storage,
    private base64: Base64,
    private mensaje: MessagesService,
    private s3Service: S3Service,
    private toastCtrl: ToastController
  ) {

    this.arrayUrls = [];
  }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }
  ////////////////getdalalist con observable
  getList() {
    this.loadList();
    console.log('si hizo este pedo')
    console.log(this.list)
    return this.list.asObservable()
  }
  loadList() {
    let sql = `SELECT id,gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL order by nombre_propietario`;
    this.db.executeSql(sql, []).then(data => {
      let list: Dev[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          list.push({
            id: data.rows.item(i).id,
            cuenta: data.rows.item(i).cuenta,
            full: data.rows.item(i).full,
            nombre_propietario: data.rows.item(i).nombre_propietario,
            latitud: data.rows.item(i).latitud,
            longitud: data.rows.item(i).longitud,
            calle_predio: data.rows.item(i).calle_predio,
            adeudo: data.rows.item(i).adeudo,
            gestionada: data.rows.item(i).gestionada,
            colonia_predio: data.rows.item(i).colonia_predio
          });
        }
      }
      this.list.next(list);
    });
  }
  getDataVisitListObservable() {
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL order by nombre_propietario`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayCuentas = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayCuentas.push(response.rows.item(index));
        }

        return Promise.resolve(arrayCuentas);
      })
      .catch(error => Promise.reject(error));
  }

  async getTotalPhotos() {
    let sql =
      "SELECT count(*)as total FROM capturaFotos where cargado = 0";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;
      return Promise.resolve(result);
    } catch (error) {
      return await Promise.reject(error);
    }
  }
  deletePhoto(id, url) {
    this.db.executeSql("delete from  capturaFotos where id = ?", [id]);
    this.deletePhotoFile(url);
    return;
  }
  async deletePhotoFile(url) {
    var uno = url.split("cache/");
    let first = uno[0] + "cache/";
    let second = uno[1];
    console.log(first, second);
    this.file
      .removeFile(first, second)
      .then(res => {
        console.log("Se borro");
        console.log(res);
      })
      .catch(err => {
        console.log("No borro");
        console.log(err);
      });
  }
  async uploadPhoto(id) {
    return new Promise(async (resolve) => {
      let arrayImages = [];
      let sql = "SELECT * FROM capturaFotos where cargado = 0 and id = ?";
      let response = await this.db.executeSql(sql, [id]);
      for (let i = 0; i < response.rows.length; i++) {
        arrayImages.push(response.rows.item(i));
      }
      await this.base64.encodeFile(arrayImages[0].rutaBase64).then(async (base64File: string) => {
        let imageName = arrayImages[0].cuenta + arrayImages[0].fecha;
        let imagen64 = base64File.split(",");
        let imagenString = imagen64[1];
        let idTarea = arrayImages[0].idTarea;
        if (idTarea == null) { idTarea = 0; }
        // await this.uploadPhotoS3V1(item.cuenta,item.idAspUser, idTarea, item.fecha,item.tipo, imagenString,imageName, item.id,item.rutaBase64);
        try {
          this.s3Service.uploadS3(imagenString, imageName).then(async uploadResponse => {
            if (uploadResponse) {
              let UrlOriginal: any;
              UrlOriginal = this.s3Service.getURLPresignaded(imageName);
              console.log('La url::::::')
              console.log(UrlOriginal)
              await this.saveSqlServer(arrayImages[0].cuenta, arrayImages[0].idAspUser, imageName, idTarea, arrayImages[0].fecha, arrayImages[0].tipo, arrayImages[0].id, UrlOriginal, arrayImages[0].ruta, 1);
              resolve(true);
            }
            else {
              this.uploadPhoto(id);
            }
          });

        } catch (err_1) {
          alert(err_1)
          console.log(err_1);
          resolve(false);
        }


      },
        err => {
          alert(err)
          console.log(err);
        }
      );

    });
  }
  reloadAllPhotos() {
    let sql = 'UPDATE capturaFotos set cargado = 0'
    return this.db.executeSql(sql, null)
  }

  reloadPhotosDate(fechaInicio, fechaFinal) {
    let sql = `UPDATE capturaFotos set cargado = 0 where DATE( substr(fecha,1,4) || '-' || substr(fecha,6,2) || '-' || substr(fecha,9,2) ) BETWEEN '${fechaInicio}' AND '${fechaFinal}'`
    //let sql = `UPDATE capturaFotos set cargado = 0 where DATE( substr(fecha,1,4) || '-' || substr(fecha,6,2) || '-' || substr(fecha,9,2) ) BETWEEN DATE( substr(${fechaInicio},1,4) || '-' || substr(${fechaInicio},6,2) || '-' || substr(${fechaInicio},9,2) )  AND DATE( substr(${fechaFinal},1,4) || '-' || substr(${fechaFinal},6,2) || '-' || substr(${fechaFinal},9,2) )`;
    //let sql = `UPDATE capturaFotos set cargado = 0 where fecha BETWEEN '${fechaInicio}' and '${fechaFinal}'`
    //this.mensaje.showAlert(sql);
    return this.db.executeSql(sql, null);
  }

  reloadAllAddress() {
    let sql = 'UPDATE domicilios set cargado = 0'
    return this.db.executeSql(sql, null)
  }

  reloadallPropietario() {
    let sql = 'UPDATE propietario set cargado = 0'
    return this.db.executeSql(sql, null);
  }

  async uploadPhotos() {
    let arrayImages = [];
    let sql = "SELECT * FROM capturaFotos where cargado = 0 LIMIT 20";
    let response = await this.db.executeSql(sql, []);
    for (let i = 0; i < response.rows.length; i++) {
      arrayImages.push(response.rows.item(i));
    }
    if (arrayImages.length == 0) {
      this.mensaje.showToast('Sin fotos')
    } else {
      this.loading = await this.loadingCtrl.create({
        message: "Por favor espere, se estan sincronizando sus fotos...."
      });
      await this.loading.present();

      // for (let i = 0; i < arrayImages.length; i++) {
      //   await this.base64.encodeFile(arrayImages[i].rutaBase64).then(async (base64File: string) => {
      //     let imageName = arrayImages[i].cuenta + arrayImages[i].fecha;
      //     let imagen64 = base64File.split(",");
      //     let imagenString = imagen64[1];
      //     let idTarea = arrayImages[i].idTarea;
      //     if (idTarea == null) { idTarea = 0; }
      //     await this.uploadPhotoS3V1(arrayImages[i].cuenta, arrayImages[i].idAspUser, idTarea, arrayImages[i].fecha, arrayImages[i].tipo, imagenString, imageName, arrayImages[i].id, arrayImages[i].rutaBase64, i + 1);
      //   },
      //     err => {
      //       alert(err)
      //       console.log(err);
      //       this.loading.dismiss();
      //     }
      //   );
      // }
      this.avanceImagenes = 0;
      this.envioDatos(arrayImages);
    }
  }

  avanceImagenes = 0;
  envioDatos(arrayImages) {
    if (this.avanceImagenes === arrayImages.length) {
      this.loading.dismiss();
      this.mensaje.showToastLarge('Se subieron correctamente las fotos');
    } else {
      this.sendImage(this.avanceImagenes, arrayImages).then(respEnvio => {
        if (respEnvio) {
          this.avanceImagenes++;
          this.envioDatos(arrayImages);
        } else {
          this.envioDatos(arrayImages);
        }
      });
    }
  }


  async sendImage(i, arrayImages) {
    return new Promise(async (resolve) => {
      await this.base64.encodeFile(arrayImages[i].rutaBase64).then(async (base64File: string) => {
        let imageName = arrayImages[i].cuenta + arrayImages[i].fecha;
        let imagen64 = base64File.split(",");
        let imagenString = imagen64[1];
        // imagen string es el que manda al s3 y el nombre que en este caso es el imageName
        let idTarea = arrayImages[i].idTarea;
        if (idTarea == null) { idTarea = 0; }
        this.uploadPhotoS3V1(arrayImages[i].cuenta, arrayImages[i].idAspUser, idTarea, arrayImages[i].fecha, arrayImages[i].tipo, imagenString, imageName, arrayImages[i].id, arrayImages[i].rutaBase64, i + 1).then(respImagen => {
          resolve(respImagen);
        });
      },
        err => {
          console.log(err);
          resolve(false);
        }
      );
    });
  }


  async uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont) {
    return new Promise(async (resolve) => {
      try {
        this.s3Service.uploadS3(base64File, imageName).then(async uploadResponse => {
          if (uploadResponse) {
            let UrlOriginal: any;
            UrlOriginal = this.s3Service.getURLPresignaded(imageName);
            console.log('La url::::::')
            console.log(UrlOriginal)
            await this.saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, UrlOriginal, ruta, cont);
            resolve(true);
          }
          else {
            this.uploadPhotoS3V1(cuenta, idAspuser, idTarea, fecha, tipo, base64File, imageName, id, ruta, cont);
          }
        });
      } catch (err_1) {
        alert(err_1)
        console.log(err_1);
        resolve(false);
      }
    });
  }

  ///////////////////////////////////////continuar aqui para la carga de las fotos

  async saveSqlServer(cuenta, idAspuser, imageName, idTarea, fecha, tipo, id, url, ruta, cont) {
    let a = url.split("&");
    let b = a[0];
    let b1 = b.split(":");
    let b2 = b1[0];
    let b3 = b1[1];
    let c = a[1];
    let d = a[2];
    console.log('La url partida')
    console.log(b2, b3, c, d)
    let idPlaza = await this.storage.get("IdPlaza");
    let strinSql0 = `'${cuenta}','${idAspuser}','${imageName}',${idTarea},'${fecha}','${tipo}',${idPlaza},'${b2}','${b3}','${c}','${d}'`;

    return new Promise(resolve => {
      this.http.post(this.apiUrl5 + " " + strinSql0, null).subscribe(
        async data => {
          this.mensaje.showToast(data[0].mensaje + ' ' + cont)
          await this.updateLoadedItem(id);
          console.log('registroCargado al sql')
          //   await this.deletePhotoFile(ruta);
          //  console.log('se borro la foto')
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Existe un error con la red, verifica y vuelve a intentar :( " + err
          );
          console.log(err);
        }
      );
    });
  }

  finalLoad() {
    console.log('Ahora si ya todas las fotos estan en el s3 y ya solo se manda las urls al sql')
    console.log('Numero de veces que debe entrar el ciclo::' + this.arrayUrls.length)
    for (let i = 0; i < this.arrayUrls.length; i++) {
      return new Promise(resolve => {
        console.log('numero de veces que entra el ciclo: ' + i)
        console.log('Aqui se muestra la url pero en ciclo')
        console.log(this.arrayUrls[i + 1].url)
        this.http.post(this.apiUrl5 + " " + this.arrayUrls[i + 1].url, null).subscribe(
          async data => {
            console.log(data)
            await this.updateLoadedItem(this.arrayUrls[i].id);
            console.log('registroCargado al sql')
            // await this.deletePhotoFile(this.arrayUrls[i].ruta);
            //  console.log('se borro la foto')
            resolve(data);
          },
          err => {
            this.mensaje.showAlert(
              "Existe un error con la red, verifica y vuelve a intentar :("
            );
            console.log(err);
          }
        );
      });
    }
  }

  async showToast(mensaje) {
    let toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 1500,
      position: "middle"
    });
    toast.present();
  }


  updateLoadedItem(id) {
    let sql = "UPDATE capturaFotos SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
    let sql =
      "INSERT INTO capturaFotos(imagenLocal,cuenta,fecha,rutaBase64,idAspuser,idTarea,tipo) values(?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      image,
      accountNumber,
      fecha,
      rutaBase64,
      idAspuser,
      idTarea,
      tipo
    ]);
  }
  async getImagesLocal() {
    let sql =
      "SELECT * FROM capturaFotos where cargado = 0  order by fecha desc";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayImages = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayImages.push(response.rows.item(index));
        }
        console.log(arrayImages);
        return Promise.resolve(arrayImages);
      })
      .catch(error => Promise.reject(error));
  }

  async getImageLocal(img) {
    let sql = "SELECT * FROM CapturaFotos where cargado = 0 and imagenLocal = ?"
    return this.db.executeSql(sql, [img])
      .then(response => {
        let arrayImage = [];
        arrayImage.push(response.rows.item(0));
        console.log(arrayImage);
        this.deletePhoto(arrayImage[0].id, arrayImage[0].rutaBase64);
        return Promise.resolve(arrayImage);
      })
      .catch(error => Promise.reject(error));

  }




  getVisit(idaspuser, idplaza) {
    //este metodo en primer lugar descarga los datos del servidor SQL server

    try {
      return new Promise(resolve => {
        console.log("Entra a tratar de hacer la descarga.....");

        this.http
          .post(
            this.apiUrl0 + " " + '"' + idaspuser + '"' + "," + idplaza,
            null
          )
          .subscribe(
            data => {
              // hay que agregar posteriormente el id de la plaza
              console.log("datos traidos del sql", data)
              resolve(data);
            },
            err => {
              this.loadingCtrl.dismiss();
              this.mensaje.showAlert("Error en la red vuelve a intentarlo");

              console.log(err);
            }
          );
      });
    } catch {
      console.log("La cagamos en algo");
    }
  }
  async getVisitCount() {
    let sql = "SELECT count(*) FROM implementta";
    try {
      const response = await this.db.executeSql(sql, []);

      return Promise.resolve(response);
    } catch (error) {
      return await Promise.reject(error);
    }
  }
  deleteVisit() {
    let sqlDelete = "DELETE from implementta";
    this.db.executeSql(sqlDelete, []);
  }


  deleteGestionesGestor() {
    let sqlDeleteGestor = "DELETE from gestionGestor";
    this.db.executeSql(sqlDeleteGestor, []);
  }

  deleteGestionesCarta() {
    let sqlDeleteCarta = "DELETE from gestionCartaInvitacion";
    this.db.executeSql(sqlDeleteCarta, []);
  }

  deleteAbogado() {
    let sqlDeleteAbogado = "DELETE from gestionAbogado";
    this.db.executeSql(sqlDeleteAbogado, []);
  }

  deleteReductores() {
    let sqlDeleteReductores = "DELETE from gestionReductor";
    this.db.executeSql(sqlDeleteReductores, []);
  }

  deleteInspeccion() {
    let sqlDeleteInspeccion = "DELETE from gestionInspeccion";
    this.db.executeSql(sqlDeleteInspeccion, []);
  }

  deleteValoresCatastrales() {
    let sqlDeleteValores = "DELETE from gestionValoresCatastrales";
    this.db.executeSql(sqlDeleteValores, []);
  };

  deleteDomicilios() {
    let sqlDeleteDomciilios = "DELETE from domicilios";
    this.db.executeSql(sqlDeleteDomciilios, []);
  }

  deleteDatos() {
    let sqlDeletePropietarios = "DELETE from propietario";
    this.db.executeSql(sqlDeletePropietarios, []);
  }

  deleteFotos() {
    let sqlDeleteFotos = "DELETE from capturaFotos";
    this.db.executeSql(sqlDeleteFotos, []);
  }

  deleteInfo() {
    this.deleteVisit();
    this.deleteAbogado();
    this.deleteGestionesGestor();
    this.deleteGestionesCarta();
    this.deleteReductores();
    this.deleteInspeccion();
    this.deleteValoresCatastrales();
    this.deleteDomicilios();
    this.deleteDatos();
    this.deleteFotos();
  }

  setVisit(data: any) {
    // sincroniza las cuentas  a la base interna sqlite

    let sql = `INSERT INTO implementta(cuenta,adeudo,SupTerrenoH,SupConstruccionH,ValorTerrenoH,ValorConstruccionH,ValorCatastralH,SupTerrenoValuado,ValorCatastralValuado,SupConstruccionValuado,
          ValorTerrenoValuado,ValorConstruccionValuado,tareaAsignada,ultimo_pago,nombre_propietario,telefono_propietario,celular_propietario,correo_electronico_propietario,
          fecha_localizacion_propietario,nombre_usuario,telefono_usuario,celular_usuario,correo_electronico_usuario,id_relacion_propietario,motivo_no_pago,fecha_promesa_pago,
          cantidad_pago,id_tipo_deudor,id_motivonopago,id_servicios,id_expectativas,id_caracteristicas,JSON_quejas_reclamaciones,otra_queja_reclamacion,JSON_expectativas_contribuyente,
          otra_expectativa_contribuyente,JSON_caracteristicas_predio,otra_caracteristica_predio,id_accion_sugerida,id_uso_suelo_predio,id_tipo_predio_predio,calle_predio,num_interior_predio,
          num_exterior_predio,cp_predio,colonia_predio,entre_calle1_predio,entre_calle2_predio,manzana_predio,lote_predio,poblacion_predio,calle_notificacion,num_interior_notificacion,
          num_exterior_notificacion,cp_notificacion,colonia_notificacion,entre_calle1_notificacion,entre_calle2_notificacion,manzana_notificacion,lote_notificacion,referencia_predio ,
          referencia_notificacion,direccion_predio,direccion_notificacion,solucion_planteada,forma_pago,observaciones,id_tarea,latitud,longitud,tipoServicio,clave_catastral,numMedidor)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    return this.db.executeSql(sql, [
      data.cuenta,
      data.adeudo,
      data.SupTerrenoH,
      data.SupConstruccionH,
      data.ValorTerrenoH,
      data.ValorConstruccionH,
      data.ValorCatastralH,
      data.SupTerrenoValuado,
      data.ValorCatastralValuado,
      data.SupConstruccionValuado,
      data.ValorTerrenoValuado,
      data.ValorConstruccionValuado,
      data.tareaAsignada,
      data.ultimo_pago,
      data.nombre_propietario,
      data.telefono_propietario,
      data.celular_propietario,
      data.correo_electronico_propietario,
      data.fecha_localizacion_propietario,
      data.nombre_usuario,
      data.telefono_usuario,
      data.celular_usuario,
      data.correo_electronico_usuario,
      data.id_relacion_propietario,
      data.motivo_no_pago,
      data.fecha_promesa_pago,
      data.cantidad_pago,
      data.id_tipo_deudor,
      data.id_motivonopago,
      data.id_servicios,
      data.id_expectativas,
      data.id_caracteristicas,
      data.JSON_quejas_reclamaciones,
      data.otra_queja_reclamacion,
      data.JSON_expectativas_contribuyente,
      data.otra_expectativa_contribuyente,
      data.JSON_caracteristicas_predio,
      data.otra_caracteristica_predio,
      data.id_accion_sugerida,
      data.id_uso_suelo_predio,
      data.id_tipo_predio_predio,
      data.calle_predio,
      data.num_interior_predio,
      data.num_exterior_predio,
      data.cp_predio,
      data.colonia_predio,
      data.entre_calle1_predio,
      data.entre_calle2_predio,
      data.manzana_predio,
      data.lote_predio,
      data.poblacion_predio,
      data.calle_notificacion,
      data.num_interior_notificacion,
      data.num_exterior_notificacion,
      data.cp_notificacion,
      data.colonia_notificacion,
      data.entre_calle1_notificacion,
      data.entre_calle2_notificacion,
      data.manzana_notificacion,
      data.lote_notificacion,
      data.referencia_predio,
      data.referencia_notificacion,
      data.direccion_predio,
      data.direccion_notificacion,
      data.solucion_planteada,
      data.forma_pago,
      data.observaciones,
      data.id_tarea,
      data.latitud,
      data.longitud,
      data.tipoServicio,
      data.clave_catastral,
      data.numMedidor
    ]);
  }

  getDataVisit() {
    //carga las cuentas desde la base interna sqlite

    let sql = "SELECT * FROM implementta order by nombre_propietario";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let catalogo = [];

        for (let index = 0; index < response.rows.length; index++) {
          catalogo.push(response.rows.item(index));
        }

        return Promise.resolve(catalogo);
      })
      .catch(error => Promise.reject(error));
  }

  getDataVisitList() {
    //carga las cuentas desde la base interna sqlite

    //  let sql ='SELECT cuenta||propietario||calle as full, cuenta,propietario,cp,calle,colonia,poblacion,numext,deudaTotal,latitud,longitud FROM implementta_status where propietario NOT NULL order by propietario';
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo,clave_catastral,numMedidor FROM implementta where nombre_propietario NOT NULL order by cuenta`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayCuentas = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayCuentas.push(response.rows.item(index));
        }

        return Promise.resolve(arrayCuentas);
      })
      .catch(error => Promise.reject(error));
  }
  getDataVisitListPaid() {
    //carga las cuentas desde la base interna sqlite

    //  let sql ='SELECT cuenta||propietario||calle as full, cuenta,propietario,cp,calle,colonia,poblacion,numext,deudaTotal,latitud,longitud FROM implementta_status where propietario NOT NULL order by propietario';
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL and adeudo = 0 order by cuenta`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayCuentas = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayCuentas.push(response.rows.item(index));
        }

        return Promise.resolve(arrayCuentas);
      })
      .catch(error => Promise.reject(error));
  }
  getDataVisitListLeft() {
    //carga las cuentas desde la base interna sqlite

    //  let sql ='SELECT cuenta||propietario||calle as full, cuenta,propietario,cp,calle,colonia,poblacion,numext,deudaTotal,latitud,longitud FROM implementta_status where propietario NOT NULL order by propietario';
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL and gestionada = 0 order by cuenta`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayCuentas = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayCuentas.push(response.rows.item(index));
        }

        return Promise.resolve(arrayCuentas);
      })
      .catch(error => Promise.reject(error));
  }
  getDataVisitListManaged() {
    //carga las cuentas desde la base interna sqlite

    //  let sql ='SELECT cuenta||propietario||calle as full, cuenta,propietario,cp,calle,colonia,poblacion,numext,deudaTotal,latitud,longitud FROM implementta_status where propietario NOT NULL order by propietario';
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL and gestionada = 1 order by cuenta`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let arrayCuentas = [];

        for (let index = 0; index < response.rows.length; index++) {
          arrayCuentas.push(response.rows.item(index));
        }

        return Promise.resolve(arrayCuentas);
      })
      .catch(error => Promise.reject(error));
  }
  getDataVisitPosition() {
    //carga las posiciones  cuentas desde la base interna sqlite
    let sql =
      "SELECT gestionada, cuenta, latitud, longitud, nombre_propietario,adeudo FROM implementta where latitud > 0 and gestionada = 0";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let posiciones = [];

        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
        }

        return Promise.resolve(posiciones);
      })
      .catch(error => Promise.reject(error));
  }
  getDataVisitPositionByAccount(accountNumber: string) {
    let sql =
      "SELECT gestionada, cuenta, latitud, longitud FROM implementta where latitud > 0 and cuenta = ?";
    return this.db
      .executeSql(sql, [accountNumber])
      .then(response => {
        let res = [];

        for (let index = 0; index < response.rows.length; index++) {
          res.push(response.rows.item(index));
        }
        console.log(res);
        return Promise.resolve(res);
      })
      .catch(error => Promise.reject(error));
  }

  getInfoAccount(account) {
    let sql = "SELECT * from implementta where cuenta = ?";
    return this.db
      .executeSql(sql, [account])
      .then(response => {
        let posiciones = [];

        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
        }

        return Promise.resolve(posiciones);
      })
      .catch(error => Promise.reject(error));
  }

  async getImagesImplementta(account) {
    let idPlaza = await this.storage.get("IdPlaza");
    return new Promise(resolve => {
      this.http
        .get(this.apiUrl1 + " " + '"' + account + '"' + "," + idPlaza)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            this.loadingCtrl.dismiss();
            resolve(0);
            console.log(err);
          }
        );
    });
  }
  userVerify(username, idplaza) {
    return new Promise(resolve => {
      this.http
        .get(this.apiUrl2 + " " + '"' + username + '"' + "," + idplaza)
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            console.log(err);
          }
        );
    });
  }
  loadRegisterChecador(parametros: string) {
    console.log(parametros);
    return new Promise(resolve => {
      this.http.post(this.apiUrl3 + " " + parametros, null).subscribe(
        data => {
          resolve(data);
        },
        err => {
          this.mensaje.showAlert("Error en la red, intentalo de nuevo");
          console.log(err);
        }
      );
    });
  }
  getInfoAsistencia(idUser) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl4 + " " + idUser, null).subscribe(data => {
        resolve(data);
      });
    });
  }
  getCountPhotos() {
    let sql = "SELECT * from capturaFotos";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let posiciones = [];
        let cont = 0;
        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
          cont++;
        }
        console.log("estas son lass totales de fotos " + cont);
        return Promise.resolve(cont);
      })
      .catch(error => Promise.reject(error));
  }
  getCountPhotosSync() {
    let sql = "SELECT * from capturaFotos where cargado = 1";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let posiciones = [];
        let cont = 0;
        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
          cont++;
        }
        console.log("estas son lass totales de fotos sincronizaas" + cont);
        return Promise.resolve(cont);
      })
      .catch(error => Promise.reject(error));
  }
  saveLocation(lat, lng, idAspuser, fecha) {
    ///////////////Guardar el recorrido que realiza el gestor

    let sql =
      "INSERT INTO recorrido(latitud,longitud,idAspuser,fechaCaptura) values(?,?,?,?)";
    return this.db.executeSql(sql, [lat, lng, idAspuser, fecha]);
  }

  getUserLocation() {
    let sql = "SELECT * from recorrido";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let posiciones = [];

        for (let index = 0; index < response.rows.length; index++) {
          posiciones.push(response.rows.item(index));
        }

        return Promise.resolve(posiciones);
      })
      .catch(error => Promise.reject(error));
  }
  gestionReductor(data) {
    this.updateAccountGestionada(data.id);
    console.log("llego el query string");

    let sql =
      `INSERT INTO gestionReductor(account ,idTarea ,idDescripcion , idObservaciones , idaspuser,lectura ,conclusiones , personaContacto , telefonoContacto ,fechaPromesa , fechaCaptura , fechaProximaRev , latitud , longitud , niple , horaIni , horaFin, idTipoServicio, idEstatusToma, idTipoToma, descripcionTomaDirecta, idDescripcionMulta, idDetalle, idMedidorTapado, idTipoReductor, noCincho, idEstatusRequerimiento)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    return this.db.executeSql(sql, [
      data.account,
      data.idtarea,
      data.idDescripcion,
      data.idObservacion,
      data.idAspUser,
      data.lectura,
      data.conclusiones,
      data.personaContacto,
      data.telefonoContacto,
      data.fechaPromesa,
      data.fechaCaptura,
      data.fechaProximaVisita,
      data.latitud,
      data.longitud,
      data.idNiple,
      data.horaIni,
      data.horaFin,
      data.idTipoServicio,
      data.idEstatusToma,
      data.idTipoToma,
      data.descripcionTomaDirecta,
      data.idDescripcionMulta,
      data.idDetalle,
      data.idMedidorTapado,
      data.idTipoReductor,
      data.noCincho,
      data.idEstatusRequerimiento
    ]);
  }


  gestionInspeccionAgua(data) {
    this.updateAccountGestionada(data.id);

    let sql =
      "INSERT INTO gestionInspeccionAgua(account,cuenta,clave,ordenInspeccion,numeroMedidor,pozoConagua,idTipoServicio,idHallazgo,otroHallazgo,idAspUser,inspector2,inspector3,inspector4,idTarea,fechaCaptura,latitud,longitud)" +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    return this.db.executeSql(sql, [
      data.account,
      data.cuenta,
      data.clave,
      data.ordenInspeccion,
      data.numeroMedidor,
      data.pozoConagua,
      data.idTipoServicio,
      data.idHallazgo,
      data.otroHallazgo,
      data.idAspUser,
      data.inspector2,
      data.inspector3,
      data.inspector4,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud
    ]);
  }

  gestionInspeccionPredio(data) {
    this.updateAccountGestionada(data.id);

    let sql =
      "INSERT INTO gestionInspeccionPredio(account, claveCatastral, nombreContribuyente, direccion, orden, usoSuelo, observaciones, avaluo, idAspUser, inspector2, inspector3, inspector4, idTarea,  fechaCaptura, latitud, longitud)" +
      "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    return this.db.executeSql(sql, [
      data.account,
      data.claveCatastral,
      data.nombreContribuyente,
      data.direccion,
      data.orden,
      data.usoSuelo,
      data.observaciones,
      data.avaluo,
      data.idAspUser,
      data.inspector2,
      data.inspector3,
      data.inspector4,
      data.idTarea,
      data.fechaCaptura,
      data.latitud,
      data.longitud
    ]);
  }



  gestionGestor(data) {
    this.updateAccountGestionada(data.id);
    console.log("llego el query string");

    let sql =
      "INSERT INTO gestionGestor(account,idEstatus,observaciones,fechaPromesaPago,latitud,longitud,fechaCaptura,idAspuser,idTarea,fechaAsignacion,fechaVencimiento,idMotivoNoPago,motivoNoPago,idSolucionPlanteada,idExpectativasContribuyente,otraExpectativaContribuyente,idCaracteristicaPredio,otraCaracteristicaPredio,idServiciosNoPago,idTipoServicio,idEstatusToma,idTipoToma,numeroMedidor)" +
      "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      data.account,
      data.idEstatus,
      data.observaciones,
      data.fechaPromesaPago,
      data.latitud,
      data.longitud,
      data.fechaCaptura,
      data.idAspuser,
      data.idTareaGestor,
      data.fechaAsignacion,
      data.fechaVencimiento,
      data.idMotivoNoPago,
      data.motivoNoPago,
      data.idSolucionPlanteada,
      data.idExpectativasContribuyente,
      data.otraExpectativaContribuyente,
      data.idCaracteristicaPredio,
      data.otraCaracteristicaPredio,
      data.idServiciosNoPago,
      data.idTipoServicio,
      data.idEstatusToma,
      data.idTipoToma,
      data.numeroMedidor
    ]);
  }

  // Metodo que inserta la informacion capturada a la tabla interna gestionCartaInvitacion
  gestionCartaInvitacion(data) {
    console.log("llego el query string");
    this.updateAccountGestionada(data.id);
    let sql =
      "INSERT INTO gestionCartaInvitacion (account, idTarea, idaspuser, fechaCaptura, latitud, longitud, idTipoServicio, numeroMedidor)" +
      "values(?,?,?,?,?,?,?,?)"
    return this.db.executeSql(sql, [
      data.account,
      data.idTarea,
      data.idaspuser,
      data.fechaCaptura,
      data.latitud,
      data.longitud,
      data.idTipoServicio,
      data.numeroMedidor
    ])
  }

  gestionValoresCatastrales(data) {
    console.log("llego el query string");
    this.updateAccountGestionada(data.id);
    let sql =
      "INSERT INTO gestionValoresCatastrales (account, supConstruccion, supTerreno, valConstruccion, valTerreno, valCatastral, idTipoSuelo, observacion, fechaCaptura, idAspUser, latitud, longitud)" +
      "values (?,?,?,?,?,?,?,?,?,?,?,?)"
    return this.db.executeSql(sql, [
      data.account,
      data.supConstruccion,
      data.supTerreno,
      data.valConstruccion,
      data.valTerreno,
      data.valCatastral,
      data.idTipoSuelo,
      data.observacion,
      data.fechaCaptura,
      data.idAspUser,
      data.latitud,
      data.longitud
    ]);
  }



  gestionInspeccion(data) {
    console.log("llego el query string de la inspeccion");
    let sql =
      "INSERT INTO gestionInspeccion (account, clave, serieMedidor, idTipoClandestino, idContratada, descripcionClandestino, idTipoServicioDetectado, idCondicionPredio, descripcionCondicionPredio, idInstalacionesEncontradas, idTomaMaterial, diametroToma, serieMedidorDetectado, lecturaMedidor, idMarcaMedidor, diametroMedidor, idEstadoDescarga, observacion, idTarea, idaspuser, fechaCaptura, latitud, longitud )" +
      "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    return this.db.executeSql(sql, [
      data.cuenta,
      data.clave,
      data.medidor,
      data.tipoClandestino,
      data.contratada,
      data.descripcionClandestino,
      data.idTipoServicioDetectado,
      data.idCondicionesPredio,
      data.descripcionCondicionesPredio,
      data.idinstalaciones,
      data.idTomaMaterial,
      data.diametro,
      data.serieMedidor,
      data.lecturaMedidor,
      data.idMarcaMedidor,
      data.diametroMedidor,
      data.estadoDescarga,
      data.observacion,
      data.tareaAsignada,
      data.idaspuser,
      data.fechaCaptura,
      data.latitud,
      data.longitud
    ])
  }


  gestionAbogado(data) {
    this.updateAccountGestionada(data.id);

    let sql =
      "INSERT INTO gestionAbogado(account,idResultado,idPersona,observaciones,fechaPromesaPago,latitud,longitud,fechaCaptura,idAspuser,idTarea,fechaAsignacion,fechaVencimiento,idTipoServicio,idEstatusToma,idTipoToma)" +
      "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      data.account,
      data.idResultado,
      data.idPersona,
      data.observaciones,
      data.fechaPromesaPago,
      data.latitud,
      data.longitud,
      data.fechaCaptura,
      data.idAspuser,
      data.idTareaAbogado,
      data.fechaAsignacion,
      data.fechaVencimiento,
      data.idTipoServicio,
      data.idEstatusToma,
      data.idTipoToma
    ]);
  }
  getAccountsReadyToSyncGestor() {
    let sql = `SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'CARTA INVITACION' as rol  from gestionCartaInvitacion where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion clandestino' as rol from gestionInspeccion where cargado = 0
              UNION SELECT account, fechaCaptura, 'Gestion' as idtarea, 'Valores catastrales' as rol from gestionValoresCatastrales where cargado = 0 
              UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion' as rol from gestionInspeccionAgua where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion predio' as rol from gestionInspeccionPredio where cargado = 0`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let accounts = [];
        for (let index = 0; index < response.rows.length; index++) {
          accounts.push(response.rows.item(index));
        }
        return Promise.resolve(accounts);
      })
      .catch(error => Promise.reject(error));
  }


  getAccountsReadyToSyncAbogado() {
    let sql = `SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0 
    UNION SELECT account, fechaCaptura, idTarea, 'CARTA INVITACION' as rol  from gestionCartaInvitacion where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion clandestino' as rol from gestionInspeccion where cargado = 0
    UNION SELECT account, fechaCaptura, 'Gestion' as idtarea, 'Valores catastrales' as rol from gestionValoresCatastrales where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion' as rol from gestionInspeccionAgua where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion predio' as rol from gestionInspeccionPredio where cargado = 0`;

    return this.db
      .executeSql(sql, [])
      .then(response => {
        let accounts = [];
        for (let index = 0; index < response.rows.length; index++) {
          accounts.push(response.rows.item(index));
        }
        return Promise.resolve(accounts);
      })
      .catch(error => Promise.reject(error));
  }
  getAccountsReadyToSyncReductor() {
    let sql = `SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0 
    UNION SELECT account, fechaCaptura, idTarea, 'CARTA INVITACION' as rol  from gestionCartaInvitacion where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion clandestino' as rol from gestionInspeccion where cargado = 0
    UNION SELECT account, fechaCaptura, 'Gestion' as idtarea, 'Valores catastrales' as rol from gestionValoresCatastrales where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion' as rol from gestionInspeccionAgua where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Inspeccion predio' as rol from gestionInspeccionPredio where cargado = 0`;
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let accounts = [];
        for (let index = 0; index < response.rows.length; index++) {
          accounts.push(response.rows.item(index));
        }
        return Promise.resolve(accounts);
      })
      .catch(error => Promise.reject(error));
  }


  // eliminar una sola cuenta

  async deleteAccountGestor(cuenta) {
    let sql = "DELETE FROM gestionGestor where account = ?";
    let sql_0 = "SELECT * FROM gestionGestor where account = ?"
    let arrayDeleteGestor = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteGestor.push(result0.rows.item(i));
    }
    console.log(arrayDeleteGestor)
    if (arrayDeleteGestor.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }

  }

  async deleteAccountAbogado(cuenta) {
    let sql = "DELETE FROM gestionAbogado where account = ?";
    let sql_0 = "SELECT * FROM gestionAbogado where account = ?"
    let arrayDeleteAbogado = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteAbogado.push(result0.rows.item(i));
    }
    if (arrayDeleteAbogado.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }

  async deleteAccountReductor(cuenta) {
    let sql = "DELETE FROM gestionReductor where account = ?";
    let sql_0 = "SELECT * FROM gestionReductor where account = ?"
    let arrayDeleteReductor = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteReductor.push(result0.rows.item(i));
    }
    if (arrayDeleteReductor.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }

  async deleteAccountCartaInvitacion(cuenta) {
    let sql = "DELETE FROM gestionCartaInvitacion where account = ?";
    let sql_0 = "SELECT * FROM gestionCartaInvitacion where account = ?"
    let arrayDeleteCartaInvitacion = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteCartaInvitacion.push(result0.rows.item(i));
    }
    if (arrayDeleteCartaInvitacion.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }

  async deleteAccountInspeccion(cuenta) {
    let sql = "DELETE FROM gestionInspeccion where account = ?";
    let sql_0 = "SELECT * FROM gestionInspeccion where account = ?"
    let arrayDeleteInspeccion = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteInspeccion.push(result0.rows.item(i));
    }
    if (arrayDeleteInspeccion.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }




  async deleteAccountValores(cuenta) {
    let sql = "DELETE FROM gestionValoresCatastrales where account = ?";
    let sql_0 = "SELECT * FROM gestionValoresCatastrales where account = ?"
    let arrayDeleteValores = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayDeleteValores.push(result0.rows.item(i));
    }
    if (arrayDeleteValores.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }


  async deleteAccountsInspeccionPredio(cuenta) {
    let sql = 'DELETE FROM gestionInspeccionPredio where account = ?';
    let sql_0 = "SELECT * FROM gestionInspeccionPredio where account =?";
    let arrayGestionInspeccionPredio = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayGestionInspeccionPredio.push(result0.rows.item(i));
    }
    if (arrayGestionInspeccionPredio.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }

  async deleteAccountsInspeccionAgua(cuenta) {
    let sql = 'DELETE FROM gestionInspeccionAgua where account = ?';
    let sql_0 = "SELECT * FROM gestionInspeccionAgua where account =?";
    let arrayGestionInspeccionAgua = [];
    const result0 = await this.db.executeSql(sql_0, [cuenta]);
    for (let i = 0; i < result0.rows.length; i++) {
      arrayGestionInspeccionAgua.push(result0.rows.item(i));
    }
    if (arrayGestionInspeccionAgua.length == 0) {
      this.mensaje.showToastSync("No se pudo eliminar la cuenta, no se guardo la gestión correctamente");
    } else {
      this.updateGestionadaDelete(cuenta);
      console.log(`Borrando cuenta ${cuenta}`);
      return this.db.executeSql(sql, [cuenta]);
    }
  }


  updateGestionadaDelete(cuenta) {
    let sql = "UPDATE implementta SET gestionada = 0 where cuenta = ?";
    return this.db.executeSql(sql, [cuenta])
  }


  ///////////////////////////////////Sincronizacion al servidor SQL Server

  // sincronizar una sola gestion 
  async getAccountToSyncGestor(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayGestion = [];
      let sql = "SELECT * FROM gestionGestor where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayGestion.push(result.rows.item(i));
      }
      if (arrayGestion.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayGestion);
        let account = arrayGestion[0].account;
        let idEstatus = arrayGestion[0].idEstatus;
        let observaciones = arrayGestion[0].observaciones;
        let fechaPromesaPago = arrayGestion[0].fechaPromesaPago;
        let latitud = arrayGestion[0].latitud;
        let longitud = arrayGestion[0].longitud;
        let fechaCaptura = arrayGestion[0].fechaCaptura;
        let idAspUser = arrayGestion[0].idAspuser;
        let idTarea = arrayGestion[0].idTarea;
        let fechaAsignacion = arrayGestion[0].fechaAsignacion;
        let fechaVencimiento = arrayGestion[0].fechaVencimiento;
        let idMotivoNoPago = arrayGestion[0].idMotivoNoPago;
        let motivoNoPago = arrayGestion[0].motivoNoPago;
        let idSolucionPlanteada = arrayGestion[0].idSolucionPlanteada;
        let idExpectativasContribuyente = arrayGestion[0]
          .idExpectativasContribuyente;
        let otraExpectativaContribuyente = arrayGestion[0]
          .otraExpectativaContribuyente;
        let idCaracteristicaPredio = arrayGestion[0]
          .idCaracteristicaPredio;
        let otraCaracteristicaPredio = arrayGestion[0]
          .otraCaracteristicaPredio;
        let idServiciosNoPago = arrayGestion[0].idServiciosNoPago;
        let idTipoServicio = arrayGestion[0].idTipoServicio;
        let idEstatusToma = arrayGestion[0].idEstatusToma;
        let idTipoToma = arrayGestion[0].idTipoToma;
        let numeroMedidor = arrayGestion[0].numeroMedidor;
        let id = arrayGestion[0].id;
        let sqlString = `'${account}',${idEstatus},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaAsignacion}','${fechaVencimiento}',${idMotivoNoPago},'${motivoNoPago}',${idSolucionPlanteada},${idExpectativasContribuyente},'${otraExpectativaContribuyente}',${idCaracteristicaPredio},'${otraCaracteristicaPredio}',${idServiciosNoPago},${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma},'${numeroMedidor}'`;

        await this.accountSyncGestor(sqlString, id);
        //console.log(sqlString);
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }



  async getAccountToSyncAbogado(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayGestionAbogado = [];
      let sql = "SELECT * FROM gestionAbogado where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionAbogado.push(result.rows.item(i));
      }

      if (arrayGestionAbogado.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayGestionAbogado);
        let account = arrayGestionAbogado[0].account;
        let idResultado = arrayGestionAbogado[0].idResultado;
        let idPersona = arrayGestionAbogado[0].idPersona;
        let observaciones = arrayGestionAbogado[0].observaciones;
        let fechaPromesaPago = arrayGestionAbogado[0].fechaPromesaPago;
        let latitud = arrayGestionAbogado[0].latitud;
        let longitud = arrayGestionAbogado[0].longitud;
        let fechaCaptura = arrayGestionAbogado[0].fechaCaptura;
        let idAspUser = arrayGestionAbogado[0].idAspuser;
        let idTarea = arrayGestionAbogado[0].idTarea;
        let fechaVencimiento = arrayGestionAbogado[0].fechaVencimiento;
        let horaVencimiento = arrayGestionAbogado[0].fechaVencimiento;
        let idTipoServicio = arrayGestionAbogado[0].idTipoServicio;
        let idEstatusToma = arrayGestionAbogado[0].idEstatusToma;
        let idTipoToma = arrayGestionAbogado[0].idTipoToma;


        let id = arrayGestionAbogado[0].id;
        let sqlString = `'${account}',${idResultado},${idPersona},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaVencimiento}','${horaVencimiento}',${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma}`;

        await this.accountSyncAbogado(sqlString, id);

        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }


  async getAccountToSyncReductor(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayGestionReductor = [];
      let sql = "SELECT * FROM gestionReductor where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionReductor.push(result.rows.item(i));
      }

      if (arrayGestionReductor.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayGestionReductor);
        let account = arrayGestionReductor[0].account;
        let idTarea = arrayGestionReductor[0].idTarea;
        let idDescripcion = arrayGestionReductor[0].idDescripcion;
        let idObservacion = arrayGestionReductor[0].idObservaciones;
        let idAspUser = arrayGestionReductor[0].idaspuser;
        let lectura = arrayGestionReductor[0].lectura
        let conclusiones = arrayGestionReductor[0].conclusiones;
        let personaContacto = arrayGestionReductor[0].personaContacto;
        let telefonoContacto = arrayGestionReductor[0].telefonoContacto;
        let fechaPromesa = arrayGestionReductor[0].fechaPromesa;
        let fechaCaptura = arrayGestionReductor[0].fechaCaptura;
        let fechaProximaVisita = arrayGestionReductor[0].fechaProximaRev;
        let latitud = arrayGestionReductor[0].latitud
        let longitud = arrayGestionReductor[0].longitud;
        let idNiple = arrayGestionReductor[0].niple;
        let horaIni = arrayGestionReductor[0].horaIni;
        let horaFin = arrayGestionReductor[0].horaFin;
        let idTipoServicio = arrayGestionReductor[0].idTipoServicio;
        let idEstatusToma = arrayGestionReductor[0].idEstatusToma;
        let idTipoToma = arrayGestionReductor[0].idTipoToma;
        let descripcionTomaDirecta = arrayGestionReductor[0].descripcionTomaDirecta;
        let idDescripcionMulta = arrayGestionReductor[0].idDescripcionMulta;
        let idDetalle = arrayGestionReductor[0].idDetalle;
        let idMedidorTapado = arrayGestionReductor[0].idMedidorTapado;
        let idTipoReductor = arrayGestionReductor[0].idTipoReductor;
        let noCincho = arrayGestionReductor[0].noCincho;
        let idEstatusRequerimiento = arrayGestionReductor[0].idEstatusRequerimiento;


        let id = arrayGestionReductor[0].id;
        let sqlString = `'${account}',${idTarea},'${idObservacion}','${idDescripcion}','${idAspUser}','${lectura}','${conclusiones}','${personaContacto}','${telefonoContacto}','${fechaPromesa}','${fechaCaptura}','${fechaProximaVisita}','${latitud}','${longitud}',${idNiple},'${horaIni}','${horaFin}',${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma},'${descripcionTomaDirecta}',${idDescripcionMulta},${idDetalle},${idMedidorTapado},${idTipoReductor},'${noCincho}',${idEstatusRequerimiento}`;

        await this.accountSyncReductor(sqlString, id);
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }



  async getAccountToSyncInspeccion(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayInspeccion = [];
      let sql = "SELECT * FROM gestionInspeccion where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayInspeccion.push(result.rows.item(i));
      }

      if (arrayInspeccion.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayInspeccion);
        let account = arrayInspeccion[0].account;
        let clave = arrayInspeccion[0].clave;
        let serieMedidor = arrayInspeccion[0].serieMedidor;
        let idTipoClandestino = arrayInspeccion[0].idTipoClandestino;
        let idContratada = arrayInspeccion[0].idContratada;
        let descripcionClandestino = arrayInspeccion[0].descripcionClandestino;
        let idTipoServicioDetectado = arrayInspeccion[0].idTipoServicioDetectado;
        let idCondicionPredio = arrayInspeccion[0].idCondicionPredio;
        let descripcionCondicionPredio = arrayInspeccion[0].descripcionCondicionPredio;
        let idInstalacionesEncontradas = arrayInspeccion[0].idInstalacionesEncontradas;
        let idTomaMaterial = arrayInspeccion[0].idTomaMaterial;
        let diametroToma = arrayInspeccion[0].diametroToma;
        let serieMedidorDetectado = arrayInspeccion[0].serieMedidorDetectado;
        let lecturaMedidor = arrayInspeccion[0].lecturaMedidor;
        let idMarcaMedidor = arrayInspeccion[0].idMarcaMedidor;
        let diametroMedidor = arrayInspeccion[0].diametroMedidor;
        let idEstadoDescarga = arrayInspeccion[0].idEstadoDescarga;
        let observacion = arrayInspeccion[0].observacion;
        let idTarea = arrayInspeccion[0].idTarea;
        let idaspuser = arrayInspeccion[0].idaspuser;
        let fechaCaptura = arrayInspeccion[0].fechaCaptura;
        let latitud = arrayInspeccion[0].latitud;
        let longitud = arrayInspeccion[0].longitud;

        let id = arrayInspeccion[0].id;

        let sql = `'${account}','${clave}','${serieMedidor}',${idTipoClandestino},${idContratada},'${descripcionClandestino}',${idTipoServicioDetectado},${idCondicionPredio},'${descripcionCondicionPredio}',${idInstalacionesEncontradas},${idTomaMaterial},'${diametroToma}','${serieMedidorDetectado}',${lecturaMedidor},${idMarcaMedidor},'${diametroMedidor}',${idEstadoDescarga},'${observacion}',${idTarea},'${idaspuser}','${fechaCaptura}',${latitud},${longitud},${idPlaza}`
        console.log("idplaza", idPlaza);
        console.log(sql);
        await this.accountSyncInspeccion(sql, id)
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }



  async getAccountToSyncValores(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayValores = [];
      let sql = "SELECT * FROM gestionValoresCatastrales where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayValores.push(result.rows.item(i));
      }

      if (arrayValores.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayValores);
        let account = arrayValores[0].account;
        let supConstruccion = arrayValores[0].supConstruccion;
        let supTerreno = arrayValores[0].supTerreno;
        let valConstruccion = arrayValores[0].valConstruccion;
        let valTerreno = arrayValores[0].valTerreno;
        let valCatastral = arrayValores[0].valCatastral;
        let idTipoSuelo = arrayValores[0].idTipoSuelo;
        let observacion = arrayValores[0].observacion;
        let fechaCaptura = arrayValores[0].fechaCaptura;
        let idAspUser = arrayValores[0].idAspUser;
        let latitud = arrayValores[0].latitud;
        let longitud = arrayValores[0].longitud;


        let id = arrayValores[0].id;

        let sql = `'${account}',${supConstruccion},${supTerreno},${valConstruccion},${valTerreno},${valCatastral},${idTipoSuelo},'${observacion}','${idAspUser}','${fechaCaptura}',${latitud},${longitud},${idPlaza}`
        console.log("idplaza", idPlaza);
        console.log(sql);

        await this.accountSyncValores(sql, id)
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }


  async getAccountToSyncInspeccionPredio(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayInspeccionPredio = [];
      let sql = "SELECT * FROM gestionInspeccionPredio where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayInspeccionPredio.push(result.rows.item(i));
      }

      if (arrayInspeccionPredio.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayInspeccionPredio);
        let account = arrayInspeccionPredio[0].account;
        let claveCatastral = arrayInspeccionPredio[0].claveCatastral;
        let nombreContribuyente = arrayInspeccionPredio[0].nombreContribuyente;
        let direccion = arrayInspeccionPredio[0].direccion;
        let orden = arrayInspeccionPredio[0].orden;
        let usoSuelo = arrayInspeccionPredio[0].usoSuelo;
        let observaciones = arrayInspeccionPredio[0].observaciones;
        let avaluo = arrayInspeccionPredio[0].avaluo;
        let idAspUser = arrayInspeccionPredio[0].idAspUser;
        let inspector2 = arrayInspeccionPredio[0].inspector2;
        let inspector3 = arrayInspeccionPredio[0].inspector3;
        let inspector4 = arrayInspeccionPredio[0].inspector4;
        let idTarea = arrayInspeccionPredio[0].idTarea;
        let fechaCaptura = arrayInspeccionPredio[0].fechaCaptura;
        let latitud = arrayInspeccionPredio[0].latitud;
        let longitud = arrayInspeccionPredio[0].longitud;
        let id = arrayInspeccionPredio[0].id;
  
        let sql = `'${account}','${claveCatastral}','${nombreContribuyente}','${direccion}','${orden}','${usoSuelo}','${observaciones}','${avaluo}','${idAspUser}','${inspector2}','${inspector3}','${inspector4}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idPlaza}`;
        console.log("idplaza", idPlaza);
        console.log(sql);

        await this.accountSyncInspeccionPredio(sql, id)
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  async getAccountToSyncInspeccionAgua(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayInspeccionAgua = [];
      let sql = "SELECT * FROM gestionInspeccionAgua where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayInspeccionAgua.push(result.rows.item(i));
      }

      if (arrayInspeccionAgua.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayInspeccionAgua);
        //let account = arrayValores[0].account;
        let account = arrayInspeccionAgua[0].account;
        let cuenta = arrayInspeccionAgua[0].cuenta;
        let clave = arrayInspeccionAgua[0].clave;
        let ordenInspeccion = arrayInspeccionAgua[0].ordenInspeccion;
        let numeroMedidor = arrayInspeccionAgua[0].numeroMedidor;
        let idTipoServicio = arrayInspeccionAgua[0].idTipoServicio;
        let pozoConagua = arrayInspeccionAgua[0].pozoConagua;
        let idHallazgo = arrayInspeccionAgua[0].idHallazgo;
        let otroHallazgo = arrayInspeccionAgua[0].otroHallazgo;
        let idAspUser = arrayInspeccionAgua[0].idAspUser;
        let inspector2 = arrayInspeccionAgua[0].inspector2;
        let inspector3 = arrayInspeccionAgua[0].inspector3;
        let inspector4 = arrayInspeccionAgua[0].inspector4;
        let idTarea = arrayInspeccionAgua[0].idTarea;
        let fechaCaptura = arrayInspeccionAgua[0].fechaCaptura;
        let latitud = arrayInspeccionAgua[0].latitud;
        let longitud = arrayInspeccionAgua[0].longitud;
        let id = arrayInspeccionAgua[0].id;

        let sql = `'${account}','${cuenta}','${clave}','${ordenInspeccion}','${numeroMedidor}',${idTipoServicio},'${pozoConagua}',${idHallazgo},'${otroHallazgo}','${idAspUser}','${inspector2}','${inspector3}','${inspector4}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idPlaza}`;
        console.log("idplaza", idPlaza);
        console.log(sql);

        await this.accountSyncInspeccionAgua(sql, id)
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }


  async getAccountToSyncCartaInvitacion(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log("Sincronizando una sola cuenta al servidor");
    try {
      let arrayCarta = [];
      let sql = "SELECT * FROM gestionCartaInvitacion where cargado = 0 and account = ?"

      const result = await this.db.executeSql(sql, [cuenta]);

      for (let i = 0; i < result.rows.length; i++) {
        arrayCarta.push(result.rows.item(i));
      }

      if (arrayCarta.length === 0) {
        this.mensaje.showToastSync("Error en la cuenta, no se guardo la gestión correctamente");
      } else {
        console.log(arrayCarta);
        let account = arrayCarta[0].account;
        let latitud = arrayCarta[0].latitud;
        let longitud = arrayCarta[0].longitud;
        let fechaCaptura = arrayCarta[0].fechaCaptura;
        let idAspUser = arrayCarta[0].idaspuser;
        let idTarea = arrayCarta[0].idTarea;
        let idTipoServicio = arrayCarta[0].idTipoServicio;

        let id = arrayCarta[0].id;
        let sqlString = `'${account}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},${idPlaza},${idTipoServicio}`;
        console.log(sqlString);
        await this.accountSyncCartas(sqlString, id);
        this.mensaje.showToast("Sincronizacion de la cuenta correctamente");
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  async getAccountsToSyncInspeccionPredio() {
    console.log("getAccountsToSyncInspeccionPredio");
    try {
      let arrayGestionesInspeccionPredio = [];
      let sql = "SELECT * FROM gestionInspeccionPredio where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      console.log(result);
      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionesInspeccionPredio.push(result.rows.item(i));
      }
      if (arrayGestionesInspeccionPredio.length == 0) {
        this.mensaje.showToast('Sin registros para sincronizar');
      } else {
        this.avanceGestionesInspeccionPredio = 0;
        this.envioGestionesInspeccionPredio(arrayGestionesInspeccionPredio)
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  avanceGestionesInspeccionPredio = 0;


  envioGestionesInspeccionPredio(arrayGestionesInspeccionPredio) {
    console.log("envioGestionesInspeccionPredio");
    console.log(this.avanceGestionesInspeccionPredio);

    if (this.avanceGestionesInspeccionPredio === arrayGestionesInspeccionPredio.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccionPredio(this.avanceGestionesInspeccionPredio, arrayGestionesInspeccionPredio).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccionPredio++;
          this.envioGestionesInspeccionPredio(arrayGestionesInspeccionPredio);
        } else {
          this.envioGestionesInspeccionPredio(arrayGestionesInspeccionPredio);
        }
      })
    }
  }

  async sendGestionesInspeccionPredio(i, arrayGestionesInspeccionPredio) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestionesInspeccionPredio[i].account;
      let claveCatastral = arrayGestionesInspeccionPredio[i].claveCatastral;
      let nombreContribuyente = arrayGestionesInspeccionPredio[i].nombreContribuyente;
      let direccion = arrayGestionesInspeccionPredio[i].direccion;
      let orden = arrayGestionesInspeccionPredio[i].orden;
      let usoSuelo = arrayGestionesInspeccionPredio[i].usoSuelo;
      let observaciones = arrayGestionesInspeccionPredio[i].observaciones;
      let avaluo = arrayGestionesInspeccionPredio[i].avaluo;
      let idAspUser = arrayGestionesInspeccionPredio[i].idAspUser;
      let inspector2 = arrayGestionesInspeccionPredio[i].inspector2;
      let inspector3 = arrayGestionesInspeccionPredio[i].inspector3;
      let inspector4 = arrayGestionesInspeccionPredio[i].inspector4;
      let idTarea = arrayGestionesInspeccionPredio[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionPredio[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionPredio[i].latitud;
      let longitud = arrayGestionesInspeccionPredio[i].longitud;
      let id = arrayGestionesInspeccionPredio[i].id;

      let sql = `'${account}','${claveCatastral}','${nombreContribuyente}','${direccion}','${orden}','${usoSuelo}','${observaciones}','${avaluo}','${idAspUser}','${inspector2}','${inspector3}','${inspector4}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idPlaza}`;
      console.log("idplaza", idPlaza);
      console.log(sql);
      await this.accountSyncInspeccionPredio(sql, id)
      resolve('Execute Query successfully');
    })
  }



  async getAccountsToSyncInspeccionAgua() {
    console.log("getAccountsInspeccionAgua");
    try {
      let arrayGestionesInspeccionAgua = [];
      let sql = "SELECT * FROM gestionInspeccionAgua where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      console.log(result);
      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionesInspeccionAgua.push(result.rows.item(i));
      }
      if (arrayGestionesInspeccionAgua.length == 0) {
        this.mensaje.showToast('Sin registros para sincronizar');
      } else {
        this.avanceGestionesInspeccionAgua = 0;
        this.envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua)
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  avanceGestionesInspeccionAgua = 0;

  envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua) {
    console.log("envioGestionesInspeccionAgua");
    console.log(this.avanceGestionesInspeccionAgua);

    if (this.avanceGestionesInspeccionAgua === arrayGestionesInspeccionAgua.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccionAgua(this.avanceGestionesInspeccionAgua, arrayGestionesInspeccionAgua).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccionAgua++;
          this.envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua);
        } else {
          this.envioGestionesInspeccionAgua(arrayGestionesInspeccionAgua);
        }
      })
    }
  }


  async sendGestionesInspeccionAgua(i, arrayGestionesInspeccionAgua) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestionesInspeccionAgua[i].account;
      let cuenta = arrayGestionesInspeccionAgua[i].cuenta;
      let clave = arrayGestionesInspeccionAgua[i].clave;
      let ordenInspeccion = arrayGestionesInspeccionAgua[i].ordenInspeccion;
      let numeroMedidor = arrayGestionesInspeccionAgua[i].numeroMedidor;
      let idTipoServicio = arrayGestionesInspeccionAgua[i].idTipoServicio;
      let pozoConagua = arrayGestionesInspeccionAgua[i].pozoConagua;
      let idHallazgo = arrayGestionesInspeccionAgua[i].idHallazgo;
      let otroHallazgo = arrayGestionesInspeccionAgua[i].otroHallazgo;
      let idAspUser = arrayGestionesInspeccionAgua[i].idAspUser;
      let inspector2 = arrayGestionesInspeccionAgua[i].inspector2;
      let inspector3 = arrayGestionesInspeccionAgua[i].inspector3;
      let inspector4 = arrayGestionesInspeccionAgua[i].inspector4;
      let idTarea = arrayGestionesInspeccionAgua[i].idTarea;
      let fechaCaptura = arrayGestionesInspeccionAgua[i].fechaCaptura;
      let latitud = arrayGestionesInspeccionAgua[i].latitud;
      let longitud = arrayGestionesInspeccionAgua[i].longitud;
      let id = arrayGestionesInspeccionAgua[i].id;

      let sql = `'${account}','${cuenta}','${clave}','${ordenInspeccion}','${numeroMedidor}',${idTipoServicio},'${pozoConagua}',${idHallazgo},'${otroHallazgo}','${idAspUser}','${inspector2}','${inspector3}','${inspector4}',${idTarea},'${fechaCaptura}',${latitud},${longitud},${idPlaza}`;
      console.log("idplaza", idPlaza);
      console.log(sql);
      await this.accountSyncInspeccionAgua(sql, id)
      resolve('Execute Query successfully');
    })
  }


  async getAccountsToSyncValores() {
    console.log("getAccountsValores");
    try {
      let arrayGestionesValores = [];
      let sql = "SELECT * FROM gestionValoresCatastrales where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      console.log(result);
      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionesValores.push(result.rows.item(i));
      }
      console.log(arrayGestionesValores);
      if (arrayGestionesValores.length == 0) {
        this.mensaje.showToast('Sin gestiones para sincronizar');
      } else {
        this.avanceGestionesValores = 0;
        this.envioGestionesValores(arrayGestionesValores);
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  avanceGestionesValores = 0;


  envioGestionesValores(arrayGestionesValores) {
    console.log("envioGestionesValores");
    console.log(this.avanceGestionesValores);

    if (this.avanceGestionesValores === arrayGestionesValores.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesValores(this.avanceGestionesValores, arrayGestionesValores).then(resp => {
        if (resp) {
          this.avanceGestionesValores++;
          this.envioGestionesValores(arrayGestionesValores);
        } else {
          this.envioGestionesValores(arrayGestionesValores);
        }
      })
    }
  }

  async sendGestionesValores(i, arrayGestionesValores) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestionesValores[i].account;
      let supConstruccion = arrayGestionesValores[i].supConstruccion;
      let supTerreno = arrayGestionesValores[i].supTerreno;
      let valConstruccion = arrayGestionesValores[i].valConstruccion;
      let valTerreno = arrayGestionesValores[i].valTerreno;
      let valCatastral = arrayGestionesValores[i].valCatastral;
      let idTipoSuelo = arrayGestionesValores[i].idTipoSuelo;
      let observacion = arrayGestionesValores[i].observacion;
      let fechaCaptura = arrayGestionesValores[i].fechaCaptura;
      let idAspUser = arrayGestionesValores[i].idAspUser;
      let latitud = arrayGestionesValores[i].latitud;
      let longitud = arrayGestionesValores[i].longitud;


      let id = arrayGestionesValores[i].id;

      let sql = `'${account}',${supConstruccion},${supTerreno},${valConstruccion},${valTerreno},${valCatastral},${idTipoSuelo},'${observacion}','${idAspUser}','${fechaCaptura}',${latitud},${longitud},${idPlaza}`
      console.log("idplaza", idPlaza);
      console.log(sql);
      await this.accountSyncValores(sql, id)
      resolve('Execute Query successfully');
    })
  }


  async getAccountsToSyncInspeccion() {
    console.log("getAccountsToSyncInspeccion");
    try {
      let arrayGestionesInspeccion = [];
      let sql = "SELECT * FROM gestionInspeccion where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      console.log(result);

      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionesInspeccion.push(result.rows.item(i));
      }
      console.log(arrayGestionesInspeccion);
      if (arrayGestionesInspeccion.length == 0) {
        this.mensaje.showToast('Sin gestiones para sincronizar');
      } else {
        this.avanceGestionesInspeccion = 0;
        this.envioGestionesInspeccion(arrayGestionesInspeccion);
      }
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }

  avanceGestionesInspeccion = 0;

  envioGestionesInspeccion(arrayGestionesInspeccion) {
    console.log("envioGestionesInspeccion");
    console.log(this.avanceGestionesInspeccion);

    if (this.avanceGestionesInspeccion === arrayGestionesInspeccion.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestionesInspeccion(this.avanceGestionesInspeccion, arrayGestionesInspeccion).then(resp => {
        if (resp) {
          this.avanceGestionesInspeccion++;
          this.envioGestionesInspeccion(arrayGestionesInspeccion);
        } else {
          this.envioGestionesInspeccion(arrayGestionesInspeccion);
        }
      })
    }
  }

  async sendGestionesInspeccion(i, arrayGestionesInspeccion) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestionesInspeccion[i].account;
      let clave = arrayGestionesInspeccion[i].clave;
      let serieMedidor = arrayGestionesInspeccion[i].serieMedidor;
      let idTipoClandestino = arrayGestionesInspeccion[i].idTipoClandestino;
      let idContratada = arrayGestionesInspeccion[i].idContratada;
      let descripcionClandestino = arrayGestionesInspeccion[i].descripcionClandestino;
      let idTipoServicioDetectado = arrayGestionesInspeccion[i].idTipoServicioDetectado;
      let idCondicionPredio = arrayGestionesInspeccion[i].idCondicionPredio;
      let descripcionCondicionPredio = arrayGestionesInspeccion[i].descripcionCondicionPredio;
      let idInstalacionesEncontradas = arrayGestionesInspeccion[i].idInstalacionesEncontradas;
      let idTomaMaterial = arrayGestionesInspeccion[i].idTomaMaterial;
      let diametroToma = arrayGestionesInspeccion[i].diametroToma;
      let serieMedidorDetectado = arrayGestionesInspeccion[i].serieMedidorDetectado;
      let lecturaMedidor = arrayGestionesInspeccion[i].lecturaMedidor;
      let idMarcaMedidor = arrayGestionesInspeccion[i].idMarcaMedidor;
      let diametroMedidor = arrayGestionesInspeccion[i].diametroMedidor;
      let idEstadoDescarga = arrayGestionesInspeccion[i].idEstadoDescarga;
      let observacion = arrayGestionesInspeccion[i].observacion;
      let idTarea = arrayGestionesInspeccion[i].idTarea;
      let idaspuser = arrayGestionesInspeccion[i].idaspuser;
      let fechaCaptura = arrayGestionesInspeccion[i].fechaCaptura;
      let latitud = arrayGestionesInspeccion[i].latitud;
      let longitud = arrayGestionesInspeccion[i].longitud;

      let id = arrayGestionesInspeccion[i].id;

      let sql = `'${account}','${clave}','${serieMedidor}',${idTipoClandestino},${idContratada},'${descripcionClandestino}',${idTipoServicioDetectado},${idCondicionPredio},'${descripcionCondicionPredio}',${idInstalacionesEncontradas},${idTomaMaterial},'${diametroToma}','${serieMedidorDetectado}',${lecturaMedidor},${idMarcaMedidor},'${diametroMedidor}',${idEstadoDescarga},'${observacion}',${idTarea},'${idaspuser}','${fechaCaptura}',${latitud},${longitud},${idPlaza}`
      console.log("idplaza", idPlaza);
      console.log(sql);
      await this.accountSyncInspeccion(sql, id)
      resolve('Execute Query successfully');
    })
  }




  async getAccoutsToSyncGestor() {

    console.log("getAccoutsToSyncGestor")

    try {
      let arrayGestiones = [];
      let sql = "SELECT * FROM gestionGestor where cargado = 0";

      const result = await this.db.executeSql(sql, []);


      for (let i = 0; i < result.rows.length; i++) {
        arrayGestiones.push(result.rows.item(i));
      }

      console.log(arrayGestiones);

      if (arrayGestiones.length == 0) {
        this.mensaje.showToast('Sin gestiones para sincronizar');
      } else {
        this.avanceGestiones = 0;
        this.envioGestiones(arrayGestiones);
      }

    } catch (error_1) {

      return Promise.reject(error_1);
    }
  } // getAccoutsToSyncGestor

  avanceGestiones = 0;

  envioGestiones(arrayGestiones) {
    console.log("envioGestiones");
    console.log(this.avanceGestiones);

    if (this.avanceGestiones === arrayGestiones.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendGestiones(this.avanceGestiones, arrayGestiones).then(resp => {
        if (resp) {
          this.avanceGestiones++;
          this.envioGestiones(arrayGestiones);
        } else {
          this.envioGestiones(arrayGestiones);
        }
      })
    }
  }

  async sendGestiones(i, arrayGestiones) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestiones[i].account;
      let idEstatus = arrayGestiones[i].idEstatus;
      let observaciones = arrayGestiones[i].observaciones;
      let fechaPromesaPago = arrayGestiones[i].fechaPromesaPago;
      let latitud = arrayGestiones[i].latitud;
      let longitud = arrayGestiones[i].longitud;
      let fechaCaptura = arrayGestiones[i].fechaCaptura;
      let idAspUser = arrayGestiones[i].idAspuser;
      let idTarea = arrayGestiones[i].idTarea;
      let fechaAsignacion = arrayGestiones[i].fechaAsignacion;
      let fechaVencimiento = arrayGestiones[i].fechaVencimiento;
      let idMotivoNoPago = arrayGestiones[i].idMotivoNoPago;
      let motivoNoPago = arrayGestiones[i].motivoNoPago;
      let idSolucionPlanteada = arrayGestiones[i].idSolucionPlanteada;
      let idExpectativasContribuyente = arrayGestiones[i]
        .idExpectativasContribuyente;
      let otraExpectativaContribuyente = arrayGestiones[i]
        .otraExpectativaContribuyente;
      let idCaracteristicaPredio = arrayGestiones[i]
        .idCaracteristicaPredio;
      let otraCaracteristicaPredio = arrayGestiones[i]
        .otraCaracteristicaPredio;
      let idServiciosNoPago = arrayGestiones[i].idServiciosNoPago;
      let idTipoServicio = arrayGestiones[i].idTipoServicio;
      let idEstatusToma = arrayGestiones[i].idEstatusToma;
      let idTipoToma = arrayGestiones[i].idTipoToma;
      let numeroMedidor = arrayGestiones[i].numeroMedidor;
      let id = arrayGestiones[i].id;
      let sqlString = `'${account}',${idEstatus},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaAsignacion}','${fechaVencimiento}',${idMotivoNoPago},'${motivoNoPago}',${idSolucionPlanteada},${idExpectativasContribuyente},'${otraExpectativaContribuyente}',${idCaracteristicaPredio},'${otraCaracteristicaPredio}',${idServiciosNoPago},${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma},'${numeroMedidor}'`;

      await this.accountSyncGestor(sqlString, id);

      resolve('Execute Query successfully');

    })
  }


  // Metodo donde se empieza a sincronizar las cuentas, lo manda a llamar sync gestor page
  async getAccoutsToSyncCartaInvitacion() {
    console.log("getAccoutsToSyncCartaInvitacion")

    try {
      let arrayCartas = [];
      let sql = "SELECT * FROM gestionCartaInvitacion where cargado = 0";

      const result = await this.db.executeSql(sql, []);


      for (let i = 0; i < result.rows.length; i++) {
        arrayCartas.push(result.rows.item(i));
      }

      console.log(arrayCartas);

      if (arrayCartas.length == 0) {
        this.mensaje.showToast('Sin gestiones para sincronizar');
      } else {
        this.avanceCartas = 0;
        this.envioCartas(arrayCartas);
      }

    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }


  avanceCartas = 0;

  // metodo que hace la revision de lo enviado
  envioCartas(arrayCartas) {
    console.log("envioCartas");
    console.log(this.avanceCartas);

    if (this.avanceCartas === arrayCartas.length) {
      this.mensaje.showToastLarge('Sincronizacion de sus gestiones correctas');
    } else {
      this.sendCartas(this.avanceCartas, arrayCartas).then(resp => {
        if (resp) {
          this.avanceCartas++;
          this.envioCartas(arrayCartas);
        } else {
          this.envioCartas(arrayCartas);
        }
      })
    }
  }

  // metodo que obtiene la informacion y empieza a sincronizar los registros
  async sendCartas(i, arrayCartas) {
    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayCartas[i].account;
      let latitud = arrayCartas[i].latitud;
      let longitud = arrayCartas[i].longitud;
      let fechaCaptura = arrayCartas[i].fechaCaptura;
      let idAspUser = arrayCartas[i].idaspuser;
      let idTarea = arrayCartas[i].idTarea;
      let idTipoServicio = arrayCartas[i].idTipoServicio;
      let numeroMedidor = arrayCartas[i].numeroMedidor;

      let id = arrayCartas[i].id;
      let sqlString = `'${account}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},${idPlaza},${idTipoServicio},'${numeroMedidor}'`;
      console.log(sqlString);
      await this.accountSyncCartas(sqlString, id);

      resolve('Execute Query successfully');

    })
  }




  async getAccoutsToSyncAbogado() {

    try {
      let arrayGestionesAbogado = [];
      let sql = "SELECT * FROM gestionAbogado where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      for (let i = 0; i < result.rows.length; i++) {
        arrayGestionesAbogado.push(result.rows.item(i));
      }
      console.log(arrayGestionesAbogado);

      if (arrayGestionesAbogado.length == 0) {
        this.mensaje.showToast('Sin registros para sincronizar');
      } else {
        this.avanceGestionesAbogado = 0;
        this.envioGestionesAbogado(arrayGestionesAbogado);
      }

    } catch (error_1) {
      //    this.loading.dismiss();
      return Promise.reject(error_1);
    }
  }

  avanceGestionesAbogado = 0;

  envioGestionesAbogado(arrayGestionesAbogado) {
    console.log(this.avanceGestionesAbogado);
    if (this.avanceGestionesAbogado == arrayGestionesAbogado.length) {
      this.mensaje.showToastLarge('Sincronizacion de gestiones legales correctas');
    } else {
      this.sendGestionesAbogado(this.avanceGestionesAbogado, arrayGestionesAbogado).then(resp => {
        if (resp) {
          this.avanceGestionesAbogado++;
          this.envioGestionesAbogado(arrayGestionesAbogado);
        } else {
          this.envioGestionesAbogado(arrayGestionesAbogado);
        }
      })
    }
  }

  async sendGestionesAbogado(i, arrayGestionesAbogado) {

    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {
      let account = arrayGestionesAbogado[i].account;
      let idResultado = arrayGestionesAbogado[i].idResultado;
      let idPersona = arrayGestionesAbogado[i].idPersona;
      let observaciones = arrayGestionesAbogado[i].observaciones;
      let fechaPromesaPago = arrayGestionesAbogado[i].fechaPromesaPago;
      let latitud = arrayGestionesAbogado[i].latitud;
      let longitud = arrayGestionesAbogado[i].longitud;
      let fechaCaptura = arrayGestionesAbogado[i].fechaCaptura;
      let idAspUser = arrayGestionesAbogado[i].idAspuser;
      let idTarea = arrayGestionesAbogado[i].idTarea;
      let fechaVencimiento = arrayGestionesAbogado[i].fechaVencimiento;
      let horaVencimiento = arrayGestionesAbogado[i].fechaVencimiento;
      let idTipoServicio = arrayGestionesAbogado[i].idTipoServicio;
      let idEstatusToma = arrayGestionesAbogado[i].idEstatusToma;
      let idTipoToma = arrayGestionesAbogado[i].idTipoToma;


      let id = arrayGestionesAbogado[i].id;
      let sqlString = `'${account}',${idResultado},${idPersona},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaVencimiento}','${horaVencimiento}',${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma}`;

      await this.accountSyncAbogado(sqlString, id);

      resolve('Execute Query successfully');
    })

  }



  async getAccoutsToSyncReductor() {


    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM gestionReductor where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      if (result.rows.length === 0) {
        this.mensaje.showToastSync("No hay registros para sincronizar");
        //    this.loading.dismiss();
      } else {
        console.log(result);
        for (let i = 0; i < result.rows.length; i++) {
          //this.sicronizadoUpdate(result.rows.item(i).id);

          let account = result.rows.item(i).account;
          let idTarea = result.rows.item(i).idTarea;
          let idDescripcion = result.rows.item(i).idDescripcion;
          let idObservacion = result.rows.item(i).idObservaciones;
          let idAspUser = result.rows.item(i).idaspuser;
          let lectura = result.rows.item(i).lectura
          let conclusiones = result.rows.item(i).conclusiones;
          let personaContacto = result.rows.item(i).personaContacto;
          let telefonoContacto = result.rows.item(i).telefonoContacto;
          let fechaPromesa = result.rows.item(i).fechaPromesa;
          let fechaCaptura = result.rows.item(i).fechaCaptura;
          let fechaProximaVisita = result.rows.item(i).fechaProximaRev;
          let latitud = result.rows.item(i).latitud
          let longitud = result.rows.item(i).longitud;
          let idNiple = result.rows.item(i).niple;
          let horaIni = result.rows.item(i).horaIni;
          let horaFin = result.rows.item(i).horaFin;
          let idTipoServicio = result.rows.item(i).idTipoServicio;
          let idEstatusToma = result.rows.item(i).idEstatusToma;
          let idTipoToma = result.rows.item(i).idTipoToma;
          let descripcionTomaDirecta = result.rows.item(i).descripcionTomaDirecta;
          let idDescripcionMulta = result.rows.item(i).idDescripcionMulta;
          let idDetalle = result.rows.item(i).idDetalle;
          let idMedidorTapado = result.rows.item(i).idMedidorTapado;
          let idTipoReductor = result.rows.item(i).idTipoReductor;
          let noCincho = result.rows.item(i).noCincho;
          let idEstatusRequerimiento = result.rows.item(i).idEstatusRequerimiento;

          let id = result.rows.item(i).id;
          let sqlString = `'${account}',${idTarea},'${idObservacion}','${idDescripcion}','${idAspUser}','${lectura}','${conclusiones}','${personaContacto}','${telefonoContacto}','${fechaPromesa}','${fechaCaptura}','${fechaProximaVisita}','${latitud}','${longitud}',${idNiple},'${horaIni}','${horaFin}',${idPlaza},${idTipoServicio},${idEstatusToma},${idTipoToma},'${descripcionTomaDirecta}',${idDescripcionMulta},${idDetalle},${idMedidorTapado},${idTipoReductor},'${noCincho}',${idEstatusRequerimiento}`;
          console.log(sqlString);
          await this.accountSyncReductor(sqlString, id);
        }
        //  this.loading.dismiss();
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      //  this.loading.dismiss();
      return Promise.reject(error_1);
    }
  }


  async accountSyncInspeccion(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiurl17 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncInspeccion(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }

  async accountSyncValores(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiurl18 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncValores(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }


  async accountSyncInspeccionPredio(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiurl21 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncInspeccionPredio(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }

  async accountSyncInspeccionAgua(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiurl20 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncInspeccionAgua(id);
          console.log(data);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }





  async accountSyncGestor(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl6 + " " + query, null).subscribe(
        async data => {

          await this.updateAccountSyncGestor(id);
          //    console.log(data)
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }

  async accountSyncCartas(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiurl14 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncCartas(id);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    })
  }

  async accountSyncAbogado(query, id) {
    console.log(query);
    return new Promise(resolve => {
      this.http.post(this.apiUrl61 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncAbogado(id);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }
  async accountSyncReductor(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl62 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncReductor(id);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }
  updateStatusLoadAgain(rol) {
    if (rol == '2') {
      let sql = "UPDATE gestionAbogado SET cargado = 0 where cargado = 1";
      let sql2 = "UPDATE gestionGestor SET cargado = 0 where cargado = 1";
      let sql3 = "UPDATE gestionCartaInvitacion SET cargado = 0 where cargado = 1";
      let sql4 = "UPDATE gestionValoresCatastrales SET cargado = 0 where cargado = 1"
      let sql5 = "UPDATE gestionInspeccion SET cargado = 0 where cargado = 1"
      this.db.executeSql(sql, null);
      this.db.executeSql(sql2, null);
      this.db.executeSql(sql3, null);
      this.db.executeSql(sql4, null);
      this.db.executeSql(sql5, null);
    }
    else if (rol == '5') {
      let sql = "UPDATE gestionGestor SET cargado = 0 where cargado = 1";
      let sql3 = "UPDATE gestionCartaInvitacion SET cargado = 0 where cargado = 1";
      let sql4 = "UPDATE gestionValoresCatastrales SET cargado = 0 where cargado = 1"
      let sql5 = "UPDATE gestionInspeccion SET cargado = 0 where cargado = 1"
      this.db.executeSql(sql, null);
      this.db.executeSql(sql3, null);
      this.db.executeSql(sql4, null);
      this.db.executeSql(sql5, null);

    } else if (rol == '7') {
      let sql = "UPDATE gestionReductor SET cargado = 0 where cargado = 1";
      let sql2 = "UPDATE gestionGestor SET cargado = 0 where cargado = 1";
      let sql3 = "UPDATE gestionCartaInvitacion SET cargado = 0 where cargado = 1";
      let sql4 = "UPDATE gestionAbogado SET cargado = 0 where cargado = 1";
      let sql5 = "UPDATE gestionValoresCatastrales SET cargado = 0 where cargado = 1"
      let sql6 = "UPDATE gestionInspeccion SET cargado = 0 where cargado = 1"
      this.db.executeSql(sql, null);
      this.db.executeSql(sql2, null);
      this.db.executeSql(sql3, null);
      this.db.executeSql(sql4, null);
      this.db.executeSql(sql5, null);
      this.db.executeSql(sql6, null);
    }
  }
  updateRecorridoSync(id) {
    let sql = "UPDATE recorrido SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncInspeccion(id) {
    let sql = "UPDATE gestionInspeccion SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncValores(id) {
    let sql = "UPDATE gestionValoresCatastrales SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncInspeccionAgua(id) {
    let sql = "UPDATE gestionInspeccionAgua SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncInspeccionPredio(id) {
    let sql = "UPDATE gestionInspeccionPredio SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncGestor(id) {
    let sql = "UPDATE gestionGestor SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncCartas(id) {
    let sql = "UPDATE gestionCartaInvitacion SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  updateAccountSyncAbogado(id) {
    let sql = "UPDATE gestionAbogado SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  updateAccountSyncDomicilios(id) {
    let sql = "UPDATE domicilios SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  updateAccountSyncDatosPropietario(id) {
    let sql = "UPDATE propietario SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  deleteDataUpdatedAddress(id) {
    let sql = "DELETE FROM domicilios where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  deleteDataUpdatedUser(id) {
    let sql = "DELETE FROM propietario where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  updateAccountSyncReductor(id) {
    let sql = "UPDATE gestionReductor SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  updateAccountGestionada(id) {
    let sql = "UPDATE implementta SET gestionada = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }

  async getTotalaccounts() {
    let sql = "SELECT count(*)as total FROM implementta";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).total;

      return Promise.resolve(result);
    } catch (error) {
      return await Promise.reject(error);
    }
  }
  async getTotalaccountsManagded() {
    let sql =
      "SELECT count(*)as totalGestionadas FROM implementta where gestionada = 1";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).totalGestionadas;
      return Promise.resolve(result);
    } catch (error) {
      return await Promise.reject(error);
    }
  }
  async getTotalAccountsDebt() {
    let sql = "SELECT sum(adeudo)as adeudo FROM implementta";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).adeudo;
      return Promise.resolve(result);
    } catch (error) {
      return await Promise.reject(error);
    }
  }
  async getTotalAccountsPaid() {
    let sql = "SELECT count(*) as pagadas FROM implementta where adeudo=0";
    try {
      const response = await this.db.executeSql(sql, []);
      let result = response.rows.item(0).pagadas;
      return Promise.resolve(result);
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  setPropietario(data) {
    let sql =
      "INSERT INTO propietario (cuenta,nombre,telefono,celular,correo,fecha, fechaCaptura, idaspUser, idRol, type) values(?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      data.cuenta,
      data.nombre,
      data.telefono,
      data.celular,
      data.correo,
      data.fecha,
      data.fechaCaptura,
      data.idaspUser,
      data.idRol,
      data.type
    ]);
  }

  setDireccion(data) {
    console.log(data)

    let sql =
      "INSERT INTO domicilios(cuenta ,calle , manzana , lote,numExt , numInterior , colonia, poblacion , cp , entreCalle1 , entreCalle2,referencia,fechaCaptura, idaspUser, idRol,type) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return this.db.executeSql(sql, [
      data.cuenta,
      data.calle,
      data.manzana,
      data.lote,
      data.numExt,
      data.numInt,
      data.colonia,
      data.poblacion,
      data.cp,
      data.calle1,
      data.calle2,
      data.referencia,
      data.fechaCaptura,
      data.idaspUser,
      data.idRol,
      data.type
    ]).then(data => {
      console.log(data)
    });
  }

  getPropietario() {
    let sql = "SELECT * from propietario where cargado = 0";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let propietario = [];

        for (let index = 0; index < response.rows.length; index++) {
          propietario.push(response.rows.item(index));
        }

        return Promise.resolve(propietario);
      })
      .catch(error => Promise.reject(error));
  }
  getUsuario() {
    let sql = "SELECT * from usuario where cargado = 0";
    return this.db
      .executeSql(sql, [])
      .then(response => {
        let usuario = [];

        for (let index = 0; index < response.rows.length; index++) {
          usuario.push(response.rows.item(index));
        }

        return Promise.resolve(usuario);
      })
      .catch(error => Promise.reject(error));
  }

  async getDireccion() {
    let sql = "SELECT * from domicilios where cargado = 0";
    try {
      const response = await this.db
        .executeSql(sql, []);
      let notificacion = [];
      for (let index = 0; index < response.rows.length; index++) {
        notificacion.push(response.rows.item(index));
      }
      return Promise.resolve(notificacion);
    }
    catch (error) {
      return await Promise.reject(error);
    }
  }

  async syncRecorrido() {
    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM recorrido where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      console.log(result);
      for (let i = 0; i < result.rows.length; i++) {
        //this.sicronizadoUpdate(result.rows.item(i).id);

        let latitud = result.rows.item(i).latitud;
        let longitud = result.rows.item(i).longitud;
        let fechaCaptura = result.rows.item(i).fechaCaptura;
        let idAspUser = result.rows.item(i).idAspuser;
        let id = result.rows.item(i).id;
        let sqlString = `${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idPlaza}`;

        this.recorridoSync(sqlString, id);
      }

      return Promise.resolve("Executed query");
    } catch (error_1) {
      return Promise.reject(error_1);
    }
  }
  async recorridoSync(query, id) {
    return new Promise(resolve => {
      this.http.post(this.apiUrl7 + " " + query, null).subscribe(
        async data => {
          await this.updateRecorridoSync(id);
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }

  async syncActualizacionDatosPropietario() {

    try {
      let arrayPropietarios = [];
      let sql = "SELECT * FROM propietario where cargado = 0";
      const result = await this.db.executeSql(sql, []);

      for (let i = 0; i < result.rows.length; i++) {
        arrayPropietarios.push(result.rows.item(i));
      }

      console.log(arrayPropietarios);

      if (arrayPropietarios.length == 0) {
        this.mensaje.showToast("Sin datos para sincronizar");
      } else {
        this.loading = await this.loadingCtrl.create({
          message: 'Espere mientras se sincronizan sus Datos'
        });
        await this.loading.present();
        this.avancePropietarios = 0;
        this.envioDatosPropietarios(arrayPropietarios);

      }

    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }

  avancePropietarios = 0;
  envioDatosPropietarios(arrayPropietarios) {
    console.log('Avance propietarios', this.avancePropietarios);
    if (this.avancePropietarios === arrayPropietarios.length) {
      this.loading.dismiss();
      this.mensaje.showAlert("Se subio correctamente la informacion");
    } else {
      this.sendPropietario(this.avancePropietarios, arrayPropietarios).then(resp => {
        if (resp) {
          this.avancePropietarios++;
          this.envioDatosPropietarios(arrayPropietarios);
        } else {
          this.envioDatosPropietarios(arrayPropietarios);
        }
      })
    }
  }


  async sendPropietario(i, arrayPropietarios) {

    let idPlaza = await this.storage.get("IdPlaza");

    return new Promise(async (resolve) => {

      let account = arrayPropietarios[i].cuenta;
      let nombre = arrayPropietarios[i].nombre;
      let telefono = arrayPropietarios[i].telefono;
      let celular = arrayPropietarios[i].celular;
      let correo = arrayPropietarios[i].correo;
      let fecha = arrayPropietarios[i].fecha;
      let fechaCaptura = arrayPropietarios[i].fechaCaptura;
      let idaspUser = arrayPropietarios[i].idaspUser;
      let idRol = arrayPropietarios[i].idRol;
      let type = arrayPropietarios[i].type;

      let id = arrayPropietarios[i].id;
      let sqlString = `'${account}','${nombre}','${telefono}','${celular}','${correo}','${fecha}','${fechaCaptura}','${idaspUser}','${idRol}',${type},${idPlaza}`;

      await this.accountSyncDatosPropietario(sqlString, id);

      resolve("Execute Query")

    });
  }


  async syncActualizacionDatosDomicilios() {

    try {
      console.log("Entrando a SyncActualizaDomicilios");
      let sql = "SELECT * FROM domicilios where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      let arrayDomicilios = [];

      for (let i = 0; i < result.rows.length; i++) {
        arrayDomicilios.push(result.rows.item(i));
      }

      console.log(arrayDomicilios);

      if (arrayDomicilios.length == 0) {
        this.mensaje.showToast('Sin domicilios para sincronizar');
      } else {
        this.loading = await this.loadingCtrl.create({
          message: 'Espere se estan sicronizando sus domicilios'
        });
        await this.loading.present();
        this.avanceDomicilios = 0;
        this.envioDatosDomicilios(arrayDomicilios);

      }

    } catch (error_1) {

      return Promise.reject(error_1);
    }
  }
  avanceDomicilios = 0;

  envioDatosDomicilios(arrayDomicilios) {
    console.log('Avance domicilios', this.avanceDomicilios)
    if (this.avanceDomicilios === arrayDomicilios.length) {
      this.loading.dismiss();
      this.mensaje.showAlert("Se subieron correctamente los domicilios");
    } else {
      this.sendDomicilio(this.avanceDomicilios, arrayDomicilios).then(resp => {
        if (resp) {
          this.avanceDomicilios++
          this.envioDatosDomicilios(arrayDomicilios);
        } else {
          this.envioDatosDomicilios(arrayDomicilios);
        }
      })
    }
  }

  async sendDomicilio(i, arrayDomicilios) {
    let idPlaza = await this.storage.get("IdPlaza");
    return new Promise(async (resolve) => {
      let account = arrayDomicilios[i].cuenta
      let calle = arrayDomicilios[i].calle;
      let manzana = arrayDomicilios[i].manzana;
      let lote = arrayDomicilios[i].lote;
      let numExt = arrayDomicilios[i].numExt;
      let numInt = arrayDomicilios[i].numInterior;
      let colonia = arrayDomicilios[i].colonia;
      let poblacion = arrayDomicilios[i].poblacion;
      let cp = arrayDomicilios[i].cp;
      let calle1 = arrayDomicilios[i].entreCalle1;
      let calle2 = arrayDomicilios[i].entreCalle2;
      let referencia = arrayDomicilios[i].referencia;
      let fechaCaptura = arrayDomicilios[i].fechaCaptura;
      let idaspUser = arrayDomicilios[i].idaspUser;
      let idRol = arrayDomicilios[i].idRol;
      let type = arrayDomicilios[i].type;
      let id = arrayDomicilios[i].id;

      calle = calle.replace("#", "No.");
      //   console.log(calle)
      let sqlString = `'${account}','${calle}','${manzana}','${lote}','${numExt}','${numInt}','${colonia}','${poblacion}','${cp}','${calle1}','${calle2}','${referencia}','${fechaCaptura}','${idaspUser}','${idRol}',${type} ,${idPlaza}`;

      await this.accountSyncDomicilios(sqlString, id);

      resolve("Execute Query");
    });
  }


  async accountSyncDomicilios(query, id) {
    //console.log(query);
    return new Promise(resolve => {
      this.http.post(this.apiUrl11 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncDomicilios(id);
          this.mensaje.showToastSync('Registro(s) sincronizado(s)')
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }
  async accountSyncDatosPropietario(query, id) {
    //console.log(query);
    return new Promise(resolve => {
      this.http.post(this.apiUrl12 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncDatosPropietario(id);
          this.mensaje.showToastSync('Registro(s) sincronizado(s)')
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo " + err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }


  async guardarSQl(lat, lng, idasp, fecha) {
    let idPlaza = await this.storage.get("IdPlaza");

    let sqlString = `${lat},${lng},'${fecha}','${idasp}',${idPlaza}`;

    this.recorridoSync(sqlString, 0);


    return Promise.resolve("Executed query");

  }


  // async getIdPlazaUser() {
  //   let idPlaza = await this.storage.get("IdPlaza");
  //   console.log(idPlaza);
  //   return new Promise((resolve) => {
  //     this.http.get(this.apiurl13 + " " + idPlaza).subscribe(data => {
  //       console.log(data);
  //       resolve(data);
  //     })
  //   })
  //   // return idPlaza;
  // }

  // this.apiUrl0 + " " + '"' + idaspuser + '"' + "," + idplaza,
  async getHistorialAcciones(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log(cuenta);
    return new Promise((resolve) => {
      this.http.get(this.apiurl15 + " " + idPlaza + ", " + "'" + cuenta + "'").subscribe(data => {
        resolve(data);
        console.log(data);
      })
    })


  }

  async getCuentaPadron(cuenta) {
    let idPlaza = await this.storage.get("IdPlaza");
    console.log(`el idPlaza = ${idPlaza} y la cuenta es ${cuenta}`);
    return new Promise((resolve) => {
      this.http.get(this.apiurl16 + " " + idPlaza + ", " + "'" + cuenta + "'").subscribe(data => {
        resolve(data);
        console.log(data);
      })
    })
  }


  getNombreInspectores(idPlaza) {
    return this.http.get<any>(this.apiurl19 + ' ' + idPlaza);
  }

}
