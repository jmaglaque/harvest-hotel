import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonModal, IonIcon, IonList, IonItem, IonLabel, IonTabs, IonTab, IonTabButton, IonTabBar, IonSegment, IonSegmentButton, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, checkmarkCircleOutline, calendar, personCircle, map, informationCircle, restaurantOutline, sparklesOutline, timeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonMenuButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonModal, IonIcon, IonList, IonItem, IonLabel, IonTabs, IonTab, IonTabButton, IonTabBar, IonSegment, IonSegmentButton, IonInput, IonTextarea]
})
export class EventsPage implements OnInit {
  public events = [
    {
      id: 1,
      title: 'Grand Ballroom Wedding Package',
      image: 'event-wedding.png',
      inclusions: [
        'Overnight Stay in a Superior Room with Breakfast for Two (2) at Café Ecija',
        'Complimentary Use of Hotel Scenic Areas for Photoshoot',
        'Elegant Floral Centerpieces & Bridal Backdrop Styling',
        'Comprehensive Food Tasting for Two (2)',
        'Two-tiered Basic Fondant Cake',
        'Plated or Managed Buffet by Café Ecija',
        'Use of Grand Ballroom for Four (4) Hours',
        'Basic Sound System & Ambient Lighting',
      ],
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
            key: 'soup',
            label: 'Soup',
            items: [
              'Lentil',
              'Crab and Corn',
              'Chicken & Vegetable Egg Drop',
            ],
          },
          {
            key: 'fish',
            label: 'Fish',
            items: [
              'Baked Fish Fillet with Lemon Caper Sauce',
              'Fried Fish Fillet with Chili Garlic Sauce',
              'Pan Fried Fish Fillet in Berlinoise Sauce',
            ],
          },
          {
            key: 'vegetable',
            label: 'Vegetable',
            items: [
              'Buttered Mixed Vegetables',
              'Stir Fried Bean Sprout with Mushroom',
              'Mixed Vegetable Provençale',
            ],
          },
          {
            key: 'pork',
            label: 'Pork',
            items: [
              'Pork BBQ Ribs',
              'Pork BBQ',
              'Pork Loin Hamonado',
            ],
          },
          {
            key: 'pasta',
            label: 'Pasta / Noodles',
            items: [
              'Filipino Style Spaghetti',
              'Spaghetti Bolognese',
              'Spaghetti con Chorizo',
              'Pasta Oriental',
            ],
          },
          {
            key: 'dessert',
            label: 'Dessert',
            items: [
              'Cathedral Window Jelly',
              'Yema Cake',
              'Apple and Raisin Pudding',
            ],
          },
          {
            key: 'chicken',
            label: 'Chicken',
            items: [
              'Rosemary Chicken with Au Jus',
              'Chicken Afritada',
              'Chicken Confit with Garlic & Potato',
            ],
          },
        ]
      },
    },
    {
      id: 2,
      title: 'Socials & Debut Celebration Package',
      image: 'event-ballroom.png',
      inclusions: [
        'Overnight Stay in a Deluxe Room with Breakfast for Two (2)',
        'Four (4) Hours Exclusive Use of the Grand Ballroom',
        'Custom Debut / Milestone Themed Centerpieces & Backdrop',
        'Signature Managed Banquet Buffet by Café Ecija',
        'Basic Sound System, Wireless Microphones & Mood Lighting',
        'Complimentary 18 Roses & 18 Candles Setup',
        'Dedicated Banquet Captain & Service Staff',
      ],
      rates: [
        { pax: '30 Pax', price: 38000 },
        { pax: '50 Pax', price: 52000 },
        { pax: '80 Pax', price: 71000 },
        { pax: '100 Pax', price: 85000 },
        { pax: '150 Pax', price: 120000 },
      ],
      extraPaxPrice: 700,
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
            key: 'soup',
            label: 'Soup',
            items: ['Crab and Corn', 'Chicken & Vegetable Egg Drop', 'Pumpkin Bisque'],
          },
          {
            key: 'fish',
            label: 'Fish',
            items: ['Baked Fish Fillet with Lemon Caper Sauce', 'Pan Fried Fish Fillet in Berlinoise Sauce'],
          },
          {
            key: 'vegetable',
            label: 'Vegetable',
            items: ['Buttered Mixed Vegetables', 'Mixed Vegetable Provençale'],
          },
          {
            key: 'pork',
            label: 'Pork',
            items: ['Pork BBQ Ribs', 'Pork Loin Hamonado', 'Sweet and Sour Pork'],
          },
          {
            key: 'pasta',
            label: 'Pasta / Noodles',
            items: ['Spaghetti Bolognese', 'Pasta Oriental', 'Creamy Carbonara'],
          },
          {
            key: 'dessert',
            label: 'Dessert',
            items: ['Yema Cake', 'Cathedral Window Jelly', 'Mango Panna Cotta'],
          },
          {
            key: 'chicken',
            label: 'Chicken',
            items: ['Rosemary Chicken with Au Jus', 'Chicken Afritada', 'Garlic Butter Roast Chicken'],
          },
        ]
      },
    },
    {
      id: 3,
      title: 'Corporate Conference & Seminar Package',
      image: 'event-social.png',
      inclusions: [
        'Four (4) Hours Rental of the Ballroom / Function Hall',
        'High-Speed Wi-Fi for all Seminar Attendees',
        'LCD Projector, Large Screen, Whiteboard & Podium Microphones',
        'Plated Executive Lunch or Managed Corporate Buffet',
        'Morning or Afternoon Snack with Free-flowing Café Ecija Coffee & Tea',
        'Conference Note Pads, Pens & Mints for Participants',
        'On-site Technical & Event Support',
      ],
      rates: [
        { pax: '30 Pax', price: 32000 },
        { pax: '50 Pax', price: 46000 },
        { pax: '80 Pax', price: 65000 },
        { pax: '100 Pax', price: 78000 },
        { pax: '150 Pax', price: 110000 },
      ],
      extraPaxPrice: 650,
      menu: {
        choiceOf: {
          text: 'Choice of one (1) Soup, two (2) Main Course, one (1) Vegetable or Pasta, Rice, Dessert, and one (1) round of Iced Tea.',
          entries: [
            { count: 1, label: 'Soup', keys: ['soup'] },
            { count: 2, label: 'Main Course', keys: ['fish','pork','chicken'] },
            { count: 1, label: 'Vegetable or Pasta', keys: ['vegetable','pasta'] },
            { count: 1, label: 'Rice', keys: [] },
            { count: 1, label: 'Dessert', keys: ['dessert'] },
            { count: 1, label: 'Iced Tea', keys: [] },
          ]
        },
        category: [
          {
            key: 'soup',
            label: 'Soup',
            items: ['Mushroom Soup', 'Chicken & Vegetable Egg Drop', 'Crab and Corn'],
          },
          {
            key: 'fish',
            label: 'Fish',
            items: ['Baked Fish Fillet with Lemon Butter', 'Fried Fish Fillet with Chili Garlic Sauce'],
          },
          {
            key: 'vegetable',
            label: 'Vegetable',
            items: ['Buttered Mixed Vegetables', 'Stir Fried Seasonal Vegetables'],
          },
          {
            key: 'pork',
            label: 'Pork',
            items: ['Pork BBQ Ribs', 'Pork Loin with Mushroom Gravy'],
          },
          {
            key: 'pasta',
            label: 'Pasta / Noodles',
            items: ['Spaghetti Bolognese', 'Pasta Carbonara', 'Pancit Canton'],
          },
          {
            key: 'dessert',
            label: 'Dessert',
            items: ['Fresh Fruit Platter', 'Yema Cake', 'Caramel Flan'],
          },
          {
            key: 'chicken',
            label: 'Chicken',
            items: ['Rosemary Roast Chicken', 'Chicken Pastel', 'Chicken Teriyaki'],
          },
        ]
      },
    },
  ];

  public isModalOpen = false;
  public selectedRoom: any = null;

  constructor(private router: Router) {
    addIcons({ arrowBack, checkmarkCircleOutline, calendar, personCircle, map, informationCircle, restaurantOutline, sparklesOutline, timeOutline });
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
  }

  bookNow(event: any) {
    this.closeModal();
    // navigate to event booking page, pass event in state
    this.router.navigate([`/event-booking`, event.id], { state: { event } });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRoom = null;
  }

  formatChoiceOf(choiceOf: any) {
    if (!choiceOf) return '';
    if (typeof choiceOf === 'string') return choiceOf;
    if (choiceOf.text) return choiceOf.text;
    if (Array.isArray(choiceOf.entries)) {
      // build a readable sentence from entries
      return choiceOf.entries.map((e: any) => `${e.count} × ${e.label}`).join(', ');
    }
    return '';
  }
}

