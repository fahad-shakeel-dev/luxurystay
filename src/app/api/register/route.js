import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDb } from "@/helper/db";

export async function POST(req) {
    try {
        const { name, email, password, phone, image } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await connectDb();
        await User.create({
            name,
            phone,
            email,
            password: hashedPassword,
            image
        });

        return NextResponse.json(
            { message: "User registered." }, 
            { 
                status: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Registration failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDb();
        const users = await User.find({}, { password: 0 });

        return NextResponse.json(
            users, 
            { 
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching users", error: error.message },
            { status: 500 }
        );
    }
}

