const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");
const { verifyToken } = require("../middleware/auth");

router.get("/",   verifyToken,   checkRole(["adsmin"]),   userController.getAllUsers);

router.get("/:id", verifyToken,   checkRole(["admin"]),userController.getUserById);

router.put('/:id', userController.updateUser);

// router.delete('/:id', userController.deleteUser);
router.post('/:id', userController.createUser);

module.exports = router;
