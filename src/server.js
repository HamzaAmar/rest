import "dotenv/config";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import { join } from "path";
import { connect } from "mongoose";

const { PORT, DATABASE_URL } = process.env;

// init Server
const app = express();

app.set("views", join(__dirname, "views")); // this is the folder where we keep our pug files
app.set("view engine", "pug"); // i like pug but you can work ejs

// Takes the raw requests and turns them into usable properties on req.body
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cookieParser());

// connect to mongodb DataBase
connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    app.listen(PORT, () =>
      console.log(`you're connected to the port ${PORT} with success`)
    );
  })
  .catch(error => console.log(error));

// Error Handling
app.use((err, req, res, next) => {
  console.log("will not print", err.stack);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ err: err.stack });
});
