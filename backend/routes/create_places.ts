import express from 'express';
import { PlaceEntity } from './../entities/places-entity';
import { ImageEntity } from './../entities/image-entity';

const router = express.Router();

router.post('/api/places',  async(req, res) => {
    const {
        title,
        latitude,
        longitude,
        isFavorite,
    } = req.body;

    const {
     src, alt
    } = req.body.image;

    const image = new ImageEntity();
    image.src = src;
    image.alt = alt;

    const place = new PlaceEntity();
    place.title = title;
    place.latitude = latitude;
    place.longitude = longitude;
    place.isFavorite = isFavorite;
    place.image = image;

    await place.save();

    res.json(place);
})


export {
    router as createPlaceRouter
}