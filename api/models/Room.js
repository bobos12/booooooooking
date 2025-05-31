import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    MaxPeople: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    RoomNumber: [
        {
            number: {
                type: Number,
                required: true,
                unique: true
            },
            unavailableDates: {
                type: [Date],
                default: [],
                required: true,
                validate: {
                    validator: function(dates) {
                        return dates.every(date => date instanceof Date && !isNaN(date));
                    },
                    message: props => `${props.value} contains invalid date(s)`
                }
            },
        }
    ],
}, {
    timestamps: true,
});



export default mongoose.model("Room", RoomSchema);