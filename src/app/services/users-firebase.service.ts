import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UsersFirebaseService {
  userInfo: any[];

  constructor( private db : AngularFirestore) { }

  getUserInfo(){
    return this.db.collection('usersImplementta').valueChanges()
  }
  getUserInfoAccount(){
    const user = auth().currentUser
    return this.db.collection('usersImplementta').doc(user.uid).valueChanges()
  }
  getTotals(){
    const user = auth().currentUser
    return this.db.collection('usersImplementta').doc(user.uid).valueChanges();
  }

  getTodo(){
    const user = auth().currentUser
    return this.db.collection('usersImplementta').doc(user.uid).collection('Desempeño').valueChanges()

  }
  setVersion(version,fecha){
    const user = auth().currentUser
    return this.db.collection('usersImplementta').doc(user.uid).update({
      appVersion : version,
      lastSync: fecha
    })
  }

  subirLatLong(latitud,longitud){
    const user = auth().currentUser
    return this.db.collection('usersImplementta').doc(user.uid).update({
      latitud : latitud,
      longitud: longitud
    })


  }
}
