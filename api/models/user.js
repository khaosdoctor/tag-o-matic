module.exports = (mongo) => {
  let schema = mongo.Schema;

  let tag = new schema({
    name: {
      type: String,
      required: true
    }
  });

  let user = new schema({
    login: {
      type: String,
      required: true
    },
    pass: {
      type: String,
      required: true
    },
    tags: [tag]
  });

  return mongo.model('User', user);
}