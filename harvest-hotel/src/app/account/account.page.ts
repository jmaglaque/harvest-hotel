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
    avatar: 'assets/img/avatar.png',
    password: undefined,
  };

  // password simulation fields (not stored in plain text)
  public oldPassword = '';
  public newPassword = '';
  public confirmPassword = '';
  public errorMessage = '';

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
    // Ensure there is a simulated default password
    if (!this.account.password) {
      this.account.password = '1234567890';
      // persist default
      try { localStorage.setItem('account', JSON.stringify(this.account)); } catch (_) {}
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
    this.errorMessage = '';
    if (!this.oldPassword) { this.errorMessage = 'Enter your current password'; return; }
    if (this.oldPassword !== this.account.password) { this.errorMessage = 'Current password is incorrect'; return; }
    if (!this.newPassword) { this.errorMessage = 'Enter a new password'; return; }
    if (this.newPassword !== this.confirmPassword) { this.errorMessage = 'Passwords do not match'; return; }
    if (!this.isPasswordStrong(this.newPassword)) {
      this.errorMessage = 'Password must be at least 6 characters and include letters, numbers, and one of !@$_%';
      return;
    }
    // simulate password set
    this.account.password = this.newPassword;
    // Clear fields
    this.newPassword = '';
    this.confirmPassword = '';
    this.oldPassword = '';
    this.saveAccount();
  }

  // password strength: min 6 chars, contains letters, numbers and special chars !@$_%
  isPasswordStrong(pw: string): boolean {
    if (!pw) return false;
    const re = /(?=.{6,})(?=.*[A-Za-z])(?=.*\d)(?=.*[!@$_%])/;
    return re.test(pw);
  }

  get canSave(): boolean {
    const name = (this.account?.fullName || '').toString().trim();
    const email = (this.account?.email || '').toString().trim();
    return name.length > 0 && email.length > 0;
  }

}
