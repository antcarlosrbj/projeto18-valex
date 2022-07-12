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
import * as cardsService from "../services/cardsService.js";
export function cardsCreatePOST(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, _a, employeeId, cardType, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    apiKey = req.headers['x-api-key'];
                    _a = req.body, employeeId = _a.employeeId, cardType = _a.cardType;
                    return [4 /*yield*/, cardsService.validateCreation(apiKey, employeeId, cardType)];
                case 1:
                    result = _b.sent();
                    if (!result.res) {
                        res.status(404).send(result.text);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, cardsService.createCard(employeeId, cardType)];
                case 2:
                    _b.sent();
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
export function cardsActivatePOST(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cardNumber, cardholderName, expirationDate, securityCode, password, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, cardNumber = _a.cardNumber, cardholderName = _a.cardholderName, expirationDate = _a.expirationDate, securityCode = _a.securityCode, password = _a.password;
                    return [4 /*yield*/, cardsService.validateActivation(cardNumber, cardholderName, expirationDate, securityCode, password)];
                case 1:
                    result = _b.sent();
                    if (!result.res) {
                        res.status(401).send(result.text);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, cardsService.savePassword(cardNumber, cardholderName, expirationDate, password)];
                case 2:
                    _b.sent();
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
export function cardsExtractPOST(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var cardId, extract;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cardId = req.body.cardId;
                    return [4 /*yield*/, cardsService.getTransactionsInTheDatabase(cardId)];
                case 1:
                    extract = _a.sent();
                    res.send(extract);
                    return [2 /*return*/];
            }
        });
    });
}
export function cardsBlockPOST(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cardId, password, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, cardId = _a.cardId, password = _a.password;
                    return [4 /*yield*/, cardsService.blockOrUnblockCard("block", cardId, password)];
                case 1:
                    result = _b.sent();
                    if (!result.res) {
                        res.status(401).send(result.text);
                        return [2 /*return*/];
                    }
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
export function cardsUnblockPOST(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cardId, password, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, cardId = _a.cardId, password = _a.password;
                    return [4 /*yield*/, cardsService.blockOrUnblockCard("unblock", cardId, password)];
                case 1:
                    result = _b.sent();
                    if (!result.res) {
                        res.status(401).send(result.text);
                        return [2 /*return*/];
                    }
                    res.sendStatus(200);
                    return [2 /*return*/];
            }
        });
    });
}
