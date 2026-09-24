import { Injectable, signal, inject } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
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
    return this.fetchUserPlaces('http://localhost:3000/user-places', 'There is a technical issue while fetching the user places. Please try again later.')
  }

  addPlaceToUserPlaces(place: Place) {
    return this.httpClient.put(`http://localhost:3000/user-places`, { placeId: place.id });
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
