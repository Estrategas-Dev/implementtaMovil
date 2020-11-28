import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from "@angular/fire/firestore";
import { MessagesService } from './messages.service';
import { RestService } from './rest.service';
import { rejects } from 'assert';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo: any

  constructor(public AFauth: AngularFireAuth, public router: Router, private storage: Storage, private db: AngularFirestore, private mensaje: MessagesService, private restService:RestService) {

  }

  login(email: string, password: string) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        const id = user.user.uid
        let createSusbcribe = this.getUserInfo(id).subscribe(async user => {
            this.userInfo = user
            console.log(this.userInfo)
            console.log(this.userInfo.email)
            if (this.userInfo.isActive) { // Usuario activado
              console.log("Usuario activado",this.userInfo.isActive)
              if (this.userInfo.IMEI == '') { 
                console.log("Es un usuario nuevo o se le ha borrado el id");
                createSusbcribe.unsubscribe();
                this.saveUserInfoStorage(this.userInfo);
                await this.storage.set("idFireBase", id)
                await this.storage.set("ActivateApp", "0");
                resolve(user)
              } 
              else { 
                console.log("El usuario no es nuevo o se le ha borado el id");
                let emailLocal = await this.storage.get("Email");
                let nombreUser = await this.storage.get("Nombre")
                console.log("El email del usuario con la sesion anterior es ", emailLocal);
                console.log("El usuario con la sesion anterior es ", nombreUser);
                if (this.userInfo.email == emailLocal) {
                  console.log("Misma sesion del usuario en turno, correo en el storage mismo al correo ingresado");
                  createSusbcribe.unsubscribe();
                  this.mensaje.showAlert("Bienvenid@ " + nombreUser);
                  this.saveUserInfoStorage(this.userInfo);
                  resolve(nombreUser)
                } 
                else {
                  console.log("Correo en el storage diferente al ingresado, puede ser null el correo en el storage");
                  createSusbcribe.unsubscribe();
                  this.saveUserInfoStorage(this.userInfo);
                  let nombreUsuario = await this.storage.get("Nombre")
                  await this.storage.set("idFireBase", id)
                  await this.storage.set("ActivateApp", "0");
                  await this.storage.set("total", null);
                  await this.storage.set("FechaSync", null);
                  this.restService.deleteInfo();
                  console.log(nombreUsuario);
                  resolve(nombreUsuario)
                }
                createSusbcribe.unsubscribe();
              } // no ha ingresado por primera vez
            } // this.userinfo is active
            else {
              this.mensaje.showAlert('Tu usario está desactivado');
              this.logout();
              // rejected("Error");
            }
            /* let imei =await this.getDataCellphone();
            console.log(imei)
            await this.saveDataCellPhone(imei,id) */
          })
      }).catch(error => rejected(error));

    });

  }





  saveUserInfoStorage(userInfo: any) {
    console.log("Guardar los datos del usuario en el storage");
    this.storage.set('Nombre', userInfo.name);
    this.storage.set('Email', userInfo.email);
    this.storage.set('IdAspUser', userInfo.idaspuser);
    this.storage.set('IdPlaza', userInfo.idplaza);
    this.storage.set('IdRol', userInfo.idrol);
    this.storage.set('Rol', userInfo.rol);
    this.storage.set('Plaza', userInfo.plaza);
    this.storage.set('IdUserChecador', userInfo.idUserChecador)
    this.storage.set('Password', userInfo.password)
  }
  getUserInfo(uid: string) {
    return this.db.collection('usersImplementta').doc(uid).valueChanges()
  }
  logout() {
    this.AFauth.auth.signOut().then(() => {

      this.router.navigate(['/login']);
    })

  }


  register(email: string, password: string, name: string, idplaza: string, idrol: number, idaspuser: string, rol: string, plaza: string, idUserChecador: number) {

    return new Promise((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, password).then(res => {
        const uid = res.user.uid;
        this.db.collection('usersImplementta').doc(uid).set({
          name: name,
          email: email,
          password: password,
          idplaza: idplaza,
          idrol: idrol,
          idaspuser: idaspuser,
          uid: uid,
          rol: rol,
          plaza: plaza,
          idUserChecador: idUserChecador,
          IMEI: "",
          lastSession: "",
          managedAccounts: 0,
          totalAccounts: 0,
          isActive: false,
          urlImage: ""
        })

        resolve(res)
      }).catch(err => reject(err))
    })


  }

}
