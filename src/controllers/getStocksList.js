import axios from "axios";
import mongoose from "mongoose";
import Companies from "../models/Companies.js";
import {
  API_FETCH_TIME,
  OPENING_HOUR,
  OPENING_MINUTE,
  CLOSING_HOUR,
  CLOSING_MINUTE,
  MONDAY,
  FRIDAY,
} from "../constants/constants.js";

const fetchAndUpdateStocks = async () => {
  const options = {
    method: "GET",
    url: "https://latest-stock-price.p.rapidapi.com/any",
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
    },
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
        current_Price: stock.lastPrice,
        change: stock.change,
        pChange: stock.pChange,
      };
      const options = { upsert: true, new: true };

      return Companies.findOneAndUpdate(query, update, options);
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error(error);
  }
};

const isMarketOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return (
    dayOfWeek >= MONDAY &&
    dayOfWeek <= FRIDAY &&
    (hours > OPENING_HOUR ||
      (hours === OPENING_HOUR && minutes >= OPENING_MINUTE)) &&
    (hours < CLOSING_HOUR ||
      (hours === CLOSING_HOUR && minutes <= CLOSING_MINUTE))
  );
};

const scheduleFetchAndUpdateStocks = () => {
  if (isMarketOpen()) {
    fetchAndUpdateStocks();
  }
};

setInterval(scheduleFetchAndUpdateStocks, API_FETCH_TIME);

export const getStocksList = async (req, res) => {
  try {
    const companies = await Companies.find({});
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching companies data");
  }
};
