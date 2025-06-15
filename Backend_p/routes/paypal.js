// routes/paypal.js
router.post("/capture", async (req, res) => {
    try {
      const { orderId, dishes, delivery_address, city, phone_number, coupon_code } = req.body;
  
      const capture = await paypalService.capturePayPalOrder(orderId);
  
      if (capture.status !== "COMPLETED") {
        return res.status(400).json({ message: "Payment not completed" });
      }
  
  
      return res.status(200).json({ message: "Payment captured successfully", data: capture });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  });
  