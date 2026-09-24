import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  isFetchingPlaces = signal<boolean>(false);
  error = signal<string>('');
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  places = this.placesService.loadedUserPlaces;
  
  ngOnInit() {
    this.isFetchingPlaces.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
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
