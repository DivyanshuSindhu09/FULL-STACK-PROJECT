import {User} from "../models/user.model.js";
//! get user data using user id

export const getUserData = async (req, res) => {
    try {
        const {userID} = req.auth()
        const user = await User.findById(userID)

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user,
            message: "User data retrieved successfully"
        })

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}