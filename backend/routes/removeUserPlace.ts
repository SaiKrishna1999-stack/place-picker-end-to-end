import express from 'express';
import { PlaceEntity } from './../entities/places-entity';

const router = express.Router();

router.delete('/api/user-places/:id',  async(req, res) => {
    const placeId = req.params.id;

    const place = await PlaceEntity.findOne({
        where: { id: placeId }
    });
    
    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }

    place.isFavorite = false;
    await place.save();

    const places = await PlaceEntity.find({
        where: {isFavorite: true},
        relations: ['image']
    });

    let responsePlaces = {
        userPlaces: places.map((place) => {
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
})

export {
    router as removeUserPlaceRouter
}