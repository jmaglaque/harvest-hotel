
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonFooter, IonToolbar, IonTitle, IonAvatar, IonButton, } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { home, bed, calendar, time, image, logOut } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonToolbar, IonHeader, IonFooter, IonTitle, IonAvatar, IonButton, HttpClientModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/', icon: 'home' },
    { title: 'Rooms', url: '/rooms', icon: 'bed' },
    { title: 'Events', url: '/events', icon: 'calendar' },
    { title: 'Booking History', url: '/booking-history', icon: 'time' },
    { title: 'Gallery', url: '/gallery', icon: 'image' },
  ];

  public user: any = { fullName: 'Guest User', email: '', avatar: '' };

  constructor() {
    addIcons({ home, bed, calendar, time, image, logOut });
    this.loadAccount();
    window.addEventListener('account-updated', () => this.loadAccount());
  }

  loadAccount() {
    try {
      const raw = localStorage.getItem('account');
      if (raw) {
        this.user = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not load account', e);
    }
  }
}
