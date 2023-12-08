import mongoose from "mongoose";


const billSchema = new mongoose.Schema({
    rechnungsNummer:{
        type: Number,
        required: true
    },
    rechnungsBetrag:{
        type: Number,
        required: true
    },
    rechnungsBetragNeu:{
        type: Number,
        required: true
    },
    rechnungsDatum:{
        type: Date,
        required: true
    }

})


export default mongoose.model("Bill", billSchema);