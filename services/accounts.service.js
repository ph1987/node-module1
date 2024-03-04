import AccountRepository from "../repositories/accounts.repository.js";

async function createAccount(account) {
  if (!account.name || !account.balance == null) {
    throw new Error("Name e Balance são obrigatórios.");
  }
  const accountCreated = await AccountRepository.createAccount(account);
  if (accountCreated) {
    return accountCreated;
  }
  throw new Error("Erro ao inserir registro!");
}

async function getAccounts() {
  return await AccountRepository.getAccounts();
}

async function getAccountById(id) {
  const account = await AccountRepository.getAccountById(id);
  if (account) {
    return account;
  }
  throw new Error("ID não encontrado!");
}

async function deleteAccount(id) {
  return await AccountRepository.deleteAccount(id);
}

async function updateAccount(account, id) {
  console.log(id, account);
  if (!account.name || !account.balance == null) {
    throw new Error("Name e Balance são obrigatórios.");
  }
  return await AccountRepository.updateAccount(account, id);
}

async function updateBalance(account, id) {
  if (account.balance == null) {
    throw new Error("Balance é obrigatório");
  }
  return await AccountRepository.updateBalance(account, id);
}

export default { 
  createAccount, 
  getAccounts, 
  getAccountById, 
  deleteAccount, 
  updateAccount, 
  updateBalance 
}