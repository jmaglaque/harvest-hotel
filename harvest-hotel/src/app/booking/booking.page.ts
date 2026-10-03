import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonMenuButton, IonTextarea, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, RouterLink, IonMenuButton, IonTextarea, IonIcon]
})
export class BookingPage {
  public room: any = null;
  public form: any = {
    fullName: '',
    email: '',
    contact: '',
    adults: 2,
    children: 0,
    special: '',
    checkInDate: '',
    // fixed times: check-in 14:00 (2:00 PM), check-out 12:00 (12:00 PM)
    checkInTime: '14:00',
    checkOutDate: '',
    checkOutTime: '12:00',
    notes: '',
    rooms: 1,
    promo: '',
    paymentMethod: 'Gcash',
    paymentType: 'partial',
    type: 'room'
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    addIcons({ arrowBack });
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && (nav.extras as any).state && (nav.extras as any).state.room) {
      this.room = (nav.extras as any).state.room;
    } else {
      // fallback: read roomId param and show minimal info
      const id = this.route.snapshot.paramMap.get('roomId');
      this.room = { id, title: `Room ${id}`, price: 0 };
    }
  }

  submitBooking() {
    // For now just navigate back or show a confirmation — in real app send to backend
    // combine date + time into ISO-like strings for submission
    const combine = (dateStr: string, timeStr: string) => {
      if (!dateStr) return null;
      const time = timeStr && timeStr.length ? timeStr : '12:00';
      // Ensure dateStr is yyyy-mm-dd and time is hh:mm
      return `${dateStr}T${time}:00`;
    };

    const payload = {
      ...this.form,
      checkIn: combine(this.form.checkInDate, this.form.checkInTime),
      checkOut: combine(this.form.checkOutDate, this.form.checkOutTime)
    };

    const booking = {
      id: Date.now(),
      room: this.room,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      form: this.form,
      subtotal: this.subtotal,
      discountAmount: this.discountAmount,
      promoAmount: this.promoAmount,
      downpaymentAmount: this.downpaymentAmount,
      total: this.total,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const raw = localStorage.getItem('bookings');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(booking);
      localStorage.setItem('bookings', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save booking', e);
    }

    // navigate to booking history
    this.router.navigate(['/booking-history']);
  }

  getNumberOfNights(): number {
    const d1 = this.form.checkInDate;
    const d2 = this.form.checkOutDate;
    if (!d1 || !d2) return 0;
    try {
      const dt1 = new Date(d1 + 'T00:00:00');
      const dt2 = new Date(d2 + 'T00:00:00');
      const diff = (dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 ? Math.floor(diff) : 0;
    } catch (e) {
      return 0;
    }
  }

  get nights(): number {
    return this.getNumberOfNights();
  }

  get subtotal(): number {
    const price = Number(this.room?.price || 0);
    const nights = this.nights || 0;
    const rooms = Number(this.form.rooms || 1);
    return price * nights * rooms;
  }

  get discountPercent(): number {
    return 0;
  }

  get promoPercent(): number {
    // simple promo code handling
    const code = (this.form.promo || '').toString().toUpperCase();
    if (code === 'PROMO20') return 0.20;
    if (code === 'PROMO10') return 0.10;
    return 0;
  }

  get discountAmount(): number {
    return this.subtotal * this.discountPercent;
  }

  get promoAmount(): number {
    return this.subtotal * this.promoPercent;
  }

  get total(): number {
    const t = this.subtotal - this.discountAmount - this.promoAmount;
    return t > 0 ? t : 0;
  }

  get downpaymentPercent(): number {
    // If user chose partial payment, pay 20% now; if full, pay 100% now
    return this.form.paymentType === 'partial' ? 0.20 : 1.0;
  }

  get downpaymentAmount(): number {
    return Math.round(this.total * this.downpaymentPercent);
  }

  get remainingBalance(): number {
    return Math.max(this.total - this.downpaymentAmount, 0);
  }

  formatCurrency(v: number) {
    return v.toLocaleString('en-PH');
  }

  get isFormValid(): boolean {
    const f = this.form;
    if (!f) return false;
    // Required fields: fullName, email, contact, check-in/out dates, adults >=1, rooms >=1, paymentMethod, paymentType
    if (!f.fullName || !f.fullName.toString().trim()) return false;
    const email = (f.email || '').toString();
    if (!email.includes('@') || !email.includes('.')) return false;
    if (!f.contact || !f.contact.toString().trim()) return false;
    if (!f.checkInDate || !f.checkOutDate) return false;
    if (this.nights <= 0) return false;
    if (!f.adults || Number(f.adults) < 1) return false;
    if (!f.rooms || Number(f.rooms) < 1) return false;
    if (!f.paymentMethod) return false;
    if (!f.paymentType) return false;
    return true;
  }

  cancel() {
    this.router.navigate(['/rooms']);
  }
}
