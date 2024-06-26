const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const swaggerUI = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const { swagger } = require("./constants");

const authRouter = require("./routes/auth");
const devRouter = require("./routes/dev");
const crudRouter = require("./routes/crud");
const adminRouter = require("./routes/admin");

app.use(
  "/api-docs",
  (req, res, next) => {
    req.swaggerDoc = swaggerJson;
    next();
  },
  swaggerUI.serveFiles(),
  swaggerUI.setup(null, {
    customCss: swagger.customCss,
    customCssUrl: swagger.cssUrl,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

app.use(cors({
    origin: 'https://feedtrack.vercel.app',
  }));

app.use("/api", authRouter);
app.use("/api", devRouter);
app.use("/api", crudRouter);
app.use("/api", adminRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
