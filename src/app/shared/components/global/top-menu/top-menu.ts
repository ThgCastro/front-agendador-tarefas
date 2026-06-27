import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { Subscription} from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state';
import { MatMenuModule } from '@angular/material/menu';
import { Auth } from '../../../../services/auth';
import { UserService } from '../../../../services/user';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule, MatMenuModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo.svg";

  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService);
  private authService = inject(Auth);
  private router = inject(Router)
  private userService = inject(UserService)

  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual = url;
    })
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  isOnRouteRegister(): boolean{
    return this.rotaAtual === '/register'
  }
  
  isOnRouteLogin(): boolean{
    return this.rotaAtual === '/login'
  }

  get isLogged(): boolean{
    return this.authService.isLoggedIn()
  }

  getUserInitial(): string{
    const user = this.authService.getUser();
    if(user && user.nome){
      return user.nome.charAt(0).toUpperCase();
    }
    return '?'
  }

  logout(): void{
    this.authService.logout();
    this.router.navigate(['/login'])
  }

}
