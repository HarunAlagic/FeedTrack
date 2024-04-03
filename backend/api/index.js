const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerUI = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const { swagger } = require("./constants");

const authRouter = require("./routes/auth");
const devRouter = require("./routes/dev");
const adminRouter = require("./routes/admin");
const crudRouter = require("./routes/crud");

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

app.use("/api", authRouter);
app.use("/api", devRouter);
app.use("/api", adminRouter);
app.use("/api", crudRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
