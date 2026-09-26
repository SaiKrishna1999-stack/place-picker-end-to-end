import { Injectable, signal, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
    return this.fetchUserPlaces('http://localhost:3000/api/places', 'There is a technical issue while fetching the available places. Please try again later.')
  }

  loadUserPlaces() {
    return this.fetchUserPlaces('http://localhost:3000/api/user-places', 'There is a technical issue while fetching the user places. Please try again later.').pipe(
      tap(
        {
          next: (places) => {
            console.log('Hello world!', places)
            this.userPlaces.set([...places]);
          }
        }
      )
    )
  }

  addPlaceToUserPlaces(place: Place) {
    const currentUserPlaces = this.userPlaces();
    if(!currentUserPlaces.some((p)=> p.id === place.id)){
      return this.httpClient.put(`http://localhost:3000/api/user-places`, { placeId: place.id }).pipe(
        tap({
          next: (userPlace) => {
            this.userPlaces.set([...currentUserPlaces, userPlace as Place]);
          },
          error: (error) => {
          this.userPlaces.set(currentUserPlaces);
          this.errorService.showError('There is a technical issue while adding the place to user places. Please try again later.');
          return throwError(() => new Error('There is a technical issue while adding the place to user places. Please try again later.'));
          }
        })
      );
    }
    else 
      return toObservable(this.userPlaces);
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
    return this.httpClient.delete<{ userPlaces: Place[] }>(`http://localhost:3000/api/user-places/${place.id}`).pipe(
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
