const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  Category.findAll({
    include: [Product],
  })
    .then((dbCategoryData) => res.json(dbCategoryData))
    .catch((error) => res.status(500).json(error));
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    where: {
      id: req.params.id,
    },
  }).then((dbCategoryData) => {
    res.json(dbCategoryData);
  });
});

// create a new category
router.post("/", (req, res) => {
  Category.create({
    category_name: req.body.category_name,
  }).then((dbCategoryData) => res.json(dbCategoryData));
});

// update a category by its `id` value
router.put("/:id", (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((dbCategoryData) => {
    if (!dbCategoryData) {
      res.status().json({ message: "Category not found" });
      return;
    }
    res.json(dbCategoryData);
  });
});

// delete a category by its `id` value
router.delete("/:id", (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id,
    },
  }).then((dbCategoryData) => {
    if (!dbCategoryData) {
      res.status().json({ message: "Category not found" });
      return;
    }
    res.json(dbCategoryData);
  });
});

module.exports = router;
