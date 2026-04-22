import express from "express";
import { addToWatchList, updateFromWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";

const router = express.Router()

router.use(authMiddleware);

router.post("/", validateRequest(addToWatchlistSchema), addToWatchList);

// {{baseURL}}/watchlist/:id
router.put("/:id", validateRequest(addToWatchlistSchema), updateFromWatchlist);

// {{baseUrl}}/watchlist/:id
router.delete("/:id", removeFromWatchlist);

export default router;