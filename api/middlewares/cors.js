module.exports = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Accept,Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  next();
};