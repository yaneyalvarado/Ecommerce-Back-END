const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    // attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        // attributes: ['id', 'product_name', 'price', 'stock', 'category_id' ]
      },
    ],
  }).then((dbCategoryData) => res.json(dbCategoryData))
  // if (error) throw error;
  .catch(error => res.status(500).json(error))
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "category_name"],
    include: [
      {
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ],
  }).then((dbCategoryData) => {
    if (dbCategoryData) {
      res.status().json({ message: "Category not found" });
      return;
    }
    res.json(dbCategoryData);
  });
  if (error) throw error;
});

router.post("/", (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name,
  }).then((dbCategoryData) => res.json(dbCategoryData));
  if (error) throw error;
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((dbCategoryData) => {
    if (dbCategoryData) {
      res.status().json({ message: "Category not found" });
      return;
    }
    res.json(dbCategoryData);
  });
  if (error) throw error;
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  }).then((dbCategoryData) => {
    if (dbCategoryData) {
      res.status().json({ message: "Category not found" });
      return;
    }
    res.json(dbCategoryData);
  });
  if (error) throw error;
});

module.exports = router;
