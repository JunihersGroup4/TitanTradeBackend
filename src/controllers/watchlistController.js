import { mongoose } from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;
import WatchList from '../models/watchlist.js';
import Companies from '../models/Companies.js';

export const add_to_watchlist = async (req, res) => {
    try {
        const { symbol } = req.body;
        const userId = req.body.user.id;
        const company = await Companies.findOne({ symbol: symbol });

        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        const existingItem = await WatchList.findOne({ User_Id: new ObjectId(userId), Company_Id: company.Company_Id });

        if (existingItem) {
            return res.status(400).json({ message: 'Stock already exists in the watchlist.' });
        }

        const newItem = new WatchList({
            User_Id: new ObjectId(userId),
            Company_Id: company.Company_Id
        });

        await newItem.save();

        res.status(200).json({ message: 'Stock added to watchlist successfully.' });
    } catch (error) {
        console.error('Error adding stock to watchlist:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export const remove_from_watchlist = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) {
            console.log("empty");
            return res.status(400).json({
                status: 400,
                message: "Watchlist_Id should not be empty/null"
            })
        }
        await WatchList.findByIdAndDelete({ _id: new ObjectId(itemId) });
        return res.status(200).json({
            status: 200,
            message: "Company deleted successfully from the Watchlist."
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });

    }
}

export const get_watchlist = async (req, res) => {
    const { id: userId } = req.body.user;
    const objId = new ObjectId(userId);
    try {
        const userWatchlist = await WatchList.find({ User_Id: objId });
        const enhancedWatchlist = await Promise.all(
            userWatchlist.map(async (watchlistItem) => {
                const companyDetails = await Companies.findOne({ Company_Id: new ObjectId(watchlistItem.Company_Id) });
                
                return {
                    ...watchlistItem.toObject(),
                    companyDetails,
                };
            })
        );
        
        return res.status(200).json({
            status: 200,
            data: enhancedWatchlist
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}
