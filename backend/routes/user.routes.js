import express from 'express';
import { acceptConnectionRequest, discoverUsers, followUser, getPostsByUser, getUserConnections, getUserData, sendConnectionRequest, unfollowUser, updateUserData } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';
import { getRecentMessages } from '../controllers/message.controller.js';

const userRouter = express.Router();

userRouter.get('/data', protect ,getUserData)

userRouter.post('/update', protect,
    upload.fields([
        {
            name: 'profile_picture',
            maxCount: 1
        },
        {
            name: 'cover_photo',
            maxCount: 1
        }
    ]) ,updateUserData)

userRouter.post('/update', protect, updateUserData)

userRouter.post('/discover', protect, discoverUsers)

userRouter.post('/follow', protect, followUser)

userRouter.post('/unfollow', protect, unfollowUser)

userRouter.post('/connect', protect, sendConnectionRequest)

userRouter.post('/accept', protect, acceptConnectionRequest)

userRouter.get('/connections', protect, getUserConnections)

userRouter.post('/profiles', protect, getPostsByUser)

userRouter.get('/recent-messages', protect, getRecentMessages)
//! idhar dhyan rkhio 

export default userRouter;