import mongoose from "mongoose";
import { userRole } from "../constants/constants.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        role: {
            type: String,
            enum: [userRole.MANAGER, userRole.USER],
            default: userRole.USER
        },
        password: {
            type: String,
            required: true,
        }
    },{
        timestamps: true
    }
)

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}


export const Users = mongoose.model("users", userSchema)