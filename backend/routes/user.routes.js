import express from 'express';
import { discoverUsers, followUser, getUserData, unfollowUser, updateUserData } from '../controllers/user.controller';
import { protect } from '../middlewares/auth';
import { upload } from '../config/multer';

const userRouter = express.Router();

userRouter.get('/data', protect ,getUserData)

userRouter.post('/update', protect,
    upload.fields([
        {
            name: 'profile_picture',
            maxCount: 1
        },
        {
            name: 'cover_picture',
            maxCount: 1
        }
    ]) ,updateUserData)

userRouter.post('/update', protect, updateUserData)

userRouter.post('/discover', protect, discoverUsers)

userRouter.post('/follow', protect, followUser)

userRouter.post('/unfollow', protect, unfollowUser)

export default userRouter;