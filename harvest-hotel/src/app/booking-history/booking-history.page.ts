import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonButtons, IonBadge, IonModal, IonItem, IonLabel, IonInput, IonTextarea, AlertController, IonMenuButton, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonButtons, IonBadge, IonModal, IonItem, IonLabel, IonInput, IonTextarea, IonMenuButton, IonSegment, IonSegmentButton, IonSegmentView, IonSegmentContent]
})
export class BookingHistoryPage implements OnInit {
  public bookings: any[] = [];
  public isModalOpen = false;
  public selectedBooking: any = null;
  public segment: 'room' | 'event' = 'room';
  public isEditing = false;
  public editForm: any = null;

  constructor(private router: Router, private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  get filteredBookings() {
    if (!this.bookings) return [];
    if (this.segment === 'event') return this.bookings.filter(b => (b.type || '').toString().toLowerCase() === 'event');
    // default: room bookings (or any booking without type)
    return this.bookings.filter(b => !b.type || b.type.toString().toLowerCase() === 'room');
  }

  getRoomBookings() {
    return (this.bookings || []).filter(b => !b.type || b.type.toString().toLowerCase() === 'room');
  }

  getEventBookings() {
    return (this.bookings || []).filter(b => (b.type || '').toString().toLowerCase() === 'event');
  }

  // menu helpers for templates
  getMenuSelections(booking: any, key: string): any[] {
    if (!booking || !booking.menuSelections) return [];
    const v = booking.menuSelections[key];
    return Array.isArray(v) ? v : [];
  }

  hasMenuSelections(booking: any, key: string): boolean {
    return this.getMenuSelections(booking, key).length > 0;
  }

  formatGuests(count: any): string {
    if (count === null || count === undefined || count === '') return '-';
    const n = Number(count);
    if (isNaN(n)) return '-';
    return n === 1 ? `${n} guest` : `${n} guests`;
  }

  loadBookings() {
    try {
      const raw = localStorage.getItem('bookings');
      if (raw) {
        this.bookings = JSON.parse(raw);
      } else {
        // first time: seed with sample bookings
        this.bookings = this.generateSampleBookings();
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
      }
    } catch (e) {
      console.error('Failed to load bookings', e);
      this.bookings = [];
    }
  }

  generateSampleBookings(): any[] {
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const futureEnd = new Date(future.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 nights

    // sample room booking
    const roomBooking = {
      id: Date.now(),
      type: 'room',
      status: 'Pending',
      createdAt: now.toISOString(),
      checkIn: future.toISOString().split('T')[0],
      checkOut: futureEnd.toISOString().split('T')[0],
      room: { id: 1, title: 'Superior Twin', price: 3500 },
      form: {
        fullName: 'Juan Dela Cruz',
        email: 'juan@example.com',
        contact: '+63 917 123 4567',
        adults: 2,
        children: 0,
        rooms: 1,
        checkInTime: '14:00',
        checkOutTime: '12:00',
        notes: 'Early check-in requested',
        paymentMethod: 'Gcash',
        paymentType: 'partial'
      },
      subtotal: 7000,
      discountAmount: 0,
      promoAmount: 0,
      downpaymentAmount: 1400,
      total: 7000
    };

    // sample event booking based on Package 1
    const eventFuture = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    const eventBooking = {
      id: Date.now() + 1,
      type: 'event',
      status: 'Pending',
      createdAt: now.toISOString(),
      dateSchedule: eventFuture.toISOString().split('T')[0],
      timeSchedule: '18:00',
      fullName: 'Maria Santos',
      email: 'maria@example.com',
      contact: '+63 918 765 4321',
      packageType: '30 Pax',
      notes: 'Birthday celebration',
      paymentMethod: 'Card',
      paymentType: 'partial',
      event: {
        id: 1,
        title: 'Package 1',
        rates: [
          { pax: '30 Pax', price: 41000 },
          { pax: '50 Pax', price: 56100 },
          { pax: '80 Pax', price: 76000 },
          { pax: '100 Pax', price: 90500 },
          { pax: '150 Pax', price: 129000 },
        ],
        extraPaxPrice: 750,
        menu: {
          choiceOf: {
            text: 'Choice of one (1) Soup, two (2) Main Course, one (1) Vegetable or Pasta, Rice, Dessert, and one (1) round of Flavored Juice.',
            entries: [
              { count: 1, label: 'Soup', keys: ['soup'] },
              { count: 2, label: 'Main Course', keys: ['fish','pork','chicken'] },
              { count: 1, label: 'Vegetable or Pasta', keys: ['vegetable','pasta'] },
              { count: 1, label: 'Rice', keys: [] },
              { count: 1, label: 'Dessert', keys: ['dessert'] },
              { count: 1, label: 'Flavored Juice (round)', keys: [] },
            ]
          },
          category: [
            {
              key: "soup",
              label: 'Soup',
              items: [
                'Lentil',
                'Crab and Corn',
                'Chicken & Vegetable Egg Drop',
              ],
            },
            {
              key: "fish",
              label: 'Fish',
              items: [
                'Baked Fish Fillet with Lemon Caper Sauce',
                'Fried Fish Fillet with Chili Garlic Sauce',
                'Pan Fried Fish Fillet in Berlinoise Sauce',
              ],
            },
            {
              key: "vegetable",
              label: 'Vegetable',
              items: [
                'Buttered Mixed Vegetables',
                'Stir Fried Bean Sprout with Mushroom',
                'Mixed Vegetable Provençale',
              ],
            },
            {
              key: "pork",
              label: 'Pork',
              items: [
                'Pork BBQ Ribs',
                'Pork BBQ',
                'Pork Loin Hamonado',
              ],
            },
            {
              key: "pasta",
              label: 'Pasta / Noodles',
              items: [
                'Filipino Style Spaghetti',
                'Spaghetti Bolognese',
                'Spaghetti con Chorizo',
                'Pasta Oriental',
              ],
            },
            {
              key: "dessert",
              label: 'Dessert',
              items: [
                'Cathedral Window Jelly',
                'Yema Cake',
                'Apple and Raisin Pudding',
              ],
            },
            {
              key: "chicken",
              label: 'Chicken',
              items: [
                'Rosemary Chicken with Au Jus',
                'Chicken Afritada',
                'Chicken Confit with Garlic & Potato',
              ],
            },
          ]
        }
      },
      menuSelections: {
        soup: ['Lentil'],
        fish: ['Baked Fish Fillet with Lemon Caper Sauce'],
        chicken: ['Rosemary Chicken with Au Jus'],
        vegetable: ['Buttered Mixed Vegetables'],
        dessert: ['Cathedral Window Jelly']
      },
      subtotal: 41000,
      discountAmount: 0,
      promoAmount: 0,
      downpaymentAmount: 8200,
      total: 41000
    };

    return [roomBooking, eventBooking];
  }

  formatDate(iso?: string) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  formatTime(time?: string) {
    if (!time) return '';
    try {
      // accept 'HH:mm' or 'HH:mm:ss' or 'H:mm' etc.
      const parts = time.split(':').map(p => parseInt(p, 10));
      if (parts.length < 1 || isNaN(parts[0])) return time;
      const hh = parts[0];
      const mm = parts.length > 1 && !isNaN(parts[1]) ? parts[1] : 0;
      const date = new Date();
      date.setHours(hh, mm, 0, 0);
      return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
      return time;
    }
  }

  formatDateTime(isoOrDate?: string, time?: string) {
    if (!isoOrDate && !time) return '';
    try {
      let d: Date | null = null;
      if (isoOrDate) {
        // try to parse full ISO first
        const parsed = new Date(isoOrDate);
        if (!isNaN(parsed.getTime())) d = parsed;
      }
      if (!d && isoOrDate) {
        // isoOrDate may be just YYYY-MM-DD
        d = new Date(isoOrDate + 'T00:00:00');
      }
      // if we still don't have a date, create today
      if (!d) d = new Date();

      // prefer time from the explicit time param if provided
      let hours = d.getHours();
      let minutes = d.getMinutes();
      if (time && typeof time === 'string' && time.includes(':')) {
        const [hh, mm] = time.split(':').map(s => parseInt(s, 10));
        if (!isNaN(hh)) hours = hh;
        if (!isNaN(mm)) minutes = mm;
      }

      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
      const hour12 = hours % 12 === 0 ? 12 : hours % 12;
      const minuteStr = String(minutes).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${dateStr} ${hour12}:${minuteStr}${ampm}`;
    } catch (e) {
      return '';
    }
  }

  statusClass(status: string) {
    switch ((status || '').toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  view(b: any) {
    // open read-only modal with booking details
    this.selectedBooking = b;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBooking = null;
  }

  formatCurrency(v: any) {
    const n = Number(v || 0);
    return n.toLocaleString('en-PH');
  }

  paymentMethodLabel(v: string) {
    if (!v) return '';
    const map: any = {
      'Gcash': 'GCash',
      'G-cash': 'GCash',
      'Card': 'Debit/Credit Card',
      'Maya': 'Maya'
    };
    return map[v] ?? v;
  }

  paymentTypeLabel(v: string) {
    if (!v) return '';
    const map: any = {
      'partial': 'Partial Payment (20% of total)',
      'full': 'Full Payment (100% of total)'
    };
    return map[v] ?? v;
  }

  async cancel(b: any) {
    if (!b || (b.status || '').toLowerCase() === 'cancelled') return;
    const alert = await this.alertCtrl.create({
      header: 'Cancel booking',
      message: 'Are you sure you want to cancel this booking?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes, cancel',
          role: 'confirm',
          handler: () => {
            const idx = this.bookings.findIndex(x => x.id === b.id);
            if (idx === -1) return;
            this.bookings[idx].status = 'Cancelled';
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings();
          }
        }
      ]
    });
    await alert.present();
  }

  editBooking() {
    if (!this.selectedBooking) return;
    this.isEditing = true;
    // Create deep copy for editing
    this.editForm = JSON.parse(JSON.stringify(this.selectedBooking));
  }

  saveBookingEdit() {
    if (!this.editForm || !this.selectedBooking) return;
    const idx = this.bookings.findIndex(b => b.id === this.selectedBooking.id);
    if (idx === -1) return;

    // Update the booking
    this.bookings[idx] = { ...this.editForm };
    localStorage.setItem('bookings', JSON.stringify(this.bookings));

    // Update selected booking and exit edit mode
    this.selectedBooking = this.bookings[idx];
    this.isEditing = false;
    this.editForm = null;
    this.loadBookings();
  }

  cancelEdit() {
    this.isEditing = false;
    this.editForm = null;
  }

  async deleteBooking(booking: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Booking',
      message: 'Are you sure you want to permanently delete this booking? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.bookings = this.bookings.filter(b => b.id !== booking.id);
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings();
            if (this.isModalOpen && this.selectedBooking?.id === booking.id) {
              this.closeModal();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  printBooking() {
    try {
      (window as any).print();
    } catch (e) {
      console.warn('Print not available', e);
    }
  }
}
