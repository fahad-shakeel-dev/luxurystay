import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        authProvider: {
            type: String,
            enum: ["credentials", "google"],
            default: "credentials",
        },
        phone: {
            type: String,
            required: function () { return this.authProvider !== "google"; },
            minlength: 11,
            maxlength: 11,
        },
        email: {
            type: String,
           required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () { return this.authProvider !== "google"; },
        },
        image: {
            type: [String],
            default: [],
            required: true
        }

    },
    { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
