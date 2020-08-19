const { Tag } = require('../../models/tag');
const { Category } = require('../../models/category');

class Tags {
  constructor() {}

  async getAll() {
    return await Tag.find({});
  }

  async add(name) {
    const url = name.toLowerCase().split(' ').join('-');
    const isAlreadyPresent = await Tag.findOne({ url });
    if (isAlreadyPresent) {
      throw new Error('already present');
    }
    const tag = new Tag({ name, url });
    return await tag.save();
  }

  async getIds(urls) {
    return await Promise.all(
      urls.map(async (url) => {
        const tag = await Tag.findOne({ url });
        return tag._id;
      })
    );
  }
}

class Categories {
  constructor() {}
  async getAll() {
    return await Category.find({});
  }

  async add(name) {
    const url = name.toLowerCase().split(' ').join('-');
    const isAlreadyPresent = await Category.findOne({ url });
    if (isAlreadyPresent) {
      throw new Error('already present');
    }
    const category = new Category({ name, url });
    return await category.save();
  }

  async getIds(urls) {
    return await Promise.all(
      urls.map(async (url) => {
        const category = await Category.findOne({ url });
        return category._id;
      })
    );
  }
}

const getTagsAndCategories = async () => {
  const tag = new Tags();
  const category = new Categories();
  const tags = await tag.getAll();
  const categories = await category.getAll();
  return { tags, categories };
};

module.exports = {
  Tags: new Tags(),
  Categories: new Categories(),
  getTagsAndCategories,
};
