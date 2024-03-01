/* eslint-disable no-undef */
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;
async function createAccount(req, res, next) {
  try {
    let account = req.body;

    if (!account.name || !account.balance == null) {
      throw new Error("Name e Balance são obrigatórios.");
    }

    const data = JSON.parse(await readFile(jsonFile));
    account = { 
      id: data.nextId, 
      name: account.name,
      balance: account.balance
    };

    data.nextId++;
    data.accounts.push(account);
    await writeFile(jsonFile, JSON.stringify(data, null, 2));
    logger.info(`POST /account - ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
}

export default { createAccount };