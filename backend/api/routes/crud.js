const router = require("express").Router();
const db = require("../db");
const {
  authenticateToken,
  authRole,
} = require("../middlewares/authMiddleware");

router.get(
  "/users",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const result = await db.query('SELECT * FROM "Person" WHERE role = $1', [
      "user",
    ]);

    res.json(getUserData(result.rows));
  }
);

function getUserData(users) {
  return users.map(({ password, ...rest }) => {
    return { ...rest };
  });
}

module.exports = router;
