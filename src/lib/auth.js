import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { isBezierDefinition } from "framer-motion";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db("assignment10");

export const auth = betterAuth({
    database: mongodbAdapter(db, {

        client
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                defaultValue: "customer"

            },
            isBlocked: {
                defaultValue: false
            }
        }
    }
});