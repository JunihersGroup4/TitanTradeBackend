import { mongoose } from 'mongoose';
import UserStocks from '../models/UserStocks.js';
import Companies from '../models/Companies.js';
import Portfolio from '../models/Portfolio.js';
import { authenticateJWT } from "../middlewares/authJWT.js";
import { validateUser } from "../middlewares/validateUser.js";
const ObjectId = mongoose.Types.ObjectId;

export const generatePortfolio = async (req, res) => {
  const userId = req.query.userId;

  try {
    const Port_stats = await Portfolio.findOne({ User_Id: new mongoose.Types.ObjectId(userId) });

    if (Port_stats.status !== 'public') {
      authenticateJWT(req, res, async () => {
        validateUser(req, res, async () => {
          const userData = req.body.user;
          if (!userData) {
            return res.status(403).json({ message: "Unauthorized" });
          }
          const userStocks = await UserStocks.find({ User_Id: new mongoose.Types.ObjectId(userId) });
          const portfolio = [];

          for (const stock of userStocks) {
            const companyDetails = await Companies.findOne({ Company_Id: stock.Company_Id });
            
            const totalValue = stock.numberOfStocks * companyDetails.current_Price;

            portfolio.push({
              Quantity: stock.numberOfStocks,
              CompanyDetails: companyDetails,
              TotalValue: totalValue,
            });
          }

          res.json({ success: true, portfolio });
        });
      });
    } else {
      const userStocks = await UserStocks.find({ User_Id: new mongoose.Types.ObjectId(userId) });
      console.log("stocks: ", userStocks);
      const portfolio = [];

      for (const stock of userStocks) {
        const companyDetails = await Companies.findOne({ Company_Id: stock.Company_Id });
   
        const totalValue = stock.numberOfStocks * companyDetails.current_Price;

        portfolio.push({
          Quantity: stock.numberOfStocks,
          CompanyDetails: companyDetails,
          TotalValue: totalValue,
        });
      }

      res.json({ success: true, portfolio });
    }
  } catch (error) {
    console.error('Error generating portfolio:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const togglePortfolioStatus = async (req, res) => {
  const userId = req.user.id;
  try {
    const portfolio = await Portfolio.findOne({ User_Id: userId });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    portfolio.status = portfolio.status === 'public' ? 'private' : 'public';
    await portfolio.save();
    res.json({ success: true, status: portfolio.status });
  } catch (error) {
    console.error('Error toggling portfolio status:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};



