module.exports = (app) => {
  app.param('tagname', (r, rs, next) => {
    r.tagname = r.params.tagname;
    next();
  })
};