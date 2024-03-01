/* eslint-disable no-undef */
import express from "express";
import { promises as fs } from "fs";
import AccountController from "../controllers/accounts.controller";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", AccountController.createAccount);

router.get("/", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(jsonFile));
    delete data.nextId;
    logger.info("GET /account");
    res.send(data);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(jsonFile));
    const requestedId = parseInt(req.params.id);
    const acc = data.accounts.find(account => account.id === requestedId);
    logger.info(`GET /account/${req.params.id}`);
    res.send(acc);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(jsonFile));
    const requestedId = parseInt(req.params.id);
    data.accounts = data.accounts.filter(account => account.id !== requestedId);
    await writeFile(jsonFile, JSON.stringify(data, null, 2));
    logger.info(`DELETE /account - ${JSON.stringify(account)}`);
    res.end();
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(jsonFile));
    const requestedId = parseInt(req.params.id);
    const index = data.accounts.findIndex(account => account.id === requestedId);

    if (index === -1) {
      throw new Error("Registro não encontrado");
    }

    if (!account.name || !account.balance == null) {
      throw new Error("Name e Balance são obrigatórios.");
    }

    data.accounts[index].name  = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(jsonFile, JSON.stringify(data, null, 2));
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
    res.send(data.accounts[index]);
  } catch (err) {
    next(err);
  }
});

router.patch("/update-balance/:id", async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(jsonFile));
    const requestedId = parseInt(req.params.id);
    const index = data.accounts.findIndex(account => account.id === requestedId);

    if (index === -1) {
      throw new Error("Registro não encontrado");
    }

    if (account.balance == null) {
      throw new Error("Balance é obrigatório");
    }

    data.accounts[index].balance = account.balance;
    await writeFile(jsonFile, JSON.stringify(data, null, 2));
    logger.info(`PATCH /account - ${JSON.stringify(account)}`);
    res.send(data.accounts[index]);
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  logger.error(`${err.message}`);
  console.log(err);
  res.status(400).send({ error: err.message });
})

export default router;
