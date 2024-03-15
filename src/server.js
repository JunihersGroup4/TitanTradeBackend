import mongoose from "mongoose";
import app from "./app.js";

// const { MongoClient } = require("mongodb");

import { MongoClient, ObjectId } from "mongodb";
const mongodb_url = process.env.MONGO_URL;
if (!mongodb_url) {
  console.error("MONGODB_URL environment variable is not defined.");
  // exit
  process.exit(1);
}

const client = new MongoClient(mongodb_url);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // connect to 3080 if no port specified
    const PORT = parseInt(process.env.PORT || "3080", 10);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // commented below stuff out because perms not there 

    // if db 'investorama' exists, then drop it 
    // const dblist = await client.db().admin().listDatabases();
    // if (dblist.databases.some(db => db.name === "investorama")) {
    //   console.log("Dropping database 'investorama'");
    //   await client.db("investorama").dropDatabase();
    // }
    const db = client.db("investorama");
    const col_users = db.collection("users");

    col_users.createIndex({ "User_Id": 1 }, { unique: true });

    const someUsers = [
      {
        User_Id: new ObjectId(),
        name: "User 1",
        email_id: "user1@example.com",
        password: "hashed_password_1",
        account_status: "active",
        account_creation_date: new Date(),
        current_balance: 0,
        reward_coins: 0
      },
      {
        User_Id: new ObjectId(),
        name: "User 2",
        email_id: "user2@example.com",
        password: "hashed_password_2",
        account_status: "inactive",
        account_creation_date: new Date(),
        current_balance: 0,
        reward_coins: 0
      }
    ]

    const p = await col_users.insertMany(someUsers)

    const col_companies = db.collection("companies");

    col_companies.createIndex({ "Company_Id": 1 }, { unique: true });

    const someCompanies = [
      {
        Company_Id: new ObjectId(), // MongoDB ObjectId for auto-generation
        Symbol: "PQR",
        Current_Price: 100.00,
        Max_Stock_Price: 150.00,
        Min_Stock_Price: 50.00,
        Name: "PQR Corp"
      },
      {
        Company_Id: new ObjectId(),
        Symbol: "ABC",
        Current_Price: 120.00,
        Max_Stock_Price: 180.00,
        Min_Stock_Price: 80.00,
        Name: "ABC Corp"
      },
      {
        Company_Id: new ObjectId(),
        Symbol: "XYZ",
        Current_Price: 90.00,
        Max_Stock_Price: 130.00,
        Min_Stock_Price: 70.00,
        Name: "XYZ Ltd"
      },
      {
        Company_Id: new ObjectId(),
        Symbol: "DEF",
        Current_Price: 110.00,
        Max_Stock_Price: 160.00,
        Min_Stock_Price: 60.00,
        Name: "DEF Inc"
      },
      {
        Company_Id: new ObjectId(),
        Symbol: "GHI",
        Current_Price: 150.00,
        Max_Stock_Price: 200.00,
        Min_Stock_Price: 100.00,
        Name: "GHI Co"
      }
    ]

    const q = await col_companies.insertMany(someCompanies);

    const col_transactions = db.collection("transactions");

    col_transactions.createIndex({ "Transaction_Id": 1 }, { unique: true });

    const someTransactions = [
      {
        Transaction_Id: new ObjectId(),
        User_Id: someUsers[0].User_Id,
        Company_Id: someCompanies[0].Company_Id,
        Transaction_Type: "buy",
        Transaction_Amount: 100,
        Transaction_Date: new Date()
      },
      {
        Transaction_Id: new ObjectId(),
        User_Id: someUsers[1].User_Id,
        Company_Id: someCompanies[1].Company_Id,
        Transaction_Type: "sell",
        Transaction_Amount: 200,
        Transaction_Date: new Date()
      }
    ]

    const r = await col_transactions.insertMany(someTransactions);

  }
  catch (e) {
    console.error(e);
  }
}

run().catch(console.dir);
// db.once("open", () => {
//   console.log("MongoDB connected");

//   const PORT = parseInt(process.env.PORT || "3080", 10);
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// });

// db.on("error", (error) => {
//   console.error("MongoDB connection error: ", error);
// });
