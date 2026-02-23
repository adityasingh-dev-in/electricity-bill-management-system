import { Schema, model } from "mongoose";
import { IDepartment } from "../types/department.type";

const departmentSchema: Schema<IDepartment> = new Schema({
    name: {
        type: String,
        required: true,
    },
    buildingCode: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    meterNumber: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export default model<IDepartment>('Department', departmentSchema);
