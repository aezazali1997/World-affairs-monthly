import { config } from 'dotenv'
config();
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_HOST;
const DB_URI = process.env.DB_URI;


import mongoose from 'mongoose';
let uri = DB_URI || `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export const connectDB = () => {
  mongoose
    .connect(`${uri}`)
    .then((res) => console.log(`MongoDB Connected: ${res.connection.host}`))
    .catch((err) => {
      console.error(`Error: ${err.message}`);
    });
};
