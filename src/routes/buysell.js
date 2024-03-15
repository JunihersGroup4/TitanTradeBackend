// implement a route to add transactjons to the database

// Path: TitanTradeBackend/src/routes/buysell.js

import { Router } from "express";

const BuySellRouter = Router();

BuySellRouter.get('/test', (req, res) => res.send('book route testing!'));

BuySellRouter.post('/add-transaction', (req, res) => {
    res.send('add transaction route testing!');
}
);

export default BuySellRouter;