const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");

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

// Route for adding a new user to the database
router.post("/user", async (req, res) => {
  try {
    const {
      id,
      name,
      lastName,
      email,
      username,
      password,
      mobileNumber,
      role,
    } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email address" });

    const existingUser = await db.query(
      'SELECT * FROM "Person" WHERE email = $1',
      [email]
    );
    if (existingUser.rowCount !== 0) {
      const token = generateUserJwtToken(JSON.stringify(existingUser.rows[0]));
      console.log("ovo je za existing user token: " + token);
      refreshTokens.push(token);
      return res
        .status(400)
        .json({ message: "User already exists", token: token });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      'INSERT INTO "Person" ("id", "name", "lastName", "username", "password", "email", "mobileNumber", "role") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        id,
        name,
        lastName,
        username,
        hashedPassword,
        email,
        mobileNumber,
        role || "superAdmin",
      ]
    );

    const token = generateUserJwtToken(JSON.stringify(newUser.rows[0]));
    refreshTokens.push(token);

    // Generate secret for 2FA
    const secret = speakeasy.generateSecret();
    console.log("secret generirani: " + secret.otpauth_url);
    console.log(token);

    res.status(201).json({
      message: "User added successfully",
      user: newUser.rows[0],
      token: token,
      secret: secret,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/admin", async (req, res) => {
  const { name, lastName, email, username, password, mobileNumber, role } =
    req.body;

  const adminRoles = ["tellerAdmin", "branchAdmin"];

  const newAdminInfo = [
    name,
    lastName,
    username,
    password,
    email,
    mobileNumber,
    role,
  ];

  if (newAdminInfo.some((info) => !info)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingUser = await db.query(
    'SELECT * FROM "Person" WHERE email = $1',
    [email]
  );

  if (existingUser.rowCount !== 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!adminRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  newAdminInfo.password = await bcrypt.hash(password, 10);

  try {
    const maxId = await db.query('SELECT MAX(id) AS maxId FROM "Person"');
    const newId = parseInt(maxId.rows[0].maxid) + 1;

    const result = await db.query(
      'INSERT INTO "Person" ("id", "name", "lastName", "username", "password", "email", "mobileNumber", "role") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [newId, ...newAdminInfo]
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(200).json({ message: "Admin successfully created." });
});

function getUsersData(users) {
  return users.map(({ password, ...rest }) => {
    return { ...rest };
  });
}

/* TODO: needs to modify to work with the router
function setupRoutes(genericModel, tableName) {
  const handleError = (res, error) => {
      res.status(500).json({ error: error.message });
  };

  router.get('/', async (req, res) => {
      try { res.json(await genericModel.getAll(tableName)); } 
      catch (error) { handleError(res, error); }
  });

  router.get('/:id', async (req, res) => {
      try { res.json(await genericModel.getById(tableName, req.params.id)); } 
      catch (error) { handleError(res, error); }
  });

  router.post('/', async (req, res) => {
      try { res.status(201).json(await genericModel.add(tableName, req.body)); } 
      catch (error) { handleError(res, error); }
  });

  router.put('/:id', async (req, res) => {
      try { 
          const entity = await genericModel.update(tableName, req.params.id, req.body);
          res.json(entity || { error: 'Entity not found' }); 
      } 
      catch (error) { handleError(res, error); }
  });

  router.delete('/:id', async (req, res) => {
      try { await genericModel.deleteById(tableName, req.params.id); res.sendStatus(204); } 
      catch (error) { handleError(res, error); }
  });

  router.delete('/', async (req, res) => {
      try { await genericModel.deleteAll(tableName); res.sendStatus(204); } 
      catch (error) { handleError(res, error); }
  });
}*/

module.exports = router;
