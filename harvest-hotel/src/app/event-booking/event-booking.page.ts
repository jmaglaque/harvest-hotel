import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-event-booking',
  templateUrl: './event-booking.page.html',
  styleUrls: ['./event-booking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonCheckbox, IonMenuButton]
})
export class EventBookingPage {
  public event: any = null;
  public form: any = {
    fullName: '',
    email: '',
    contact: '',
    dateSchedule: '',
    timeSchedule: '18:00',
    packageType: '',
    menuSelections: {},
    discountType: '',
    promo: '',
    paymentMethod: 'Gcash',
    paymentType: 'partial',
    notes: '',
    type: 'event'
  };

  constructor(private route: ActivatedRoute, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && (nav.extras as any).state && (nav.extras as any).state.event) {
      this.event = (nav.extras as any).state.event;
      // default packageType to first rate
      if (this.event?.rates && this.event.rates.length) {
        this.form.packageType = this.event.rates[0].pax;
      }
    } else {
      const id = this.route.snapshot.paramMap.get('eventId');
      this.event = { id, title: `Event ${id}`, rates: [], extraPaxPrice: 0, menu: null };
    }
  }

  ngOnInit() {
    // initialize menuSelections to arrays per category key
    (this.event?.menu?.category || []).forEach((c: any) => {
      if (!this.form.menuSelections[c.key]) this.form.menuSelections[c.key] = [];
    });
  }

  // --- menu selection helpers ---
  getEntryForKey(key: string) {
    const choice = this.event?.menu?.choiceOf;
    if (!choice || !Array.isArray(choice.entries)) return null;
    return choice.entries.find((e: any) => (e.keys || []).includes(key)) || null;
  }

  getEntryLabelForKey(key: string) {
    const entry = this.getEntryForKey(key);
    return entry ? entry.label : '';
  }

  isChecked(key: string, item: string) {
    const list = this.form.menuSelections[key] || [];
    return list.indexOf(item) !== -1;
  }

  getSelectedCountForEntry(entry: any) {
    if (!entry) return 0;
    let total = 0;
    (entry.keys || []).forEach((k: string) => {
      const arr = this.form.menuSelections[k] || [];
      total += Array.isArray(arr) ? arr.length : 0;
    });
    return total;
  }

  isDisabled(key: string, item: string) {
    const entry = this.getEntryForKey(key);
    if (!entry) return false;
    // if already selected, never disable (allow uncheck)
    if (this.isChecked(key, item)) return false;
    const count = this.getSelectedCountForEntry(entry);
    return count >= (entry.count || 0);
  }

  onToggleItem(key: string, item: string, checked: boolean) {
    if (!this.form.menuSelections[key]) this.form.menuSelections[key] = [];
    const arr: string[] = this.form.menuSelections[key];
    const entry = this.getEntryForKey(key);
    if (checked) {
      // enforce limit across the entry
      if (entry && this.getSelectedCountForEntry(entry) >= (entry.count || 0)) {
        // ignore the check if limit reached
        return;
      }
      if (arr.indexOf(item) === -1) arr.push(item);
    } else {
      const idx = arr.indexOf(item);
      if (idx !== -1) arr.splice(idx, 1);
    }
  }

  parsePax(pax: string) {
    if (!pax) return 0;
    const m = pax.toString().match(/(\d+)/);
    return m ? Number(m[1]) : 0;
  }

  get selectedRate() {
    return this.event?.rates?.find((r: any) => r.pax === this.form.packageType) || null;
  }

  get basePrice() {
    return Number(this.selectedRate?.price || 0);
  }

  get selectedPax(): number {
    return this.parsePax(this.form.packageType || this.selectedRate?.pax || '0');
  }

  get extraGuests(): number {
    return 0;
  }

  get subtotal(): number {
    return this.basePrice + (this.extraGuests * (this.event?.extraPaxPrice || 0));
  }

  get promoPercent(): number {
    const code = (this.form.promo || '').toString().toUpperCase();
    if (code === 'PROMO20') return 0.20;
    if (code === 'PROMO10') return 0.10;
    return 0;
  }

  get discountPercent(): number {
    return this.form.paymentType === 'full' ? 0.05 : 0;
  }

  get discountAmount(): number {
    return this.subtotal * this.discountPercent;
  }

  get promoAmount(): number {
    return this.subtotal * this.promoPercent;
  }

  get total(): number {
    const t = this.subtotal - this.discountAmount - this.promoAmount;
    return t > 0 ? Math.round(t) : 0;
  }

  get downpaymentPercent(): number {
    return this.form.paymentType === 'partial' ? 0.20 : 1.0;
  }

  get downpaymentAmount(): number {
    return Math.round(this.total * this.downpaymentPercent);
  }

  formatCurrency(v: any) {
    const n = Number(v || 0);
    return n.toLocaleString('en-PH');
  }

  get isFormValid(): boolean {
    const f = this.form;
    if (!f) return false;
    if (!f.fullName || !f.email || !f.contact) return false;
    if (!f.dateSchedule || !f.timeSchedule) return false;
    if (!f.packageType) return false;
    if (!f.paymentMethod || !f.paymentType) return false;
    return true;
  }

  submitBooking() {
    const payload = {
      ...this.form,
      event: this.event,
      subtotal: this.subtotal,
      discountAmount: this.discountAmount,
      promoAmount: this.promoAmount,
      downpaymentAmount: this.downpaymentAmount,
      total: this.total,
      type: 'event',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    try {
      const raw = localStorage.getItem('bookings');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ id: Date.now(), ...payload });
      localStorage.setItem('bookings', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save event booking', e);
    }
    this.router.navigate(['/booking-history']);
  }

  cancel() {
    this.router.navigate(['/events']);
  }
}
