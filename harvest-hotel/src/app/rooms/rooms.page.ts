import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonModal, IonIcon, IonList, IonItem, IonLabel, IonTabs, IonTab, IonTabButton, IonTabBar, IonSegment, IonSegmentButton, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircleOutline, calendar, personCircle, map, informationCircle, image, bedOutline, peopleOutline, scanOutline, eyeOutline } from 'ionicons/icons';
import { ReviewApiService } from '../services/review-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonModal, IonIcon, IonList, IonItem, IonLabel, IonTabs, IonTab, IonTabButton, IonTabBar, IonSegment, IonSegmentButton, IonInput, IonTextarea]
})
export class RoomsPage implements OnInit {
  public rooms = [
    {
      id: 1,
      title: 'Superior Twin',
      price: 3500,
      image: 'superior-twin.png',
      description: 'Two single beds in the Superior Twin (47 rooms, our most-booked category), built for friends, colleagues, and small families. Enjoy modern comfort with thoughtful details like plush bedding, comprehensive in-room amenities, and attentive service.',
      sqm: 29,
      capacity: '2 Adults',
      bedConfig: 'Twin Beds',
      features: [
        'High-Speed WiFi',
        'Writing Desk & Chair',
        'Cable TV',
        'Telephone',
        'Safety Deposit Box',
        'In-Room Coffee & Tea',
        'Minibar',
        'Air Conditioning',
        'Ensuite Bathroom',
        'Bathroom Amenities',
      ]
    },
    {
      id: 2,
      title: 'Superior Queen',
      price: 3800,
      image: 'superior-queen.png',
      description: 'A queen bed in the Superior Queen (19 rooms), for couples, solo business travelers, and anyone who wants a little more room to spread out. Complete with premium bedding, rainfall shower, dedicated work desk, and Filipino hospitality.',
      sqm: 29,
      capacity: '2 Adults',
      bedConfig: '1 Queen Bed',
      features: [
        'High-Speed WiFi',
        'Writing Desk & Chair',
        'Cable TV',
        'Telephone',
        'Safety Deposit Box',
        'In-Room Coffee & Tea',
        'Minibar',
        'Air Conditioning',
        'Ensuite Bathroom',
        'Bathroom Amenities',
      ]
    },
    {
      id: 3,
      title: 'Deluxe Room',
      price: 4500,
      image: 'deluxe-room.png',
      description: 'The Deluxe Room arrives with a small daily welcome — a pastry, a slice of cake, or fresh fruit, depending on the day. Featuring 8 spacious rooms with refined interiors, plush seating, and generous natural lighting.',
      sqm: 32,
      capacity: '2-3 Adults',
      bedConfig: '1 Queen or King Bed',
      features: [
        'High-Speed WiFi',
        'Daily Welcome Treat (Pastry / Fruit)',
        'Writing Desk & Chair',
        'Cable TV',
        'Telephone',
        'Safety Deposit Box',
        'In-Room Coffee & Tea',
        'Minibar',
        'Air Conditioning',
        'Ensuite Bathroom & Amenities',
      ]
    },
    {
      id: 4,
      title: 'Executive Suite',
      price: 5800,
      image: 'executive-suite.png',
      description: 'The Executive Suite is our premium 38 sqm category (6 rooms), featuring a Nespresso coffee machine, upgraded amenities, a generously laid-out bedroom, and lavish bathroom for guests who desire suite-tier comfort.',
      sqm: 38,
      capacity: '2-3 Adults',
      bedConfig: '1 King Bed',
      features: [
        'High-Speed WiFi',
        'Nespresso Coffee Machine',
        'Upgraded Suite Amenities',
        'Writing Desk & Lounge Seating',
        'Cable TV',
        'Safety Deposit Box',
        'Minibar & Refrigerator',
        'Air Conditioning',
        'Bathrobes & Slippers',
        'Luxury Ensuite Bathroom',
      ]
    },
    {
      id: 5,
      title: 'Harvest Suite',
      price: 7500,
      image: 'harvest-suite.png',
      description: 'The Harvest Suite is the one we keep for the milestone stay: 58 sqm, the only suite in the property with a separate living room, dining area, and master bedroom. One of one, reserved for the trips that earn it.',
      sqm: 58,
      capacity: '2-4 Adults',
      bedConfig: '1 King Bed + Living Area',
      features: [
        'High-Speed WiFi',
        'Separate Living Room & Dining Area',
        'Nespresso Coffee Machine',
        'Two Cable TVs',
        'Safety Deposit Box',
        'Minibar & Refrigerator',
        'Air Conditioning',
        'Bathrobes & Premium Slippers',
        'Bathtub & Rainfall Shower',
        'Exclusive Suite Service',
      ]
    },
    {
      id: 6,
      title: 'Loft Suite',
      price: 8800,
      image: 'loft-suite.png',
      description: 'Our two Loft Suites, split across two levels with dramatic high ceilings, are the largest accommodations in the property, offering distinct upper and lower living quarters kept for the moments worth marking.',
      sqm: 65,
      capacity: '2-4 Adults',
      bedConfig: 'Two-Level Split (King Bed + Lounge)',
      features: [
        'High-Speed WiFi',
        'Two-Level Mezzanine Architectural Layout',
        'Spacious Living Area on Lower Level',
        'Master Bedroom on Upper Mezzanine',
        'Nespresso Coffee Machine',
        'Multiple Cable TVs',
        'Safety Deposit Box',
        'Minibar & Refrigerator',
        'Double Vanity Ensuite Bathroom',
        'VIP Welcome Amenities',
      ]
    },
  ];

  public isModalOpen = false;
  public selectedRoom: any = null;
  public submitting = false;

  constructor(private reviewApi: ReviewApiService, private router: Router) {
    addIcons({ arrowBack, checkmarkCircleOutline, calendar, personCircle, map, informationCircle, bedOutline, peopleOutline, scanOutline, eyeOutline });
  }

  ngOnInit() {
  }

  formatPrice(value: number | string): string {
    const num = typeof value === 'number' ? value : Number(value) || 0;
    return num.toLocaleString('en-PH');
  }

  async openDetails(room: any) {
    this.selectedRoom = room;
    this.isModalOpen = true;
    // load reviews for this room (use room.title as fallback id)
    // load reviews for this room from API (MySQL-backed)
    this.reviews = [];
    this.reviewApi.getReviews(String(room.id ?? room.title)).subscribe({
      next: (rs) => this.reviews = rs || [],
      error: (err) => {
        console.error('Failed to load reviews from API', err);
        this.reviews = [];
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRoom = null;
  }

  /* Reviews data and form */
  public reviews: Array<any> = [];

  public reviewTab: 'read' | 'write' = 'read';
  public reviewForm = {
    id: null as number | null,
    name: '',
    rating: 0,
    comment: ''
  };
  public editingReview = false;

  setReviewTab(tab: any) {
    // ion-segment emits a SegmentValue | undefined — coerce to our union type
    const value = (tab as string) || 'read';
    this.reviewTab = value === 'write' ? 'write' : 'read';
  }

  submitReview() {
    const { id, name, rating, comment } = this.reviewForm;
    if (!name || !rating || !comment) {
      return;
    }
    const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    if (this.editingReview && id) {
      // Update existing review
      this.reviewApi.updateReview(String(this.selectedRoom.id ?? this.selectedRoom.title), id, { name, date, rating, comment }).subscribe({
        next: (updatedReview) => {
          const idx = this.reviews.findIndex(r => r.id === id);
          if (idx !== -1) this.reviews[idx] = updatedReview;
          this.reviewForm = { id: null, name: '', rating: 0, comment: '' };
          this.editingReview = false;
          this.reviewTab = 'read';
        },
        error: (err) => console.error('Failed to update review', err)
      });
    } else {
      // Create new review
      this.reviewApi.addReview(String(this.selectedRoom.id ?? this.selectedRoom.title), { name, date, rating, comment }).subscribe({
        next: (newReview) => {
          this.reviews.unshift(newReview);
          this.reviewForm = { id: null, name: '', rating: 0, comment: '' };
          this.reviewTab = 'read';
        },
        error: (err) => console.error('Failed to save review', err)
      });
    }
  }

  deleteReview(id: number) {
    this.reviewApi.deleteReview(String(this.selectedRoom.id ?? this.selectedRoom.title), id).subscribe({
      next: () => this.reviews = this.reviews.filter(r => r.id !== id),
      error: (err) => console.error('Failed to delete review', err)
    });
  }

  setRating(value: number) {
    this.reviewForm.rating = value;
  }

  editReview(review: any) {
    this.reviewForm = {
      id: review.id,
      name: review.name,
      rating: review.rating,
      comment: review.comment
    };
    this.editingReview = true;
    this.reviewTab = 'write';
  }

  cancelEdit() {
    this.reviewForm = { id: null, name: '', rating: 0, comment: '' };
    this.editingReview = false;
    this.reviewTab = 'read';
  }

  bookNow() {
    if (!this.selectedRoom) return;
    const roomToBook = { ...this.selectedRoom };
    this.closeModal();
    this.router.navigate([`/booking`, roomToBook.id], { state: { room: roomToBook } });
  }

}
