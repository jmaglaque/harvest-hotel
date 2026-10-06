
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonHeader, IonFooter, IonToolbar, IonTitle, IonAvatar, IonButton, } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { home, homeOutline, bed, bedOutline, calendar, calendarOutline, time, timeOutline, image, imageOutline, logOut, chevronForward, chevronBack } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet, IonToolbar, IonHeader, IonFooter, IonTitle, IonAvatar, IonButton, HttpClientModule],
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
  public isCollapsed: boolean = false;

  constructor() {
    addIcons({
      home,
      'home-outline': homeOutline,
      bed,
      'bed-outline': bedOutline,
      calendar,
      'calendar-outline': calendarOutline,
      time,
      'time-outline': timeOutline,
      image,
      'image-outline': imageOutline,
      logOut,
      chevronForward,
      chevronBack,
    });
    this.loadAccount();
    this.loadSidebarState();
    window.addEventListener('account-updated', () => this.loadAccount());
  }

  loadSidebarState() {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved !== null) {
        this.isCollapsed = JSON.parse(saved);
      }
    } catch (e) {}
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    try {
      localStorage.setItem('sidebar_collapsed', JSON.stringify(this.isCollapsed));
    } catch (e) {}
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
