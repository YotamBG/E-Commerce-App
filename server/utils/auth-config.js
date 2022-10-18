const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: FacebookStrategy } = require("passport-facebook");
require("dotenv").config();
const db = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      const account = profile._json;
      let user = {};
      try {
        const currentUserQuery = await db.query(
          "SELECT * FROM users WHERE google_id=$1",
          [account.sub]
        );

        if (currentUserQuery.rows.length === 0) {
          // create user
          await db.query(
            "INSERT INTO users (username, img, google_id) VALUES ($1,$2,$3)",
            [account.name, account.picture, account.sub]
          );

          const user_id = await db.query("SELECT user_id FROM users WHERE google_id=$1", [
            account.sub,
          ]);
          user = {
            user_id: user_id.rows[0].user_id,
            username: account.name,
            img: account.picture,
          };
        } else {
          // have user
          user = {
            user_id: currentUserQuery.rows[0].user_id,
            username: currentUserQuery.rows[0].username,
            img: currentUserQuery.rows[0].img,
          };
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FB,
      clientSecret: process.env.CLIENT_SECRET_FB,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
    },
    async (_, __, profile, done) => {
      console.log(profile);
      const account = profile._json;
      let user = {};
      try {
        const currentUserQuery = await db.query(
          "SELECT * FROM users WHERE facebook_id=$1",
          [account.id]
        );

        if (currentUserQuery.rows.length === 0) {
          // create user
          await db.query(
            "INSERT INTO users (username, img, facebook_id) VALUES ($1,$2,$3)",
            [account.name, account.picture.data.url, account.id]
          );

          const user_id = await db.query("SELECT user_id FROM users WHERE facebook_id=$1", [
            account.id,
          ]);
          user = {
            user_id: user_id.rows[0].user_id,
            username: account.name,
            img: account.picture.data.url,
          };
        } else {
          // have user
          user = {
            user_id: currentUserQuery.rows[0].user_id,
            username: currentUserQuery.rows[0].username,
            img: currentUserQuery.rows[0].img,
          };
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});