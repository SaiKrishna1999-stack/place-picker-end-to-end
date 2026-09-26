import { createConnection } from 'typeorm';
import { PlaceEntity } from './entities/places-entity';
import { ImageEntity } from './entities/image-entity';
import { createPlaceRouter } from './routes/create_places';
import { getAvailablePlacesRouter } from './routes/getAvailablePlaces';
import { getUserPlacesRouter } from './routes/getUserPlaces';
import { addFavoritePlaceRouter } from './routes/addFavoritePlace';
import { removeUserPlaceRouter } from './routes/removeUserPlace';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.static("images"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});
app.use(createPlaceRouter);
app.use(getAvailablePlacesRouter);
app.use(getUserPlacesRouter);
app.use(addFavoritePlaceRouter);
app.use(removeUserPlaceRouter);

const main = async () => {
    try {
        await createConnection(
            {
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'krishna',
                password: undefined,
                database: 'typeorm',
                entities: [PlaceEntity, ImageEntity],
                synchronize: true,
                logging: true,
            }
        );
        console.log('Connected to the postgres database successfully!');
        app.listen(3000,()=>{
            console.log('Server is running on port 3000');
        })
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

main(); 
