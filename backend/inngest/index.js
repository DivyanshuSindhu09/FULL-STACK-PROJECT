import { Inngest } from "inngest";
import { User } from "../models/user.model.js";
import { Connection } from "../models/connection.model.js";
import sendEmail from "../config/nodemailer.js";
import { Story } from "../models/story.model.js";
import { Message } from "../models/message.model.js";

// Create Inngest client
export const inngest = new Inngest({ id: "axora" });

// --- USER CREATED ---
import mongoose from 'mongoose';


const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }

      if (!email_addresses?.[0]?.email_address) {
        throw new Error("Missing email address in event");
      }

      let username = email_addresses[0].email_address.split("@")[0];
      const userExists = await User.findOne({ username });
      if (userExists) {
        username = `${username}+${Math.floor(Math.random() * 1000)}`;
      }

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
        username,
        following: ["user_31K0nO3itymaTRsIfdNYVyJaFTL"]
      };

      console.log("Attempting to create user with this data:", userData);

      await User.create(userData);

      await User.findByIdAndUpdate("user_31K0nO3itymaTRsIfdNYVyJaFTL", {
        $addToSet: { followers: id }
      });

      console.log("User created and followers updated ✅");

      return { message: "User created successfully" };
    } catch (err) {
      console.error("syncUserCreation error:", err);
      throw err;
    }
  }
);

// --- USER UPDATED ---
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const updatedUserData = {
        email: email_addresses?.[0]?.email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
      };

      await User.findByIdAndUpdate(id, updatedUserData);

      return { message: "User updated successfully" };
    } catch (err) {
      console.error("syncUserUpdation error:", err);
      throw err;
    }
  }
);

// --- USER DELETED ---
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;
      await User.findByIdAndDelete(id);
      return { message: "User deleted successfully" };
    } catch (err) {
      console.error("syncUserDeletion error:", err);
      throw err;
    }
  }
);

//! function to send reminder for a connection request

const sendNewConnectionReminder = inngest.createFunction(
  {id: "send-new-connection-request-reminder"},
  {event : "app/connection-request"},
  async ({event, step}) => {
    const {connectionId} = event.data

    await step.run('send-connection-request-mail', async ()=> {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')
      const subject = `New Connection Request`
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Hi ${connection.to_user_id.full_name},</h2>
  <p>You have a new connection request from ${connection.from_user_id.full_name} – @${connection.from_user_id.username}</p>
  <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
  <br/>
  <p>Thanks,<br/>PingUp – Stay Connected</p>
</div>`
      await sendEmail({
        to : connection.to_user_id.email,
        subject,
        body
      })
    })
  }
)
//! 24 ghante baad wali mail baad mein lagaenge


//! to delete story after 24hrs

const deleteStory = inngest.createFunction(
  {id : "story-delete"},
  {event : "app/story.delete"},
  async ({event, step}) => {
    const {storyId} = event.data
    const in24Hours = new Date(Date.now() + 24*60*60*1000 )

    await step.sleepUntil('wait-for-24-hours', in24Hours)
    await step.run("delete-story", async()=> {
      await Story.findByIdAndDelete(storyId)
      return {message : "Story Was Deleted"}
    })
  }
)


const sendNotificationsForUnseenMessages = inngest.createFunction(
  {
    id : "send-unseen-messages-notification"
  },
  {
    cron : "TZ=America/New_York 0 9 * * *" //! will get executed automatically everyday at 9am
  },
  async ({step}) => {
    const messages = await Message.find({seen : false}).populate("to_user_id")
    //! find method array return krta h
    const unseenCount = {}

    messages.map((message)=>{
      unseenCount[message.to_user_id._id] = (unseenCount[message.to_user_id._id] || 0) + 1
    })

    for (const userId in unseenCount) {
    const user = await User.findById(userId);

    const subject = `📩 You have ${unseenCount[userId]} unseen messages`;

    const body = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Hi ${user.full_name},</h2>
            <p>You have ${unseenCount[userId]} unseen messages</p>
            <p>
                Click 
                <a href="${process.env.FRONTEND_URL}/messages" style="color: #10b981;">
                    here
                </a> 
                to view them
            </p>
            <br>
            <p>Thanks,<br>PingUp – Stay Connected</p>
        </div>
    `;
    await sendEmail({
      to : user.email,
      subject,
      body
    })
}
  return {message : "notification sent"}
  }
)

// Export Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion, sendNewConnectionReminder,
  deleteStory, sendNotificationsForUnseenMessages
];
