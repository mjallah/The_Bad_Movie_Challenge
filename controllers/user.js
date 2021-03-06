// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {

    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/register", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });

  app.post("/api/user/ondeck", async (req, res) => {
    console.log("API user on deck movie update to: " + req.body.movieId);
    const movieOnDeckId = req.body.movieId === "null" ? null : req.body.movieId;
    const user = req.user.id;
    await db.User.update(
      {
        movieOnDeckId: movieOnDeckId
      },
      {
        where: {
          id: user
        }
      }
    ).then(() => {
      console.log("Set user on deck");
    });
    res.json({});
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

};
