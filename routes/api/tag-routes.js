const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        through: ProductTag,
      }
    ]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(error => {
    console.log(error);
    res.status(500).json(error);
  });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: { 
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id' ],
        through: ProductTag,
        as: 'products',
      },
    ],
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: "Tag was not found." });
        return;
      }
      if(error) throw error;
    })
});

// create a new tag
router.post('/', (req, res) => {
    Tag.create({
      tag_name: req.body.tag_name
    })
      .then(dbTagData => res.json(dbTagData))
      if(error) throw error;
});

// update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: 'Tag was not found.' });
        return;
      }
      res.json(dbTagData);
    })
    if(error) throw error;
});

 // delete on tag by its `id` value
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbTagData) => {
      if (!dbTagData) {
        res.status(404).json({ message: 'Tag was not found' });
        return;
      }
      res.json(dbTagData);
    })
      if(error) throw error;
});

module.exports = router;
