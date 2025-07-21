const express = require("express");
const router = express.Router();
const offersController = require("../controllers/offersController");
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post("/", verifyToken, offersController.createOffer);

router.get("/", offersController.getAllOffers);

router.put("/:id", verifyToken, offersController.updateOffer);

router.delete("/:id", verifyToken, offersController.deleteOffer);

module.exports = router;
