import express from 'express';
import { PlaceEntity } from './../entities/places-entity';

const router = express.Router();

router.get('/api/user-places',  async(req, res) => {
    let userPlaces = await PlaceEntity.find({
        where: { isFavorite: true },
        relations: ['image']
    });  
    userPlaces = userPlaces? userPlaces : [];
    // console.log('userPlaces:', userPlaces);
    let responsePlaces = {
        places : userPlaces.map((place) => {
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
    };
    
    console.log('responsePlaces:', responsePlaces);
    res.json(responsePlaces);
});

export {
    router as getUserPlacesRouter
}