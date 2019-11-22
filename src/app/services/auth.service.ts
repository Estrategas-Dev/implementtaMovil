import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from "@angular/fire/firestore";
import { MessagesService } from './messages.service';




@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo : any

constructor(public AFauth :AngularFireAuth,public router : Router, private storage : Storage, private db : AngularFirestore, private mensaje : MessagesService) {

 }

    login( email : string, password : string){
     return new Promise((resolve,rejected)=>{
    this.AFauth.auth.signInWithEmailAndPassword(email,password).then(  user =>{
    const id = user.user.uid 

let createSusbcribe =
this.getUserInfo(id).subscribe(async user=>{
  this.userInfo = user
  console.log(this.userInfo)
  console.log(this.userInfo.IMEI)
  if(this.userInfo.isActive){
    console.log(this.userInfo.isActive)
  if(this.userInfo.IMEI==''){
  createSusbcribe.unsubscribe();
  this.saveUserInfoStorage(this.userInfo);
 await this.storage.set("idFireBase", id)
 await this.storage.set("ActivateApp","0");

 resolve(user)
}else
 {
   let imeiLocal = await this.storage.get("IMEI")
   let user = await this.storage.get("Nombre")
   if(this.userInfo.IMEI == imeiLocal ){
    createSusbcribe.unsubscribe();
     this.mensaje.showAlert("Bienvenido "+ user);
     this.saveUserInfoStorage(this.userInfo);
     resolve(user)
   }else{
   createSusbcribe.unsubscribe();
     this.mensaje.showAlert("Este usuario ha iniciado sesión en el dispositivo con Id: <strong>"+this.userInfo.IMEI+'</strong> con fecha <strong>'+this.userInfo.lastSession+'</strong>')
  
   this.logout();
   rejected("Error");}
   createSusbcribe.unsubscribe();
 }}else{
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
  saveUserInfoStorage(userInfo:any){
this.storage.set('Nombre',userInfo.name);
this.storage.set('Email',userInfo.email);
this.storage.set('IdAspUser',userInfo.idaspuser);
this.storage.set('IdPlaza',userInfo.idplaza);
this.storage.set('IdRol',userInfo.idrol);
this.storage.set('Rol',userInfo.rol);
this.storage.set('Plaza',userInfo.plaza);
this.storage.set('IdUserChecador',userInfo.idUserChecador)
this.storage.set('Password',userInfo.password)
  }
  getUserInfo( uid : string){
    return this.db.collection('usersImplementta').doc(uid).valueChanges()
  }
  logout(){
    this.AFauth.auth.signOut().then(()=>{
    
      this.router.navigate(['/login']);
    })
   
  }


  register(email : string, password : string, name : string, idplaza :string, idrol : number,idaspuser : string,rol:string,plaza :string, idUserChecador : number){

    return new Promise ((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(email, password).then( res =>{
        const uid = res.user.uid;
          this.db.collection('usersImplementta').doc(uid).set({
            name : name,
            email : email,
            password : password,
            idplaza : idplaza,
            idrol : idrol,
            idaspuser : idaspuser,
            uid : uid,
            rol: rol,
            plaza : plaza,
            idUserChecador : idUserChecador,
            IMEI :"",
            lastSession:"",
            managedAccounts:0,
            totalAccounts:0,
            isActive: false,
            urlImage: ""
          })
        
        resolve(res)
      }).catch( err => reject(err))
    })
    

  }

}
