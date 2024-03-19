import { Router } from "express"
import { authenticateJWT } from "../middlewares/authJWT.js"
import { validateUser } from "../middlewares/validateUser.js";
import { generatePortfolio, togglePortfolioStatus } from "../controllers/portfolioController.js";

const portRouter = Router();

portRouter.get(
    "/get?",
    generatePortfolio
);

portRouter.post(
    "/status",
    authenticateJWT,
    validateUser,
    togglePortfolioStatus
);


export default portRouter;
