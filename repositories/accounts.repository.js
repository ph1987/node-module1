/* eslint-disable no-undef */
import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

async function createAccount(account) {
  const data = JSON.parse(await readFile(jsonFile));
  account = {
    id: data.nextId,
    name: account.name,
    balance: account.balance,
  };
  data.nextId++;
  data.accounts.push(account);
  await writeFile(jsonFile, JSON.stringify(data, null, 2));
  return account;
}

async function getAccounts() {
  const data = JSON.parse(await readFile(jsonFile));
  return data.accounts;
}

async function getAccountById(id) {
  const accounts = await getAccounts();
  const account = accounts.find(account => account.id == id);
  if (account) {
    return account;
  }
  throw new Error("Registro não encontrado");
}

async function deleteAccount(id) {
  const data = JSON.parse(await readFile(jsonFile));
  const requestedId = parseInt(id);
  data.accounts = data.accounts.filter(account => account.id !== requestedId);
  await writeFile(jsonFile, JSON.stringify(data, null, 2));
}

async function updateAccount(account, id) {
  const data = JSON.parse(await readFile(jsonFile));
  const requestedId = parseInt(id);
  const index = data.accounts.findIndex(account => account.id === requestedId);

  if (index === -1) {
    throw new Error("Registro não encontrado");
  }

  data.accounts[index].name  = account.name;
  data.accounts[index].balance = account.balance;
  await writeFile(jsonFile, JSON.stringify(data, null, 2));
  const updatedAccount = data.accounts[index];
  return updatedAccount;
}

async function updateBalance(account, id) {
  const data = JSON.parse(await readFile(jsonFile));
  const requestedId = parseInt(id);
  const index = data.accounts.findIndex(account => account.id === requestedId);

  if (index === -1) {
    throw new Error("Registro não encontrado");
  }

  data.accounts[index].balance = account.balance;
  await writeFile(jsonFile, JSON.stringify(data, null, 2));
  const updatedAccount = data.accounts[index];
  return updatedAccount;
}

export default { 
  createAccount, 
  getAccounts, 
  getAccountById, 
  deleteAccount, 
  updateAccount, 
  updateBalance 
}