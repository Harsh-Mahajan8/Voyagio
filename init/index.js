require("dotenv").config();
const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../model/listing');

async function main() {
    const mongoURL = "mongodb://127.0.0.1:27017/Voyagio";
    await mongoose.connect('mongodb+srv://harsh-mahajan:harsh-mahajan@cluster0.quzniat.mongodb.net/?appName=Cluster0');
};

main()
    .then(() => console.log('Db is connected'))
    .catch(() => { console.log('There is an error in db connection') });

const initDb = async () => {
    // await Listing.deleteMany();
    // initData.data = initData.data.map((obj) => ({ ...obj, owner: "685f89dc279da19026acec3b" }));
    await Listing.insertMany(initData.data);
    console.log('Data is saved');
}
initDb();