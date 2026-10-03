import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonMenuButton, IonItem, IonLabel, IonInput, IonAvatar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonMenuButton, IonItem, IonLabel, IonInput, IonAvatar]
})
export class AccountPage implements OnInit {

  constructor() { }

  public account: any = {
    fullName: 'Guest User',
    email: '',
    avatar: '',
    hasPassword: false,
  };

  // password simulation fields (not stored in plain text)
  public newPassword = '';
  public confirmPassword = '';

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount() {
    try {
      const raw = localStorage.getItem('account');
      if (raw) this.account = JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load account', e);
    }
  }

  onAvatarChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.account.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveAccount() {
    try {
      localStorage.setItem('account', JSON.stringify(this.account));
      // notify other parts of the app
      window.dispatchEvent(new CustomEvent('account-updated'));
      alert('Account saved');
    } catch (e) {
      console.error('Save failed', e);
    }
  }

  changePassword() {
    if (!this.newPassword) { alert('Enter a new password'); return; }
    if (this.newPassword !== this.confirmPassword) { alert('Passwords do not match'); return; }
    // simulate password set
    this.account.hasPassword = true;
    // Clear fields
    this.newPassword = '';
    this.confirmPassword = '';
    this.saveAccount();
  }

}
