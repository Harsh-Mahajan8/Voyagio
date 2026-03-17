require("dotenv").config();
const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../model/listing');

async function main() {
    await mongoose.connect('mongodb+srv://harsh-mahajan:harsh-mahajan@cluster0.etazi.mongodb.net/?appName=Cluster0');
    console.log('DB is connected');

    // await Listing.deleteMany();
    await Listing.insertMany(initData.data);
    console.log('Data is saved');
}

main().catch((err) => console.log('There is an error in db connection:', err.message));