const main = () => {
  const $form = getElement('form.comment');
  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = getElement('#name').value.trim();
    const comment = getElement('#comment').value.trim();
  });
};

window.onload = main;
