import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDb } from "@/helper/db";
import { localizeImage } from "@/lib/image-storage.mjs";

import { sessionOptions } from "@/lib/session-config.mjs";

if (!process.env.NEXTAUTH_SECRET?.trim()) {
    throw new Error("Set NEXTAUTH_SECRET in .env to a permanent random secret before starting the app.");
}

export const authOptions = {
    ...sessionOptions(process.env.NEXTAUTH_URL),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    await connectDb();
                    const user = await User.findOne({ email });

                    if (!user?.password || typeof password !== "string") {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image
                    };
                } catch (error) {
                    console.log("Error: ", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (account) token.authProvider = account.provider;
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }

            // Repair older Google sessions that contain Google's subject instead
            // of the MongoDB user ID, as well as new Google sign-ins.
            const validUserId = typeof token.id === "string" && /^[a-f\d]{24}$/i.test(token.id);
            const legacyGoogleId = String(token.id || token.sub || "");
            const googleSession = token.authProvider === "google" || (!validUserId && /^\d+$/.test(legacyGoogleId));
            if (account?.provider === "google" || (!validUserId && token.email)) {
                try {
                    await connectDb();
                    const dbUser = await User.findOne({ email: token.email });
                    const savedImage = Array.isArray(dbUser?.image) ? dbUser.image[0] : dbUser?.image;
                    let imageSaved = false;
                    try {
                        token.picture = await localizeImage(savedImage || token.picture);
                        imageSaved = true;
                    } catch {
                        token.picture = "/placeholder.svg";
                    }

                    if (!dbUser && googleSession) {
                        const newUser = await User.create({
                            name: token.name,
                            email: token.email,
                            image: token.picture,
                            authProvider: "google",
                        });
                        token.id = newUser._id.toString();
                    } else if (dbUser) {
                        token.id = dbUser._id.toString();
                        if (imageSaved && savedImage !== token.picture) {
                            dbUser.image = [token.picture];
                            await dbUser.save();
                        }
                    }
                } catch (error) {
                    console.error("Error in jwt callback:", error);
                    if (account?.provider === "google") throw error;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

