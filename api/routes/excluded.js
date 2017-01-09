let send_invalid = function (rs) {
  rs.sendStatus(405);
}

module.exports = (app) => {
  app.get('/login', (r, rs) => {
    send_invalid(rs);
  });

  app.put('/login', (r, rs) => {
    send_invalid(rs);
  });

  app.delete('/login', (r, rs) => {
    send_invalid(rs);
  });
};