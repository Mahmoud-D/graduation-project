const express = require("express");
const router = express.Router();
const promotionsController = require("../controllers/promotionsController");
const checkRole = require("../middleware/checkRole");
const { verifyToken } = require("../middleware/auth");

    router.get("/active", verifyToken,
    checkRole(["user"]), promotionsController.getActivePromotions);
    router.get(
        "/dishes-with-promotions", verifyToken,
    checkRole(["user"]),
        promotionsController.getDishesWithPromotions
    );

    router.get(
        "/",
        verifyToken,
        checkRole(["admin"]),
        promotionsController.getAllPromotions
    );

    router.post(
        "/",
        verifyToken,
        checkRole(["admin"]),
        promotionsController.createPromotion
    );

    router.put(
        "/:id",
        verifyToken,
        checkRole(["admin"]),
        promotionsController.updatePromotion
    );

    router.patch(
        "/:id/toggle",
        verifyToken,
        checkRole(["admin"]),
        promotionsController.togglePromotion
    );

    router.delete(
        "/:id",
        verifyToken,
        checkRole(["admin"]),
        promotionsController.deletePromotion
    );

module.exports = router;
