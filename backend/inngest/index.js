import { Inngest } from "inngest";
import {User} from "../models/user.model.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "axora" });

//! ingest function to save data in the database

const syncUserCreation = inngest.createFunction(
    {id : "sync-user-from-clerk"},
    {event : "clerk/user.created"},
    //! ye sab clerk ke webhooks se aya hai
    async ({event}) => {
        const {id, email_addresses, first_name, last_name, image_url} = event.data;

        let username = email_addresses[0].email_address.split("@")[0]; 

        //? checking for availability of username

        const user = await User.findOne({ username });

        if (user) {
            username = `${username}+${Math.floor(Math.random() * 1000)}`;
        }

        const userData = {
            _id : id,
            email: email_addresses[0].email_address,
            full_name: `${first_name} ${last_name}`,
            profile_picture: image_url,
            username,
        }

    await User.create(userData);
    }
)

//! ingest function to change user data in database

const syncUserUpdation = inngest.createFunction(
    {id : "update-user-from-clerk"},
    {event : "clerk/user.updated"},
    //! ye sab clerk ke webhooks se aya hai
    async ({event}) => {
        const {id, email_addresses, first_name, last_name, image_url} = event.data;

        const updatedUserData = {
            email: email_addresses[0].email_address,
            full_name: `${first_name} ${last_name}`,
            profile_picture: image_url,
        }
    await User.findByIdAndUpdate(id, updatedUserData);
    }
)

//! ingest function to delete user data in database

const syncUserDeletion = inngest.createFunction(
    {id : "delete-user-from-clerk"},
    {event : "clerk/user.deleted"},
    //! ye sab clerk ke webhooks se aya hai
    async ({event}) => {
        const {id} = event.data;

        await User.findByIdAndDelete(id);
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];