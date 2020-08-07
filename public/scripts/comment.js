const getOptions = function (comment) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  };
};

const getCommentDetails = function () {
  const post = getElement('.post-title').title;
  const name = getElement('#name').value.trim();
  const msg = getElement('#comment').value.trim();
  return { post, name, msg };
};

const clearInputs = () => {
  getElement('#name').value = '';
  getElement('#comment').value = '';
};

const renderStatus = function (status) {
  const $status = getElement('.status');
  if (status) {
    $status.innerText = 'Thanks for your valuable feedback!!!';
    clearInputs();
    return $status.classList.remove('error');
  }
  $status.innerText = 'Something went wrong, Please try again';
  $status.classList.add('error');
};

const main = () => {
  const $form = getElement('form.comment');
  $form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const comment = getCommentDetails();
    const res = await fetch('/comment', getOptions(comment));
    if (!res.ok) {
      return renderStatus(false);
    }
    renderStatus(true);
  });
};

window.onload = main;
