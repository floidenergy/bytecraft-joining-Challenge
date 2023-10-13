module.exports = (err, req, res, next) => {

  console.log(err.code);

  if(err.code === 11000)
    return res.status(406).json({message: "username already exist"})

  let code;

  if(err.code)
    code = err.code
  else
    code = 400

  return res.status(400).json(err.message)
}