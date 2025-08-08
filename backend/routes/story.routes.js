import express from 'express'
import { protect } from '../middlewares/auth.js'
import { upload } from '../config/multer.js'
import { createStory, getFriendsStories } from '../controllers/story.controller.js'

const storyRouter = express.Router()

storyRouter.post('/create',  protect, upload.fields('media'), createStory)
storyRouter.get('/get', protect, getFriendsStories)

export default storyRouter