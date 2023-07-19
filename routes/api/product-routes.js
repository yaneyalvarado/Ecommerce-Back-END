const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products
router.get('/', (req, res) => {
  Product.findAll({
    include: [
      Category, 
      {
        model: Tag,
        through: ProductTag,
      },
    ],
  })
    .then((dbProductData) => res.json(dbProductData))
    .catch(error => res.status(500).json(error))
});

// get one product
router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    // attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
    // include: [
    //   {
    //     model: Category,
    //     attributes: ['id', 'category_name'],
    //   },
    //   {
    //     model: Tag,
    //     through: ProductTag,
    //     as: "tags",
    //   },
    // ],
  })
  .then((dbProductData) => {
    // if (dbProductData) {
    //   res.status().json({ message: 'Product not found.'});
    //   return;
    // }
    res.json(dbProductData);
  })
    // if(error) throw error;
});
 /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
// create new product
router.post('/', (req, res) => {
 Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((Product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id }});
    })
      .then((productTags) => {
        // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        })
        .then((updatedProductTags) => res.json(updatedProductTags))
         .catch((err) => {
          // console.log(err);
          res.status(400).json(err);}
       )
   });

   router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbProductData => {
      if (dbProductData) {
        res.status(404).json({ message: "Product not found." });
        return;
      }
      res.json(dbProductData);
    })
    // if(error) throw error;
});

module.exports = router;
