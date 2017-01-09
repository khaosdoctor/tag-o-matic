const cfg = require('../config.json');
const exclude = require('./routes/excluded.js');
const params = require('./routes/params.js');
const parser = require('body-parser');
const log = require('knoblr');
const cors = require('./middlewares/cors.js');
const app = require('express')();
const mongo = require('mongoose');
const request = require('request');

//Excluding urls
//exclude(app);
params(app);

mongo.connect(cfg.MONGO_CONSTRING, (err) => {
  if (err) {
    log.error("Mongo Connection error =>" + err);
  } else {
    log.info("Database connected");
  }
});

const User = require('./models/user.js')(mongo);

app.post('/login', parser.json(), cors, (r, rs) => {
  let query = {
    login: r.body.login,
    pass: r.body.pass
  };
  User.findOne(query, 'login tags', (err, user) => {
    if (!user) {
      User.create({
        login: r.body.login,
        pass: r.body.pass,
        tags: []
      }, (err, nuser) => {
        if (err || !nuser) {
          log.error("Error saving new user => " + err);
          rs.status(500).json({
            status: 0,
            message: err
          });
        } else {
          log.info("New user added to the database " + nuser);
          return rs.json({
            status: 1,
            message: "Logged",
            data: nuser
          });
        }
      });
    } else {
      return rs.json({
        status: 1,
        message: "Logged",
        data: user
      });
    }
  });
});

app.get('/tag/:tagname', (r, rs) => {
  let tag = r.tagname;
  log.info("New request to search tag by name =>" + tag);
  let response = []; //creating an empty array

  let req = request("http://www.instagram.com/explore/tags/" + tag + "/?__a=1", (err, res, body) => {
    body = JSON.parse(body);

    if (body && body.tag.media.count > 0) { //If there's a body and the count of images is greater than 0

      let nodes = body.tag.media.nodes;

      for (i in nodes) { //Loop for each of the first 20 nodes (images) because that's what instagram returns
        if (!nodes[i].is_video) { //Excluding videos and boomerangs

          log.info("Searching image " + nodes[i].code);

          let tag_image = { //Build a tag object we can read
            caption: nodes[i].caption,
            src: nodes[i].display_src,
            id: nodes[i].code,
            link: "https://instagram.com/p/" + nodes[i].code,
            dimensions: nodes[i].dimensions,
            owner: {} //Since instagram does not allow us to fetch user data from the explore URL, we need to perform individual verifications straight on the user post to get his or her data
          };

          response.push(tag_image); //Add to response array

        } //End video check

      } //End loop

      fetchUsers(response, rs); //Fetches user information for each image

    } //End body exists verification

  }); //End request

});

//Fetchuser info for images
function fetchUsers(image_array, rs) {

  let total = 0; //Request counter
  image_array.forEach((image, index, arr) => { //For each loaded image in the array
    request("http://instagram.com/p/" + image.id + "/?__a=1", (err, res, body) => { //Request user information
        body = JSON.parse(body); //Parse response
        if (!err && body) { //Error try/catch
          let owner = { //Parse information into return object
            full_name: body.media.owner.full_name,
            profile_pic: body.media.owner.profile_pic_url,
            username: body.media.owner.username
          };
          image.owner = owner; //Add to the array
          res.emit('close'); //Emit close to finish everything
        } //end error try/catch (no return because owner object is already empty)
      })
      .on('close', () => { //When the request ends we check if all requests ended and return the response
        if (total++ == image_array.length - 1) rs.send(image_array); //Full response if everything finished
        log.info(total + " user requests of " + image_array.length + " completed");
      }); //End Fetch the user data
  });

}


//New Tag
app.post('/tag', parser.json(), cors, (r, rs) => {

  let user_id = r.body.user_id;

  User.findById(user_id, (err, user) => {
    if (err) {
      log.error("Error searching user =>" + err);
      rs.status(500).json({
        status: 0,
        message: err
      });
    }

    let tag = r.body.tag;
    let tags = user.tags;
    tags.push(tag);

    user.save((err) => {
      if (err) {
        log.error("Error saving new tag => " + err);
        rs.status(500).json({
          status: 0,
          message: err
        });
      }

      log.info("New tag created =>" + user.tags);
      rs.status(201).json({
        status: 1,
        message: "New tag created",
        data: user.tags
      });
    });
  })

});


//Init
app.listen(8088, () => {
  log.info("API started on port 8088");
});