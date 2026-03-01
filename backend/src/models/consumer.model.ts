import { Schema, model } from "mongoose";
import { IConsumer } from "../types/consumer.type";

const ConsumerSchema: Schema<IConsumer> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    houseNumber: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    meterNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });





export default model<IConsumer>('Consumer', ConsumerSchema);
