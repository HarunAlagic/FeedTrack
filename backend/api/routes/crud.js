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

    const users = result.rows;

    res.json(getUsersData(users));
  }
);

router.get(
  "/user/:id",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM "Person" WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = result.rows[0];

    if (user.role !== "user") {
      return res.status(403).json({ message: "Not allowed!" });
    }

    res.json(user);
  }
);

router.post(
  "/user",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const { email, password, role } = req.body;
    // TODO: check if username or email already exists
  }
);

function getUsersData(users) {
  return users.map(({ password, ...rest }) => {
    return { ...rest };
  });
}

module.exports = router;
