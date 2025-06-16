const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkRole = require("../middleware/checkRole");
const { verifyToken } = require("../middleware/auth");

router.get("/",   verifyToken,   checkRole(["admin"]),   userController.getAllUsers);

router.get("/:id", verifyToken,   checkRole(["admin"]),userController.getUserById);

router.put('/:id', userController.updateUser);

router.delete('/:id', verifyToken,   checkRole(["admin"]),userController.deleteUser);
router.put('/deactivateUser/:id', userController.deactivateUser);

router.post('/', verifyToken,   checkRole(["admin"]),userController.createUser);

module.exports = router;
