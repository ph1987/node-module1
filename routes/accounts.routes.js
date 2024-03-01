/* eslint-disable no-undef */
import express from "express";
import AccountController from "../controllers/accounts.controller.js";

const router = express.Router();

router.post("/", AccountController.createAccount);
router.get("/", AccountController.getAccounts);
router.get("/:id", AccountController.getAccountById);
router.delete("/:id", AccountController.deleteAccount);
router.put("/:id", AccountController.updateAccount);
router.patch("/update-balance/:id", AccountController.updateBalance);

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  logger.error(`${err.message}`);
  console.log(err);
  res.status(400).send({ error: err.message });
})

export default router;
