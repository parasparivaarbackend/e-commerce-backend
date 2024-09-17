import { Schema ,model} from "mongoose"


const tarckOrderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trackingID:{
        type:String,
        required:true
    },
    TokenNumber:{
        type:String,
        required:true
    },
    PickupDate:{
        type:String
    }
})

export const TrackModel = model("TackOrder", tarckOrderSchema)