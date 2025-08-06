import { Inngest } from "inngest";
import { User } from "../models/user.model.js";

// Create Inngest client
export const inngest = new Inngest({ id: "axora" });

// --- USER CREATED ---
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, email_addresses, first_name, last_name, image_url } = event.data;

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
      };

      console.log("Attempting to create user with this data:", userData);

      await User.create(userData);

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

// Export Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
