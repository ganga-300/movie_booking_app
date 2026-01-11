// api to check if user is admin

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

export const isAdmin = async(req, res) => {
   try {
        const {userId} = req.auth;
        const user = await clerkClient.users.getUser(userId);
        
        const isAdmin = user.privateMetadata.role === 'admin';
        
        res.json({success: true, isAdmin});
        
    } catch(error) {
        console.log(error);
        res.json({success: false, isAdmin: false, message: error.message});
    }
   
}

export const getDashboardData = async (req, res) => {
  try {
   const bookings = await Booking.find({isPaid:true});
   const activeShows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie');

   const totalUser = await  User.countDocuments();

   const dashboardData = {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((total, booking) => total + booking.amount, 0),
    activeShows,
    totalUser
   }

   res.json({success:true, data:dashboardData});
    
  } catch(error){
    console.log(error)
    res.json({success:false, message:error.message});

  }
}


// Api to get all shows

export const getAllShows = async (req, res) => {
    try{

        const shows = await Show.find({showDateTime:{$gte: new Date()}}).populate('movie').sort({showDateTime:1});
        res.json({success:true, shows});

    } catch(error){
        console.log(error)  
        res.json({success:false, message:error.message});
    }
}

// API to get all booking
export const getAllBookings = async (req, res) => { 
    try{
        const bookings = await Booking.find({}).populate('user').populate({ 
            path:'show',
            populate:{path:'movie'}
         }).sort({createdAt:-1});
        res.json({success:true, bookings});


    } catch(error){
        console.log(error)  
        res.json({success:false, message:error.message});
    }
}