const router = require("express").Router();
const db = require("../db");
const express = require('express');
const { authenticateToken, authRole } = require("../middlewares/authMiddleware");
const genericCRUD = require("./genericCRUD");
/*
router.get("/users",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const result = await db.query('SELECT * FROM "Person" WHERE role = $1', ["user"]);
    const users = result.rows;
    res.json(getUsersData(users));
  }
);

router.get("/user/:id",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Person" WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "User not found!" });
    const user = result.rows[0];
    if (user.role == "user") return res.status(403).json({ message: "Not allowed!" });
    res.json(user);
  }
);

router.post("/user",
  authenticateToken,
  authRole("superAdmin", "tellerAdmin", "branchAdmin"),
  async (req, res) => {
    const { email, password, role } = req.body;
    // TODO: check if username or email already exists
  }
);
*/
function getUsersData(users) {
  return users.map(({ password, ...rest }) => {
    return { ...rest };
  });
}

// TODO: needs to modify to work with the router
function setupRoutes(genericModel, tableName) {
  const handleError = (res, error) => {
    res.status(500).json({ error: error.message });
  };

  const router = express.Router();

  router.get('/', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try { res.json(await genericModel.getAll(tableName)); }
      catch (error) { handleError(res, error); }
    });

  router.get('/:id', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try { res.json(await genericModel.getById(tableName, req.params.id)); }
      catch (error) { handleError(res, error); }
    });

  router.post('/', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try { res.status(201).json(await genericModel.add(tableName, req.body)); }
      catch (error) { handleError(res, error); }
    });

  router.put('/:id', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try {
        const entity = await genericModel.update(tableName, req.params.id, req.body);
        res.json(entity || { error: 'Entity not found' });
      }
      catch (error) { handleError(res, error); }
    });

  router.delete('/:id', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try { await genericModel.deleteById(tableName, req.params.id); res.sendStatus(204); }
      catch (error) { handleError(res, error); }
    });

  router.delete('/', authenticateToken,
    authRole("superAdmin", "tellerAdmin", "branchAdmin"), async (req, res) => {
      try { await genericModel.deleteAll(tableName); res.sendStatus(204); }
      catch (error) { handleError(res, error); }
    });

  return router;
}

// Example usage:
const userRouter = setupRoutes(genericCRUD, "Person");
const feedbackRouter = setupRoutes(genericCRUD, "Feedback");
const branchRouter = setupRoutes(genericCRUD, "Branches");
const tellerRouter = setupRoutes(genericCRUD, "Tellers");

router.use("/users", userRouter);
router.use("/feedbacks", feedbackRouter);
router.use("/branches", branchRouter);
router.use("/teller", tellerRouter);

module.exports = router;