const DistinctiveDishModel = require("../models/DistinctiveDish");

class DistinctiveDishesController {
  async getFeaturedDishes(req, res) {
    try {
      const dishes = await DistinctiveDishModel.getActiveDishesOnly();
      res.json({ success: true, data: dishes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTopOrderedDishes(req, res) {
    try {
      const topOrderedDishes =
        await DistinctiveDishModel.getMostOrderedDishes();
      res.json({ success: true, data: topOrderedDishes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getFeaturedDishesForAdmin(req, res) {
    try {
      const dishes = await DistinctiveDishModel.getAllDishesByActivity();
      res.json({ success: true, data: dishes });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // إضافة طبق مميز (للمشرفين)
  async addFeaturedDish(req, res) {
    try {
      const newDishId = await DistinctiveDishModel.addDish(req.body);
      res.status(201).json({ success: true, id: newDishId });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // تحديث طبق مميز (للمشرفين)
  async updateFeaturedDish(req, res) {
    try {
      await DistinctiveDishModel.updateDish(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // حذف طبق مميز (للمشرفين)
  async deleteFeaturedDish(req, res) {
    try {
      await DistinctiveDishModel.deleteDish(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new DistinctiveDishesController();
