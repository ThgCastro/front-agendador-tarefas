import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from "@angular/router";
import { Subscription} from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo.svg";

  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService);

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
}
