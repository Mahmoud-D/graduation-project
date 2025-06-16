const express = require("express");
const { testPayPalConnection } = require("../utils/paypal");
const router = express.Router();

 
 
router.get('/test-paypal', async (req, res) => {
      const result = await testPayPalConnection();
      res.json(result);
    });


    router.post("/capture", async (req, res) => {
        const { orderId } = req.body;
      
        if (!orderId) {
          return res.status(400).json({ error: "orderId is required" });
        }
      
        try {
          const result = await capturePayment(orderId);
          res.status(200).json(result);
        } catch (error) {
          console.error("❌ Error capturing PayPal payment:", error.message);
          res.status(500).json({ error: error.message });
        }
      });


      
module.exports = router;




 