// import { User } from "@clerk/express";
import { Inngest } from "inngest";
import User from "../models/User.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });


// ingest function save user data to database
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async({event})=>{ 
        const {id,first_name,last_mail,email_addresses,image_url} = event.data;
        const userData = {
            _id:id,
            name:`${first_name} ${last_mail}`,
            email:email_addresses[0].email_address,
            image:image_url

    }

    await User.create(userData);
}
)

// ingest function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event:'clerk/user.deleted'},
    async({event})=>{
        const {id} = event.data;

        await User.findByIdAndDelete(id);
    }
)

// ingest function to user updation in database
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async({event})=>{
        const {id,first_name,last_mail,email_addresses,image_url} = event.data;
        const userData = {
            name:`${first_name} ${last_mail}`,
            email:email_addresses[0].email_address,
            image:image_url

    }

    await User.findByIdAndUpdate(id,userData);
}
)



// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];


