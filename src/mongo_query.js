//use invest_o_rama

db.createCollection("Users")
db.createCollection("Companies")

db.Users.createIndex({ "User_Id": 1 }, { unique: true })
const someUsers = [
    {
        User_Id: ObjectId(),
        name: "User 1",
        email_id: "user1@example.com",
        password: "hashed_password_1",
        account_status: "active",
        account_creation_date: new Date(),
        current_balance: 0
    },
    {
        User_Id: ObjectId(),
        name: "User 2",
        email_id: "user2@example.com",
        password: "hashed_password_2",
        account_status: "inactive",
        account_creation_date: new Date(),
        current_balance: 0
    }
]

const p = await db.Users.insertMany(someUsers)


db.Companies.createIndex({ Symbol: 1 }, { unique: true })
const someCompanies = [
    {
        Company_Id: ObjectId(), // MongoDB ObjectId for auto-generation
        Symbol: "PQR",
        Current_Price: 100.00,
        Max_Stock_Price: 150.00,
        Min_Stock_Price: 50.00,
        Name: "PQR Corp"
    },
    {
        Company_Id: ObjectId(),
        Symbol: "ABC",
        Current_Price: 120.00,
        Max_Stock_Price: 180.00,
        Min_Stock_Price: 80.00,
        Name: "ABC Corp"
    },
    {
        Company_Id: ObjectId(),
        Symbol: "XYZ",
        Current_Price: 90.00,
        Max_Stock_Price: 130.00,
        Min_Stock_Price: 70.00,
        Name: "XYZ Ltd"
    },
    {
        Company_Id: ObjectId(),
        Symbol: "DEF",
        Current_Price: 110.00,
        Max_Stock_Price: 160.00,
        Min_Stock_Price: 60.00,
        Name: "DEF Inc"
    },
    {
        Company_Id: ObjectId(),
        Symbol: "GHI",
        Current_Price: 150.00,
        Max_Stock_Price: 200.00,
        Min_Stock_Price: 100.00,
        Name: "GHI Co"
    }
]

const q = await db.Companies.insertMany(someCompanies)

db.createCollection("WatchList")
const getRandomUserId = () => db.Users.aggregate([{ $sample: { size: 1 } }]).next().User_Id
const getRandomCompanyId = () => db.Companies.aggregate([{ $sample: { size: 1 } }]).next().Company_Id
db.WatchList.insertMany([
    {
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        TimeStamp: new Date()
    },
    {
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        TimeStamp: new Date()
    },
    {
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        TimeStamp: new Date()
    },
    {
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        TimeStamp: new Date()
    },
    {
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        TimeStamp: new Date()
    }
])


db.createCollection("Transaction")
db.Transaction.insertMany([
    {
        Transaction_Id: ObjectId(),
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        Transaction_Time: "12:00 PM",
        Transaction_Date: ISODate("2024-03-04"),
        Transaction_Type: 'Buy',
        Quantity: 10,
        Price: 100.00
    },
    {
        Transaction_Id: ObjectId(),
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        Transaction_Time: "01:30 PM",
        Transaction_Date: ISODate("2024-03-05"),
        Transaction_Type: 'Buy',
        Quantity: 5,
        Price: 80.00
    },
    {
        Transaction_Id: ObjectId(),
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        Transaction_Time: "03:45 PM",
        Transaction_Date: ISODate("2024-03-06"),
        Transaction_Type: 'Buy',
        Quantity: 8,
        Price: 120.00
    },
    {
        Transaction_Id: ObjectId(),
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        Transaction_Time: "09:15 AM",
        Transaction_Date: ISODate("2024-03-07"),
        Transaction_Type: 'Buy',
        Quantity: 15,
        Price: 150.00
    },
    {
        Transaction_Id: ObjectId(),
        User_Id: getRandomUserId(),
        Company_Id: getRandomCompanyId(),
        Transaction_Time: "02:30 PM",
        Transaction_Date: ISODate("2024-03-08"),
        Transaction_Type: 'Buy',
        Quantity: 12,
        Price: 110.00
    }
])

db.createCollection("UserStocks")
db.UserStocks.insert({
    user_id: getRandomUserId(),
    company_id: getRandomCompanyId(),
    number_of_stocks: 100
})

db.createCollection("Portfolio")
db.Portfolio.insert({
    creation_date: new Date(),
    user_id: getRandomUserId(),
    status: "public"
})
