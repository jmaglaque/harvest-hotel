import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./rooms/rooms.page').then( m => m.RoomsPage)
  },
  {
    path: 'events',
    loadComponent: () => import('./events/events.page').then( m => m.EventsPage)
  },
  {
    path: 'booking/:roomId',
    loadComponent: () => import('./booking/booking.page').then(m => m.BookingPage)
  },
  {
    path: 'booking-history',
    loadComponent: () => import('./booking-history/booking-history.page').then(m => m.BookingHistoryPage)
  },
  {
    path: 'event-booking/:eventId',
    loadComponent: () => import('./event-booking/event-booking.page').then(m => m.EventBookingPage)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./gallery/gallery.page').then( m => m.GalleryPage)
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.page').then( m => m.AccountPage)
  }
];
