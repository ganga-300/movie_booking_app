import  Mongoose  from "mongoose";

const bookingSchema = new Mongoose.Schema({
    user: {type:String , required:true,ref:'User'},
    show: {type:String , required:true},
    amount: {type:Number , required:true},
    bookedSeats: {type:Array , required:true},
    ispaid: {type:Boolean , required:true, default:false},
    paymentLink: {type:String }
},{timestamps:true}
)

const Booking = Mongoose.model('Booking',bookingSchema);

export default Booking;