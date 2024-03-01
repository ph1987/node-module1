/* eslint-disable no-undef */
import AccountService from "../services/accounts.service.js";

async function createAccount(req, res, next) {
  try {
    const account = req.body;
    const createdAccount = await AccountService.createAccount(account);
    logger.info(`POST /account - ${JSON.stringify(createdAccount)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
}

async function getAccounts(req, res, next) {
  try {
    res.send(await AccountService.getAccounts());
    logger.info("GET /account");
  } catch (err) {
    next(err);
  }
}

async function getAccountById(req, res, next) {
  try {
    const acc = await AccountService.getAccountById(req.params.id);
    logger.info(`GET /account/${req.params.id}`);
    res.send(acc);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const account = await AccountService.getAccountById(req.params.id);
    if (!account) {
      throw new Error("ID não encontrado");
    }
    await AccountService.deleteAccount(req.params.id);
    logger.info(`DELETE /account - ${JSON.stringify(account)}`);
    res.end();
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const account = req.body;
    const updatedAccount = await AccountService.updateAccount(account, req.params.id);
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
    res.send(updatedAccount);
  } catch (err) {
    next(err);
  }
}

async function updateBalance(req, res, next) {
  try {
    const account = req.body;
    const updatedAccount = await AccountService.updateBalance(account, req.params.id);
    logger.info(`PATCH /account - ${JSON.stringify(account)}`);
    res.send(updatedAccount);
  } catch (err) {
    next(err);
  }
}

export default { 
  createAccount, 
  getAccounts, 
  getAccountById, 
  deleteAccount,
  updateAccount,
  updateBalance
};