import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDb } from "@/helper/db";

export async function POST(req) {
    try {
        await connectDb();
        const { email } = await req.json();
        const user = await User.findOne({ email }).select("_id");
        
        return NextResponse.json(
            { user }, 
            { 
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error checking user existence", error: error.message },
            { status: 500 }
        );
    }
}