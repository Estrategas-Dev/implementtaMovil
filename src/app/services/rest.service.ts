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

export interface Dev {
  id: number,
  cuenta: string,
  full: string,
  nombre_propietario: string,
  latitud: string,
  longitud: string,
  calle_predio : string,
  adeudo: string,
  gestionada: string,
  colonia_predio : string
}

@Injectable({
  providedIn: "root"
})


export class RestService {
  
  list = new BehaviorSubject([]);
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  arrayUrls : any
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
    apiUrl12=
    "https://implementta.net/andro/ImplementtaMovil.aspx?query=sp_actualizaDatos";
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

    this.arrayUrls= [];
  }

  setDatabase(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }
////////////////getdalalist con observable
getList(){
this.loadList();
console.log('si hizo este pedo')
console.log(this.list)
  return this.list.asObservable()
}
   loadList(){
    let sql = `SELECT id,gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL order by nombre_propietario`;
     this.db.executeSql(sql, []).then(data => {
      let list: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {

          list.push({ 
            id: data.rows.item(i).id,
            cuenta: data.rows.item(i).cuenta, 
            full:data.rows.item(i).full, 
            nombre_propietario:data.rows.item(i).nombre_propietario, 
            latitud:data.rows.item(i).latitud, 
            longitud: data.rows.item(i).longitud,
            calle_predio: data.rows.item(i).calle_predio,
            adeudo : data.rows.item(i).adeudo,
            gestionada : data.rows.item(i).gestionada,
            colonia_predio : data.rows.item(i).colonia_predio
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

  async getTotalPhotos(){
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
async  uploadPhoto(id){
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
     this.s3Service.uploadS3(imagenString, imageName);
      let UrlOriginal: any;
      UrlOriginal =  this.s3Service.getURLPresignaded(imageName);
      console.log('La url::::::')
      console.log(UrlOriginal)
       await  this.saveSqlServer(arrayImages[0].cuenta,arrayImages[0].idAspUser,imageName,idTarea,arrayImages[0].fecha,arrayImages[0].tipo,arrayImages[0].id,UrlOriginal,arrayImages[0].ruta,1);

    } catch (err_1) {
      alert(err_1)
      return console.log(err_1);
    }


  },
  err => {
    alert(err)
    console.log(err);

  }
);


}
 reloadAllPhotos(){
   let sql ='UPDATE capturaFotos set cargado = 0'
   return this.db.executeSql(sql,null)
 }

reloadPhotosDate( fechaInicio, fechaFinal) {
  let sql = `UPDATE capturaFotos set cargado = 0 where DATE( substr(fecha,1,4) || '-' || substr(fecha,6,2) || '-' || substr(fecha,9,2) ) BETWEEN '${fechaInicio}' AND '${fechaFinal}'`
  //let sql = `UPDATE capturaFotos set cargado = 0 where DATE( substr(fecha,1,4) || '-' || substr(fecha,6,2) || '-' || substr(fecha,9,2) ) BETWEEN DATE( substr(${fechaInicio},1,4) || '-' || substr(${fechaInicio},6,2) || '-' || substr(${fechaInicio},9,2) )  AND DATE( substr(${fechaFinal},1,4) || '-' || substr(${fechaFinal},6,2) || '-' || substr(${fechaFinal},9,2) )`;
  //let sql = `UPDATE capturaFotos set cargado = 0 where fecha BETWEEN '${fechaInicio}' and '${fechaFinal}'`
  //this.mensaje.showAlert(sql);
  return this.db.executeSql(sql, null);
}

 reloadAllAddress(){
  let sql ='UPDATE domicilios set cargado = 0'
  return this.db.executeSql(sql,null)
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

      for (let i = 0;i< arrayImages.length;i++) {
       await this.base64.encodeFile(arrayImages[i].rutaBase64).then(async (base64File: string) => {
         
            let imageName = arrayImages[i].cuenta + arrayImages[i].fecha;
            let imagen64 = base64File.split(",");
            let imagenString = imagen64[1];
            let idTarea = arrayImages[i].idTarea;
            if (idTarea == null) { idTarea = 0; }
            await this.uploadPhotoS3V1(arrayImages[i].cuenta,arrayImages[i].idAspUser, idTarea, arrayImages[i].fecha,arrayImages[i].tipo, imagenString,imageName, arrayImages[i].id,arrayImages[i].rutaBase64,i+1);

          },
          err => {
            alert(err)
            console.log(err);
            this.loading.dismiss();
          }
        );
      }
  
      this.loading.dismiss();
    }
  }

  async uploadPhotoS3V1(cuenta,idAspuser,idTarea,fecha,tipo,base64File,imageName,id,ruta,cont) {
    try {
      this.s3Service.uploadS3(base64File, imageName);
      let UrlOriginal: any;
      UrlOriginal =  this.s3Service.getURLPresignaded(imageName);
      console.log('La url::::::')
      console.log(UrlOriginal)
       await  this.saveSqlServer(cuenta,idAspuser,imageName,idTarea,fecha,tipo,id,UrlOriginal,ruta,cont);

    } catch (err_1) {
      alert(err_1)
      return console.log(err_1);
    }
  }

  ///////////////////////////////////////continuar aqui para la carga de las putas fotos

  async saveSqlServer(cuenta,idAspuser,imageName, idTarea, fecha,tipo, id,url,ruta,cont ) {    
    let a = url.split("&");
    let b = a[0];
    let b1 = b.split(":");
    let b2 = b1[0];
    let b3 = b1[1];
    let c = a[1];
    let d = a[2];
    console.log('La puta url partida')
    console.log(b2,b3,c,d)
    let idPlaza = await this.storage.get("IdPlaza");
    let strinSql0 = `'${cuenta}','${idAspuser}','${imageName}',${idTarea},'${fecha}','${tipo}',${idPlaza},'${b2}','${b3}','${c}','${d}'`;
  
      return new Promise(resolve => {
          this.http.post(this.apiUrl5 + " " + strinSql0, null).subscribe(
          async data => {
            this.mensaje.showToast(data[0].mensaje+' '+cont)
            await this.updateLoadedItem(id);
             console.log('registroCargado al puto sql')
          //   await this.deletePhotoFile(ruta);
         //  console.log('se borro la puta foto')
            resolve(data);
          },
          err => {
            this.mensaje.showAlert(
              "Existe un error con la red, verifica y vuelve a intentar :( "+err
            );
            console.log(err);
          }
        );
  });
}

finalLoad(){
  console.log('Ahora si ya todas las fotos estan en el s3 y ya solo se manda las urls al sql')
  console.log('Numero de veces que debe entrar el ciclo::'+ this.arrayUrls.length)
  for(let i = 0; i < this.arrayUrls.length; i++){
  return new Promise(resolve => {
    console.log('numero de veces que entra el ciclo: '+i)
    console.log('Aqui se muestra la url pero en ciclo')
    console.log(this.arrayUrls[i+1].url)
    this.http.post(this.apiUrl5 + " " + this.arrayUrls[i+1].url, null).subscribe(
      async data => {
        console.log(data)
        await this.updateLoadedItem(this.arrayUrls[i].id);
         console.log('registroCargado al puto sql')
      // await this.deletePhotoFile(this.arrayUrls[i].ruta);
     //  console.log('se borro la puta foto')
        resolve(data);
      },
      err => {
        this.mensaje.showAlert(
          "Existe un error con la red, verifica y vuelve a intentar :("
        );
        console.log(err);
      }
    );
  });}
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
console.log(data)
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
  setVisit(data: any) {
    // sincroniza las cuentas  a la base interna sqlite

    let sql = `INSERT INTO implementta(cuenta,adeudo,SupTerrenoH,SupConstruccionH,ValorTerrenoH,ValorConstruccionH,ValorCatastralH,SupTerrenoValuado,ValorCatastralValuado,SupConstruccionValuado,
          ValorTerrenoValuado,ValorConstruccionValuado,tareaAsignada,ultimo_pago,nombre_propietario,telefono_propietario,celular_propietario,correo_electronico_propietario,
          fecha_localizacion_propietario,nombre_usuario,telefono_usuario,celular_usuario,correo_electronico_usuario,id_relacion_propietario,motivo_no_pago,fecha_promesa_pago,
          cantidad_pago,id_tipo_deudor,id_motivonopago,id_servicios,id_expectativas,id_caracteristicas,JSON_quejas_reclamaciones,otra_queja_reclamacion,JSON_expectativas_contribuyente,
          otra_expectativa_contribuyente,JSON_caracteristicas_predio,otra_caracteristica_predio,id_accion_sugerida,id_uso_suelo_predio,id_tipo_predio_predio,calle_predio,num_interior_predio,
          num_exterior_predio,cp_predio,colonia_predio,entre_calle1_predio,entre_calle2_predio,manzana_predio,lote_predio,poblacion_predio,calle_notificacion,num_interior_notificacion,
          num_exterior_notificacion,cp_notificacion,colonia_notificacion,entre_calle1_notificacion,entre_calle2_notificacion,manzana_notificacion,lote_notificacion,referencia_predio ,
          referencia_notificacion,direccion_predio,direccion_notificacion,solucion_planteada,forma_pago,observaciones,id_tarea,latitud,longitud)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
      data.longitud
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
    let sql = `SELECT gestionada, 'CUENTA: '||cuenta||','||'PROPIETARIO: '||nombre_propietario||','||'DIRECCION: '||calle_predio||','||'NUM: '||num_exterior_predio||','||colonia_predio||','||'DEUDA: '||adeudo as full, cuenta,nombre_propietario,latitud,longitud,calle_predio,num_exterior_predio,colonia_predio,poblacion_predio,cp_predio,adeudo FROM implementta where nombre_propietario NOT NULL order by cuenta`;

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
    console.log("llego el puto query string");

    let sql =
    `INSERT INTO gestionReductor(account ,idTarea ,idDescripcion , idObservaciones , idaspuser,lectura ,conclusiones , personaContacto , telefonoContacto ,fechaPromesa , fechaCaptura , fechaProximaRev , latitud , longitud , niple , horaIni , horaFin)
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
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
    ]);
  }
  gestionGestor(data) {
    this.updateAccountGestionada(data.id);
    console.log("llego el puto query string");

    let sql =
      "INSERT INTO gestionGestor(account,idEstatus,observaciones,fechaPromesaPago,latitud,longitud,fechaCaptura,idAspuser,idTarea,fechaAsignacion,fechaVencimiento,idMotivoNoPago,motivoNoPago,idSolucionPlanteada,idExpectativasContribuyente,otraExpectativaContribuyente,idCaracteristicaPredio,otraCaracteristicaPredio,idServiciosNoPago)" +
      "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
      data.idServiciosNoPago
    ]);
  }

  gestionAbogado(data) {
    this.updateAccountGestionada(data.id);

    let sql =
      "INSERT INTO gestionAbogado(account,idResultado,idPersona,observaciones,fechaPromesaPago,latitud,longitud,fechaCaptura,idAspuser,idTarea,fechaAsignacion,fechaVencimiento)" +
      "values(?,?,?,?,?,?,?,?,?,?,?,?)";
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
      data.fechaVencimiento
    ]);
  }
  getAccountsReadyToSyncGestor() {
    let sql = `SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
              UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0`;
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
    let sql =`SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0 `;
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
    let sql =`SELECT account, fechaCaptura, idTarea, 'Gestor' as rol from gestionGestor where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Abogado' as rol  from gestionAbogado where cargado = 0
    UNION SELECT account, fechaCaptura, idTarea, 'Reductor' as rol  from gestionReductor where cargado = 0 `;
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
  ///////////////////////////////////Sincronizacion al servidor SQL Server
  async getAccoutsToSyncGestor() {
 

    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM gestionGestor where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      if (result.rows.length === 0) {
       this.mensaje.showToastSync("No hay registros para sincronizar");
      } else {
        console.log(result);
        for (let i = 0; i < result.rows.length; i++) {
          //this.sicronizadoUpdate(result.rows.item(i).id);

          let account = result.rows.item(i).account;
          let idEstatus = result.rows.item(i).idEstatus;
          let observaciones = result.rows.item(i).observaciones;
          let fechaPromesaPago = result.rows.item(i).fechaPromesaPago;
          let latitud = result.rows.item(i).latitud;
          let longitud = result.rows.item(i).longitud;
          let fechaCaptura = result.rows.item(i).fechaCaptura;
          let idAspUser = result.rows.item(i).idAspuser;
          let idTarea = result.rows.item(i).idTarea;
          let fechaAsignacion = result.rows.item(i).fechaAsignacion;
          let fechaVencimiento = result.rows.item(i).fechaVencimiento;
          let idMotivoNoPago = result.rows.item(i).idMotivoNoPago;
          let motivoNoPago = result.rows.item(i).motivoNoPago;
          let idSolucionPlanteada = result.rows.item(i).idSolucionPlanteada;
          let idExpectativasContribuyente = result.rows.item(i)
            .idExpectativasContribuyente;
          let otraExpectativaContribuyente = result.rows.item(i)
            .otraExpectativaContribuyente;
          let idCaracteristicaPredio = result.rows.item(i)
            .idCaracteristicaPredio;
          let otraCaracteristicaPredio = result.rows.item(i)
            .otraCaracteristicaPredio;
          let idServiciosNoPago = result.rows.item(i).idServiciosNoPago;
          let id = result.rows.item(i).id;
          let sqlString = `'${account}',${idEstatus},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaAsignacion}','${fechaVencimiento}',${idMotivoNoPago},'${motivoNoPago}',${idSolucionPlanteada},${idExpectativasContribuyente},'${otraExpectativaContribuyente}',${idCaracteristicaPredio},'${otraCaracteristicaPredio}',${idServiciosNoPago},${idPlaza}`;

       await   this.accountSyncGestor(sqlString, id);
        }
       
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
      
      return Promise.reject(error_1);
    }
  }
  async getAccoutsToSyncAbogado() {

    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM gestionAbogado where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      if (result.rows.length === 0) {
        this.mensaje.showToastSync("No hay registros para sincronizar");
      //  this.loading.dismiss();
      } else {
        console.log(result);
        for (let i = 0; i < result.rows.length; i++) {
          //this.sicronizadoUpdate(result.rows.item(i).id);

          let account = result.rows.item(i).account;
          let idResultado = result.rows.item(i).idResultado;
          let idPersona = result.rows.item(i).idPersona;
          let observaciones = result.rows.item(i).observaciones;
          let fechaPromesaPago = result.rows.item(i).fechaPromesaPago;
          let latitud = result.rows.item(i).latitud;
          let longitud = result.rows.item(i).longitud;
          let fechaCaptura = result.rows.item(i).fechaCaptura;
          let idAspUser = result.rows.item(i).idAspuser;
          let idTarea = result.rows.item(i).idTarea;
          let fechaVencimiento = result.rows.item(i).fechaVencimiento;
          let horaVencimiento = result.rows.item(i).fechaVencimiento;

          let id = result.rows.item(i).id;
          let sqlString = `'${account}',${idResultado},${idPersona},'${observaciones}','${fechaPromesaPago}',${latitud},${longitud},'${fechaCaptura}','${idAspUser}',${idTarea},'${fechaVencimiento}','${horaVencimiento}',${idPlaza}`;

       await   this.accountSyncAbogado(sqlString, id);
        }
    //    this.loading.dismiss();
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
  //    this.loading.dismiss();
      return Promise.reject(error_1);
    }
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
          let idObservacion =  result.rows.item(i).idDescripcion;
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
          let horaIni= result.rows.item(i).horaIni;
          let horaFin = result.rows.item(i).horaFin;

      let id = result.rows.item(i).id;
          let sqlString = `'${account}',${idTarea},'${idObservacion}','${idDescripcion}','${idAspUser}','${lectura}','${conclusiones}','${personaContacto}','${telefonoContacto}','${fechaPromesa}','${fechaCaptura}','${fechaProximaVisita}','${latitud}','${longitud}',${idNiple},'${horaIni}','${horaFin}',${idPlaza}`;

     await     this.accountSyncReductor(sqlString, id);
        }
      //  this.loading.dismiss();
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
    //  this.loading.dismiss();
      return Promise.reject(error_1); 
    }
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
            "Hubo un error en la red, verifica e intentalo de nuevo "+ err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
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
            "Hubo un error en la red, verifica e intentalo de nuevo "+ err
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
            "Hubo un error en la red, verifica e intentalo de nuevo "+ err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }
  updateStatusLoadAgain(rol){
    if(rol=='2'){
      let sql = "UPDATE gestionAbogado SET cargado = 0 where cargado = 1";
      let sql2 = "UPDATE gestionGestor SET cargado = 0 where cargado = 1";
      this.db.executeSql(sql, null);
      this.db.executeSql(sql2, null);
    }
    else if(rol=='5'){
      let sql = "UPDATE gestionGestor SET cargado = 0 where cargado = 1";
      return this.db.executeSql(sql,null);
    }else if(rol=='7'){
    let sql = "UPDATE gestionReductor SET cargado = 0 where cargado = 1";
    return this.db.executeSql(sql,null);
    }
  }
  updateRecorridoSync(id) {
    let sql = "UPDATE recorrido SET cargado = 1 where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  updateAccountSyncGestor(id) {
    let sql = "UPDATE gestionGestor SET cargado = 1 where id = ?";
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
  deleteDataUpdatedAddress(id){
    let sql = "DELETE FROM domicilios where id = ?";
    return this.db.executeSql(sql, [id]);
  }
  deleteDataUpdatedUser(id){
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
    ]).then(data=>{
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
            "Hubo un error en la red, verifica e intentalo de nuevo "+ err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }
  
  async syncActualizacionDatosPropietario() {

    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM propietario where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      if (result.rows.length === 0) {
       console.log('No hay nada')
      } else {
        console.log(result);
       
        for (let i = 0; i < result.rows.length; i++) {
          //this.sicronizadoUpdate(result.rows.item(i).id);
        
          let account = result.rows.item(i).cuenta;
          let nombre =  result.rows.item(i).nombre;
          let telefono =result.rows.item(i).telefono;
          let celular = result.rows.item(i).celular;
          let correo =  result.rows.item(i).correo;
          let fecha = result.rows.item(i).fecha;
          let fechaCaptura = result.rows.item(i).fechaCaptura;
          let idaspUser = result.rows.item(i).idaspUser;
          let idRol = result.rows.item(i).idRol;
          let type = result.rows.item(i).type;

          let id = result.rows.item(i).id;
          let sqlString = `'${account}','${nombre}','${telefono}','${celular}','${correo}','${fecha}','${fechaCaptura}','${idaspUser}','${idRol}',${type},${idPlaza}`;

          this.accountSyncDatosPropietario(sqlString, id);
        }
      
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
     
      return Promise.reject(error_1);
    }
  }
  async syncActualizacionDatosDomicilios() {
  

    let idPlaza = await this.storage.get("IdPlaza");
    try {
      let sql = "SELECT * FROM domicilios where cargado = 0";
      const result = await this.db.executeSql(sql, []);
      if (result.rows.length === 0) {
       console.log('No hay nada para sincronizar')
      } else {
        console.log(result);
      
        for (let i = 0; i < result.rows.length; i++) {
          //this.sicronizadoUpdate(result.rows.item(i).id);
          
          let account = result.rows.item(i).cuenta;
          let calle = result.rows.item(i).calle;
          let manzana = result.rows.item(i).manzana;
          let lote = result.rows.item(i).lote;
          let numExt = result.rows.item(i).numExt;
          let numInt = result.rows.item(i).numInterior;
          let colonia = result.rows.item(i).colonia;
          let poblacion = result.rows.item(i).poblacion;
          let cp = result.rows.item(i).cp;
          let calle1 = result.rows.item(i).entreCalle1;
          let calle2 = result.rows.item(i).entreCalle2;
          let referencia = result.rows.item(i).referencia;
          let fechaCaptura = result.rows.item(i).fechaCaptura;
          let idaspUser = result.rows.item(i).idaspUser;
          let idRol = result.rows.item(i).idRol;
          let type =  result.rows.item(i).type;
          let id = result.rows.item(i).id;
        
           calle = calle.replace("#", "No.");
        //   console.log(calle)
        let sqlString = `'${account}','${calle}','${manzana}','${lote}','${numExt}','${numInt}','${colonia}','${poblacion}','${cp}','${calle1}','${calle2}','${referencia}','${fechaCaptura}','${idaspUser}','${idRol}',${type} ,${idPlaza}`;

          this.accountSyncDomicilios(sqlString, id);
        }
        
        return Promise.resolve("Executed query");
      }
    } catch (error_1) {
     
      return Promise.reject(error_1);
    }
  }
  
  async accountSyncDomicilios(query, id) {
    console.log(query);
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
    console.log(query);
    return new Promise(resolve => {
      this.http.post(this.apiUrl12 + " " + query, null).subscribe(
        async data => {
          await this.updateAccountSyncDatosPropietario(id);
          this.mensaje.showToastSync('Registro(s) sincronizado(s)')
          resolve(data);
        },
        err => {
          this.mensaje.showAlert(
            "Hubo un error en la red, verifica e intentalo de nuevo "+ err
          );
          this.loadingCtrl.dismiss();
          console.log(err);
        }
      );
    });
  }


  async guardarSQl(lat,lng,idasp,fecha) {
    let idPlaza = await this.storage.get("IdPlaza");
   
        let sqlString = `${lat},${lng},'${fecha}','${idasp}',${idPlaza}`;

        this.recorridoSync(sqlString, 0);
      

      return Promise.resolve("Executed query");
 
  }
}
