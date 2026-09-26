import express from 'express';
import { PlaceEntity } from './../entities/places-entity';
import { ImageEntity } from './../entities/image-entity';

const router = express.Router();

router.get('/api/places', async (req, res) => {
    const places = await PlaceEntity.find({ relations: ['image'] });
    // console.log('places:', places);
    let responsePlaces = {
        places: places.map((place) => {
            return {
                id: place.id,
                title: place.title,
                latitude: place.latitude,
                longitude: place.longitude,
                isFavorite: place.isFavorite,
                image: {
                    id: place.image.id,
                    src: place.image.src,
                    alt: place.image.alt
                }
            }
        })
    }
    // console.log('responsePlaces:', responsePlaces);
    res.json(responsePlaces);
});

export {
    router as getAvailablePlacesRouter
}