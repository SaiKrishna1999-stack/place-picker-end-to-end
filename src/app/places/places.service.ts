import { Injectable, signal, inject } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchUserPlaces('http://localhost:3000/places', 'There is a technical issue while fetching the available places. Please try again later.')
  }

  loadUserPlaces() {
    return this.fetchUserPlaces('http://localhost:3000/user-places', 'There is a technical issue while fetching the user places. Please try again later.').pipe(
      tap(
        {
          next: (places) => {
            this.userPlaces.set([...places]);
          }
        }
      )
    )
  }

  addPlaceToUserPlaces(place: Place) {
    if (!this.userPlaces().some((p) => p.id === place.id)) {
      this.userPlaces.set([...this.userPlaces(), place]);
    }
    return this.httpClient.put(`http://localhost:3000/user-places`, { placeId: place.id }).pipe(
      tap({
        error: (error) => {
        this.userPlaces.set(this.userPlaces());
        return throwError(() => new Error('There is a technical issue while adding the place to user places. Please try again later.'));
        }
      })
    );
  }

  fetchUserPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).pipe( map((res) => res.places), 
      catchError((error) => {
        return throwError(() => 
          new Error(
            errorMessage
          )
        );
      })
    );
  }

  removeUserPlace(place: Place) {}
}
