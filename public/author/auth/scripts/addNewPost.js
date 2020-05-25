const renderCategories = (categories) => {
  const categoryCheckbox = categories.map((category) => {
    return `<input type="checkbox" name="${category.url}" value="${category.url}">${category.name}`;
  });
  getElement('#category-list').innerHTML = categoryCheckbox.join('');
};

const renderTags = (tags) => {
  const tagCheckbox = tags.map((tag) => {
    return `<input type="checkbox" name="${tag.url}" value="${tag.url}">${tag.name}`;
  });
  getElement('#tag-list').innerHTML = tagCheckbox.join('');
};

const fetchCategoryAndTags = function () {
  fetch('/author/me/categories')
    .then((res) => res.json())
    .then((categories) => renderCategories(categories));
  fetch('/author/me/tags')
    .then((res) => res.json())
    .then((tags) => renderTags(tags));
};

const main = function () {
  loadPartialHtml();
  fetchCategoryAndTags();
};

window.onload = main;
