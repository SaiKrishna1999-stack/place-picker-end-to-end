import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

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
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetchingPlaces.set(true);
    const subscription = 
    this.placesService.loadAvailablePlaces().subscribe({
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
  
  onSelectedPlace(place: Place) {
    console.log('Selected place:', place);
    this.placesService.addPlaceToUserPlaces(place).subscribe({
      next: () => {
        console.log('Place added to user places:', place);
      },
      error: (error) => {
        console.error('Error adding place to user places:', error);
      }
    });
  }
}
