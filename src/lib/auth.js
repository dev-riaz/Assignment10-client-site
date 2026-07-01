import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("assignment10");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
        "http://localhost:3000",
        "https://assignmet10-client-site-rcvy.vercel.app",
        "https://*.vercel.app",
    ],
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                defaultValue: "customer",
            },
            isBlocked: {
                defaultValue: false,
            },
        },
    },
});

