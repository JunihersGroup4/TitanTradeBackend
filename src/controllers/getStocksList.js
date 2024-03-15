import axios from 'axios';
import mongoose from 'mongoose';
import Companies from '../models/Companies.js';


const fetchAndUpdateStocks = async () => {
    const options = {
        method: 'GET',
        url: 'https://latest-stock-price.p.rapidapi.com/any',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
        }
    };

    try {
        const response = await axios.request(options);
        const stocks = response.data;

        const updatePromises = stocks.map(async (stock) => {
            const query = { symbol: stock.symbol };
            const update = {
                max_stock_price: stock.dayHigh,
                min_stock_price: stock.dayLow,
                symbol: stock.symbol,
                Company_Id: new mongoose.Types.ObjectId(),
                company_name: stock.identifier,
                current_Price: stock.lastPrice
            };
            const options = { upsert: true, new: true };

            return Companies.findOneAndUpdate(query, update, options);
        });

        await Promise.all(updatePromises);
    } catch (error) {
        console.error(error);
    }
}

const isMarketOpen = () => {

    // print in the terminal "api key missing"
    if (!process.env.RAPIDAPI_KEY || !process.env.RAPIDAPI_HOST) {
        console.error('API key missing here');
        return false;
    }
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
 
    return dayOfWeek >= 1 && dayOfWeek <= 5 && 
        (hours > 9 || (hours === 9 && minutes >= 15)) && 
        (hours < 15 || (hours === 15 && minutes <= 30));
 };
 
 const scheduleFetchAndUpdateStocks = () => {
    if (isMarketOpen()) {
        fetchAndUpdateStocks();
    }
 };
 
 setInterval(scheduleFetchAndUpdateStocks, 60000);

export const getStocksList = async (req, res) => {
    try {
        const companies = await Companies.find({});
        res.json(companies);
        console.log("companies fetched", companies[10]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching companies data');
    }
}