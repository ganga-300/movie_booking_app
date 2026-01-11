import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Stripe from 'stripe';
// function to check availability of selected seats for a movie ;
export const checkSeatAvailability = async (showId, selectedSeats) => {
    try{

        const showData = await Show.findById(showId);
        if(!showData){
            res.status(404).json({success:false,message:"Show not found"});
        }

        const occupiedSeats = showData.occupiedSeats ;
        const isAnySeatsTaken = selectedSeats.some(seat => occupiedSeats[seat]);
        return !isAnySeatsTaken;

    } catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:error.message});

    }
}

export const createBooking = async (req, res) => {  
    try{
        const {userId} = req.auth();
        const {showId, selectedSeats } = req.body;
        const {origin} = req.headers;
        // check if the seat is available
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);
        if(!isAvailable){
            return res.status(400).json({success:false,message:"Selected seats are already booked. Please choose different seats."});
        }

        // gwet show details
        const showData = await Show.findById(showId).populate('movie');
        
        // create a new booking;
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: selectedSeats.length * showData.showPrice,
            bookedSeats: selectedSeats,
    
        });

        selectedSeats.forEach(seat => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');
        await showData.save();

        // strip gateway initiation
        const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data : {
                currency : 'usd',
                product_data : {
                    name : showData.movie.title ,
                    
                },
                unit_amount : Math.floor(booking.amount * 100),
            },
            quantity : 1    ,
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-bookings`,
            cancel_url : `${origin}/my-bookings`,
            line_items:line_items,
            metadata : {
                bookingId : booking._id.toString(),
            },
            expires_at : Math.floor(Date.now() / 1000) + 30 * 60 ,
            mode : 'payment',
            }
        )

        booking.paymentLink = session.url;
        await booking.save();


        res.json({success:true,url:session.url});




    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
    }
    

}


export const getOccupiedSeats = async (req, res) => {
    try{
        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats); ;
        
        res.json({success:true, occupiedSeats});



    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
    }
    
}