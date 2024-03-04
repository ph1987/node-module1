/* eslint-disable no-undef */
import express from "express";
import winston from "winston";
import accounts from "./routes/accounts.routes.js";
import { promises as fs } from "fs";
import cors from "cors";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import AccountService from "./services/accounts.service.js";

const { readFile, writeFile } = fs;

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.jsonFile = "accounts.json";

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: "api-logs.log"
    })
  ],
  format: combine(
    label({ label: "api-logs" }),
    timestamp(),
    myFormat
  )
});

const schema = buildSchema(`
  type Account {
    id: Int
    name: String 
    balance: Float
  }
  input AccountInput {
    name: String 
    balance: Float
  }
  input BalanceInput {
    balance: Float
  }
  type Query {
    getAccounts: [Account]
    getAccount(id: Int): Account
  }
  type Mutation {
    createAccount(account: AccountInput): Account
    deleteAccount(id: Int): Boolean
    updateAccount(id: Int, account: AccountInput): Account
    updateBalance(id: Int, account: BalanceInput): Account
  }
`);

const root = {
  getAccounts: () => AccountService.getAccounts(),
  getAccount(args) {
    return AccountService.getAccountById(args.id);
  },
  createAccount({account}) {
    return AccountService.createAccount(account);
  },
  deleteAccount(args) {
    return AccountService.deleteAccount(args.id);
  },
  updateAccount(args) {
    return AccountService.updateAccount(args.account, args.id);
  },
  updateBalance(args) {
    return AccountService.updateBalance(args.account, args.id);
  },
}

const port = 4080;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/accounts", accounts);

app.use("/graphql", graphqlHTTP ({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(port, async () => {
  try {
    await readFile(jsonFile);
    logger.info(`API started @ port ${port}!`);
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    logger.info("JSON file created");
    try {
      await writeFile(jsonFile, JSON.stringify(initialJson));
    } catch (err) {
      logger.error(err.message);
    }
  }
});
