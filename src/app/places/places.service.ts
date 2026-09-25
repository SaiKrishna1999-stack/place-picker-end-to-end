import { Injectable, signal, inject } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

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
    const currentUserPlaces = this.userPlaces();
    if (!currentUserPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...currentUserPlaces, place]);
    }
    return this.httpClient.put(`http://localhost:3000/user-places`, { placeId: place.id }).pipe(
      tap({
        error: (error) => {
        this.userPlaces.set(currentUserPlaces);
        this.errorService.showError('There is a technical issue while adding the place to user places. Please try again later.');
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

  removeUserPlace(place: Place) {
    return this.httpClient.delete<{ userPlaces: Place[] }>(`http://localhost:3000/user-places/${place.id}`).pipe(
      map((res) => res.userPlaces),
      tap({
        next: (userPlaces) => {
          this.userPlaces.set([...userPlaces]);
        },
        error: (error) => {
          this.errorService.showError('There is a technical issue while removing the place from user places. Please try again later.');
          return throwError(() => new Error('There is a technical issue while removing the place from user places. Please try again later.'));
        }
      })
    );
  }
}
