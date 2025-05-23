const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../model/listing');

async function main() {
    const mongoUrl = "mongodb://127.0.0.1:27017/Voyagio";
    await mongoose.connect(mongoUrl);
};

main()
    .then(() => console.log('Db is connected'))
    .catch(() => { console.log('There is an error in db connection') });

const initDb = async () => {
   await Listing.deleteMany();
   await Listing.insertMany(initData.data);
   console.log('Data is saved');
}
initDb();