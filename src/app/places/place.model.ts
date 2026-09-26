export interface Place {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}
