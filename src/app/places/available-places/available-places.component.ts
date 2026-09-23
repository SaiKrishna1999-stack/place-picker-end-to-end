import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetchingPlaces = signal<boolean>(false);
  error = signal<string>('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetchingPlaces.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places').pipe( map((res) => res.places), 
    catchError((error) => {
      return throwError(() => 
        new Error(
          'There is a technical issue while fetching the places. Please try again later.'
        )
      );
    })).subscribe({
      next: (places) => {
        console.log('responseData', places);
        this.places.set([...places]);
      },
      error: (error) => {
        console.error('Error fetching places:', error);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetchingPlaces.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

  }   
  
}
