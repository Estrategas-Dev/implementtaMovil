import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  @ViewChild('passwordEyeRegister') passwordEye;
  email: string;
  password: string;
  version: string;
  passwordTypeInput = 'password';
  iconpassword = 'eye-off';
  loading: any
  constructor(private authService: AuthService, public router: Router, private app: AppVersion, private loadingController: LoadingController,
    private nav: NavController, private mensaje: MessagesService) { }

  ngOnInit() {
    this.getVersion();
  }
  async getVersion() {
    await this.app.getVersionCode().then(res => {
      this.version = res.toString();

    })

  }
  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordEye.el.setFocus();
  }
  async OnSubmitLogin() {
    this.loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await this.loading.present();
    await this.authService.login(this.email, this.password).then(async res => {

      console.log(res)
      //this.router.navigateByUrl('/home',{ skipLocationChange: false });
      this.nav.navigateForward('/')
      this.loading.dismiss()
    }).catch(error => this.mensaje.showAlert('Error de autenticación, verifica usuario o contraseña'))
    this.loading.dismiss()
  }


}