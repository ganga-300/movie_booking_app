import express from 'express';
import { getUserBookings, updateFavourite, getFavourites } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.put('/update-favourite', updateFavourite);
userRouter.get('/favourites', getFavourites);

export default userRouter;