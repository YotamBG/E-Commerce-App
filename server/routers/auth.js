const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (_, res) => {
  res.send("hi auth");
});

router.get(
    "/google",
    passport.authenticate("google", {
      scope: "profile",
    })
  );
  
  router.get(
    "/google/callback",
    passport.authenticate("google", { session: true }),
    (req, res) => {
      res.redirect(process.env.CLIENT_URL);
    }
  );

  router.get(
    "/facebook",
    passport.authenticate("facebook")
  );
  
  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", { session: true }),
    (req, res) => {
      res.redirect(process.env.CLIENT_URL);
    }
  );

module.exports = router;