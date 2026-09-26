import express from 'express';
import { PlaceEntity } from './../entities/places-entity';

const router = express.Router();

router.put('/api/user-places',  async(req, res) => {
    const {
        placeId
    } = req.body;

    const place = await PlaceEntity.findOne({
        where: { id: placeId },
        relations: ['image']
    });
    
    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }

    place.isFavorite = true;
    await place.save();

    res.json(place);
})

export {
    router as addFavoritePlaceRouter
}