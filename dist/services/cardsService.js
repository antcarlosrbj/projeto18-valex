var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as schema from "../utils/joiUtils.js";
export function validateCreation(apiKey, employeeId, cardType) {
    return __awaiter(this, void 0, void 0, function () {
        var company, employee;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
                case 1:
                    company = _a.sent();
                    if (!company) {
                        return [2 /*return*/, { res: false, text: "API Key invalid" }];
                    }
                    if (!/^[0-9]+$/.test(employeeId)) {
                        return [2 /*return*/, { res: false, text: "employee id format is wrong" }];
                    }
                    return [4 /*yield*/, employeeRepository.findById(employeeId)];
                case 2:
                    employee = _a.sent();
                    if (!employee) {
                        return [2 /*return*/, { res: false, text: "Employee not found" }];
                    }
                    if (employee.companyId !== company.id) {
                        return [2 /*return*/, { res: false, text: "Employee does not belong to this company" }];
                    }
                    if (!['groceries', 'restaurant', 'transport', 'education', 'health'].includes(cardType)) {
                        return [2 /*return*/, { res: false, text: "Wrong card type" }];
                    }
                    return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(cardType, employee.id)];
                case 3:
                    if (_a.sent()) {
                        return [2 /*return*/, { res: false, text: "Employee has this type of card" }];
                    }
                    return [2 /*return*/, { res: true }];
            }
        });
    });
}
export function createCard(employeeId, cardType) {
    return __awaiter(this, void 0, void 0, function () {
        var employee, cardholderName, cryptr, securityCode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, employeeRepository.findById(employeeId)];
                case 1:
                    employee = _a.sent();
                    cardholderName = generator.cardholderName(employee.fullName);
                    cryptr = new Cryptr(process.env.SECRET);
                    securityCode = cryptr.encrypt(faker.finance.creditCardCVV());
                    cardRepository.insert({
                        employeeId: employeeId,
                        number: faker.finance.creditCardNumber('#{16}'),
                        cardholderName: cardholderName,
                        securityCode: securityCode,
                        expirationDate: dayjs().add(5, 'year').format('MM/YY'),
                        password: null,
                        isVirtual: false,
                        originalCardId: null,
                        isBlocked: false,
                        type: cardType
                    });
                    return [2 /*return*/, true];
            }
        });
    });
}
var generator = {
    cardholderName: function (fullName) {
        var fullNameToArray = fullName.split(" ").filter(function (e) { return e.length > 2; });
        var cardholderName = fullNameToArray.map(function (e) { return e[0]; });
        cardholderName[0] = fullNameToArray[0];
        cardholderName[cardholderName.length - 1] = fullNameToArray[fullNameToArray.length - 1];
        return cardholderName.join(" ").toUpperCase();
    }
};
export function validateActivation(cardNumber, cardholderName, expirationDate, securityCode, password) {
    return __awaiter(this, void 0, void 0, function () {
        var validation, card, _a, month, year, expirationDateMilliseconds, cryptr, decryptedSecurityCode;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validation = schema.activation.validate({ cardNumber: cardNumber, cardholderName: cardholderName, expirationDate: expirationDate, securityCode: securityCode, password: password });
                    if (validation.error) {
                        return [2 /*return*/, { res: false, text: validation.error.details[0].message }];
                    }
                    return [4 /*yield*/, cardRepository.findByCardDetails(cardNumber, cardholderName, expirationDate)];
                case 1:
                    card = _b.sent();
                    if (!card) {
                        return [2 /*return*/, { res: false, text: "Card not found" }];
                    }
                    /* --------------------------- IS CARD ACTIVED? ---------------------------- */
                    if (card.password) {
                        return [2 /*return*/, { res: false, text: "Card has already been activated" }];
                    }
                    _a = card.expirationDate.split("/").map(function (e) { return parseInt(e); }), month = _a[0], year = _a[1];
                    expirationDateMilliseconds = dayjs(new Date(2000 + year, month)).subtract(1, 'second').valueOf();
                    if (expirationDateMilliseconds < dayjs().valueOf()) {
                        return [2 /*return*/, { res: false, text: "Card is expired" }];
                    }
                    cryptr = new Cryptr(process.env.SECRET);
                    decryptedSecurityCode = cryptr.decrypt(card.securityCode);
                    if (securityCode !== decryptedSecurityCode) {
                        return [2 /*return*/, { res: false, text: "Security code is invalid" }];
                    }
                    return [2 /*return*/, { res: true }];
            }
        });
    });
}
export function savePassword(cardNumber, cardholderName, expirationDate, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findByCardDetails(cardNumber, cardholderName, expirationDate)];
                case 1:
                    card = _a.sent();
                    id = card.id;
                    card.password = bcrypt.hashSync(password, 10);
                    delete card.id;
                    return [4 /*yield*/, cardRepository.update(id, card)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
export function getTransactionsInTheDatabase(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var paymentStatement, rechargeStatement, paymentStatementAnswer, i, rechargeStatementAnswer, i, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, paymentRepository.findByCardId(cardId)];
                case 1:
                    paymentStatement = _a.sent();
                    return [4 /*yield*/, rechargeRepository.findByCardId(cardId)];
                case 2:
                    rechargeStatement = _a.sent();
                    paymentStatementAnswer = [];
                    for (i = 0; i < paymentStatement.length; i++) {
                        paymentStatementAnswer.push({
                            id: 0,
                            cardId: 0,
                            businessId: 0,
                            timestamp: "",
                            amount: 0
                        });
                    }
                    rechargeStatementAnswer = [{ id: 0, cardId: 0, timestamp: "", amount: 0 }, { id: 0, cardId: 0, timestamp: "", amount: 0 }];
                    for (i = 0; i < rechargeStatement.length; i++) {
                        rechargeStatementAnswer.push({
                            id: 0,
                            cardId: 0,
                            timestamp: "",
                            amount: 0
                        });
                    }
                    balance = 0;
                    paymentStatement.forEach(function (e, index) {
                        balance -= e.amount;
                        paymentStatementAnswer[index].id = e.id;
                        paymentStatementAnswer[index].cardId = e.cardId;
                        paymentStatementAnswer[index].businessId = e.businessId;
                        paymentStatementAnswer[index].timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
                        paymentStatementAnswer[index].amount = e.amount;
                    });
                    rechargeStatement.forEach(function (e, index) {
                        balance += e.amount;
                        rechargeStatementAnswer[index].id = e.id;
                        rechargeStatementAnswer[index].cardId = e.cardId;
                        rechargeStatementAnswer[index].timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
                        rechargeStatementAnswer[index].amount = e.amount;
                    });
                    return [2 /*return*/, {
                            balance: balance,
                            transactions: paymentStatement,
                            recharges: rechargeStatement
                        }];
            }
        });
    });
}
export function blockOrUnblockCard(operation, cardId, password) {
    return __awaiter(this, void 0, void 0, function () {
        var validation, card, _a, month, year, expirationDateMilliseconds, id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (operation !== "block" && operation !== "unblock") {
                        return [2 /*return*/, { res: false, text: "Not Acceptable" }];
                    }
                    validation = schema.blockCard.validate({ cardId: cardId, password: password });
                    if (validation.error) {
                        return [2 /*return*/, { res: false, text: validation.error.details[0].message }];
                    }
                    return [4 /*yield*/, cardRepository.findById(cardId)];
                case 1:
                    card = _b.sent();
                    if (!card) {
                        return [2 /*return*/, { res: false, text: "Card not found" }];
                    }
                    /* --------------------------- IS CARD ACTIVED? ---------------------------- */
                    if (!card.password) {
                        return [2 /*return*/, { res: false, text: "Card is not active" }];
                    }
                    /* --------------------- IS CARD BLOCKED OR UNBLOCKED? --------------------- */
                    if (card.isBlocked && operation === "block") {
                        return [2 /*return*/, { res: false, text: "Card is blocked" }];
                    }
                    if (!card.isBlocked && operation === "unblock") {
                        return [2 /*return*/, { res: false, text: "Card is unblocked" }];
                    }
                    _a = card.expirationDate.split("/").map(function (e) { return parseInt(e); }), month = _a[0], year = _a[1];
                    expirationDateMilliseconds = dayjs(new Date(2000 + year, month)).subtract(1, 'second').valueOf();
                    if (expirationDateMilliseconds < dayjs().valueOf()) {
                        return [2 /*return*/, { res: false, text: "Card is expired" }];
                    }
                    /* ---------------------------- CHECK PASSWORD ----------------------------- */
                    if (!bcrypt.compareSync(password, card.password)) {
                        return [2 /*return*/, { res: false, text: "Invalid password" }];
                    }
                    id = card.id;
                    operation === "block" ? card.isBlocked = true : card.isBlocked = false;
                    delete card.id;
                    return [4 /*yield*/, cardRepository.update(id, card)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, { res: true }];
            }
        });
    });
}
