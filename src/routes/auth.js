import { Router } from "express"
import { updateProfile, deleteProfile } from "../controllers/update.js";
import { authenticateJWT } from "../middlewares/authJWT.js"
import { ValidateStats } from "../middlewares/authStats.js";

const AuthRouter = Router();

AuthRouter.get('/test', (req, res) => res.send('book route testing!'));

AuthRouter.post(
    "/profile-update",
    authenticateJWT,
    ValidateStats,
    updateProfile
);
AuthRouter.put(
    "/delete",
    authenticateJWT,
    ValidateStats,
    deleteProfile
);
// // method to return random user 
// AuthRouter.get("/random", (req, res) => {
//     db.users.aggregate([{ $sample: { size: 1 } }]).toArray((err, users) => {
//         if (err) {
//             res.status(500).send('Error occurred while fetching random user');
//         } else {
//             res.send(users[0]);
//         }
//     });
// });

// method to return the first user
AuthRouter.get("/random", (req, res) => {
    db.users.findOne({}, (err, user) => {
        if (err) {
            res.status(500).send('Error occurred while fetching first user');
        } else {
            res.send(user);
        }
    });
}
);


export default AuthRouter;