function onError(err, req, res, next) {
  let errorMessage = '';
  console.log(err);
  if (typeof err == 'object') {
    errorMessage = err.message;
  } else {
    errorMessage = err;
  }
  res.status(400).json({ error: errorMessage });
}

export default onError;
