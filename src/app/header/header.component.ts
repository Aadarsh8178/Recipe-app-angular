import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit,OnDestroy {
  private subscription: Subscription;
  isAuthenticated = false;

  constructor(private dsService:DataStorageService,private authService:AuthService){}

  ngOnInit(){
    this.authService.user.subscribe(
      (user:User)=>{
        this.isAuthenticated = !!user;
      }
    )
  }
  onSaveData(){
    this.dsService.storeRecipes();
  }
  onFetchData(){
    this.dsService.fetchRecipes().subscribe();
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}