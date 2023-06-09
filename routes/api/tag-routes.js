const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: ['id', 'tag_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
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
  // find a single tag by its `id`
  // be sure to include its associated Product data
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

router.post('/', (req, res) => {
  // create a new tag
    Tag.create({
      tag_name: req.body.tag_name
    })
      .then(dbTagData => res.json(dbTagData))
      if(error) throw error;
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
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

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
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
