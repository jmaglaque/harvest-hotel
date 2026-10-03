import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  // Update this base URL to your live Render/Railway URL when deployed
  // e.g. 'https://harvest-hotel-api.onrender.com/api'
  private baseUrl = (typeof window !== 'undefined' && (window as any).API_URL) 
    ? (window as any).API_URL 
    : 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Helper for localStorage fallback
  private getLocalReviews(roomId: string): any[] {
    try {
      const stored = localStorage.getItem(`reviews_${roomId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
    // Default initial seed reviews for portfolio display if DB is cold
    return [
      {
        id: 101,
        roomId: roomId,
        name: 'Maria Santos',
        date: 'October 2, 2026',
        rating: 5,
        comment: 'Exceptional service and extremely clean room! The beds were very comfortable.'
      },
      {
        id: 102,
        roomId: roomId,
        name: 'Carlos Mendoza',
        date: 'September 28, 2026',
        rating: 5,
        comment: 'Warm Filipino hospitality at its finest. Will definitely stay here again!'
      }
    ];
  }

  private saveLocalReviews(roomId: string, reviews: any[]) {
    try {
      localStorage.setItem(`reviews_${roomId}`, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  getReviews(roomId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/rooms/${encodeURIComponent(roomId)}/reviews`).pipe(
      catchError((err) => {
        console.warn('API unavailable, using local reviews fallback:', err.message);
        return of(this.getLocalReviews(roomId));
      })
    );
  }

  addReview(roomId: string, review: { name: string; date: string; rating: number; comment: string }) {
    return this.http.post<any>(`${this.baseUrl}/rooms/${encodeURIComponent(roomId)}/reviews`, review).pipe(
      catchError((err) => {
        console.warn('API unavailable, saving review locally:', err.message);
        const list = this.getLocalReviews(roomId);
        const newReview = { id: Date.now(), roomId, ...review };
        list.unshift(newReview);
        this.saveLocalReviews(roomId, list);
        return of(newReview);
      })
    );
  }

  updateReview(roomId: string, id: number, review: { name: string; date: string; rating: number; comment: string }) {
    return this.http.put<any>(`${this.baseUrl}/rooms/${encodeURIComponent(roomId)}/reviews/${id}`, review).pipe(
      catchError((err) => {
        console.warn('API unavailable, updating review locally:', err.message);
        const list = this.getLocalReviews(roomId);
        const idx = list.findIndex(r => r.id === id);
        const updated = { id, roomId, ...review };
        if (idx !== -1) list[idx] = updated;
        this.saveLocalReviews(roomId, list);
        return of(updated);
      })
    );
  }

  deleteReview(roomId: string, id: number) {
    return this.http.delete(`${this.baseUrl}/rooms/${encodeURIComponent(roomId)}/reviews/${id}`).pipe(
      catchError((err) => {
        console.warn('API unavailable, deleting review locally:', err.message);
        const list = this.getLocalReviews(roomId).filter(r => r.id !== id);
        this.saveLocalReviews(roomId, list);
        return of(null);
      })
    );
  }
}

