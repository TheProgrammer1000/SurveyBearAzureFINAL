/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/surveybear-api/src/app/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __webpack_require__("express");
const surveybear_lib_1 = __webpack_require__("./libs/surveybear-lib/src/index.ts");
const surveyRouter_1 = __webpack_require__("./apps/surveybear-api/src/app/routes/surveyRouter.ts");
const app = express();
//Required to parse json body
app.use(express.json());
//Routers
app.use(surveyRouter_1.default);
//Global error handler
app.use(surveybear_lib_1.handleGlobalErrors);
exports["default"] = app;


/***/ }),

/***/ "./apps/surveybear-api/src/app/routes/surveyRouter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const express_1 = __webpack_require__("express");
const surveybear_lib_1 = __webpack_require__("./libs/surveybear-lib/src/index.ts");
const express_validator_1 = __webpack_require__("express-validator");
const router = (0, express_1.Router)();
router.get('/survey/:surveyId', (0, express_validator_1.param)("surveyId").isMongoId(), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        //validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //do stuff if valid input data
        const survey = yield (0, surveybear_lib_1.getSurveyById)(req.params.surveyId);
        res.json(survey);
    }
    catch (err) {
        next(err);
    }
}));
router.post('/survey', (0, express_validator_1.body)("recipient.name").isString().isLength({ "min": 3 }).withMessage("Du måste skriva minst 3 tecken"), (0, express_validator_1.body)("recipient.mobileNumber").isMobilePhone("sv-SE").withMessage("Skriv in ett mobilnummer, t.ex. 070 123 12 12"), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        //validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const survey = yield (0, surveybear_lib_1.addSurvey)(req.body);
        res.json(survey);
    }
    catch (err) {
        next(err);
    }
}));
router.patch('/survey/:surveyId', (0, express_validator_1.param)("surveyId").isMongoId(), (0, express_validator_1.body)("rating").isNumeric().withMessage("Rating måste vara ett nummer"), (0, express_validator_1.body)("comment").isString().optional(), (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        //validation
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const survey = yield (0, surveybear_lib_1.addResponseToSurvey)(req.params.surveyId, req.body);
        res.json(survey);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}));
router.get('/api/todos', (req, res) => res.status(200).send());
exports["default"] = router;


/***/ }),

/***/ "./libs/surveybear-lib/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/logging/globalErrorHandler.ts"), exports);


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/mongoClient.ts"), exports);


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/mongoClient.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connect = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("mongoose");
const connect = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const connectionString = process.env['MONGODB_CONNECTION_STRING'];
    console.log(connectionString);
    if (!connectionString) {
        throw "400";
    }
    return mongoose_1.default.connect(connectionString);
});
exports.connect = connect;


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/survey/SurveyModel.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__("mongoose");
const RecipientSchema = new mongoose_1.Schema({ name: String, mobileNumber: String });
const ResponseSchema = new mongoose_1.Schema({ rating: Number, comment: String }, { timestamps: true });
const SurveySchema = new mongoose_1.Schema({
    recipient: RecipientSchema,
    response: ResponseSchema
}, { timestamps: true });
exports["default"] = (0, mongoose_1.model)("survey", SurveySchema);


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/survey/addResponseToSurvey.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addResponseToSurvey = void 0;
const tslib_1 = __webpack_require__("tslib");
const SurveyModel_1 = __webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/SurveyModel.ts");
const addResponseToSurvey = (surveyId, surveyResponse) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const survey = yield SurveyModel_1.default.findById(surveyId);
    if (!survey || survey.response) {
        throw "404";
    }
    survey.response = surveyResponse;
    yield survey.save();
    return survey;
});
exports.addResponseToSurvey = addResponseToSurvey;


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/survey/addSurvey.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addSurvey = void 0;
const tslib_1 = __webpack_require__("tslib");
const SurveyModel_1 = __webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/SurveyModel.ts");
const addSurvey = (survey) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const newSurvey = new SurveyModel_1.default(survey);
    yield newSurvey.save();
    return newSurvey;
});
exports.addSurvey = addSurvey;


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/survey/getSurveyById.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSurveyById = void 0;
const tslib_1 = __webpack_require__("tslib");
const SurveyModel_1 = __webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/SurveyModel.ts");
const getSurveyById = (surveyId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const survey = SurveyModel_1.default.findById(surveyId);
    if (!survey) {
        throw "404";
    }
    return survey;
});
exports.getSurveyById = getSurveyById;


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/clients/mongo/survey/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/SurveyModel.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/addResponseToSurvey.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/addSurvey.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/surveybear-lib/src/lib/clients/mongo/survey/getSurveyById.ts"), exports);


/***/ }),

/***/ "./libs/surveybear-lib/src/lib/logging/globalErrorHandler.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleGlobalErrors = void 0;
const handleGlobalErrors = (e, req, res, next) => {
    if (e === '400') {
        res.status(400).json({
            message: 'Bad Request',
        });
    }
    else if (e === '401') {
        res.status(401).json({
            message: 'Unauthorized',
        });
    }
    else if (e === '403') {
        res.status(403).json({
            message: 'Forbidden',
        });
    }
    else if (e === '404') {
        res.status(404).json({
            message: 'Not Found',
        });
    }
    else {
        res.status(500).json({
            errorCode: e.code,
            message: e.message,
        });
    }
};
exports.handleGlobalErrors = handleGlobalErrors;


/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-validator":
/***/ ((module) => {

module.exports = require("express-validator");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const surveybear_lib_1 = __webpack_require__("./libs/surveybear-lib/src/index.ts");
const app_1 = __webpack_require__("./apps/surveybear-api/src/app/index.ts");
const port = process.env.PORT;
try {
    (0, surveybear_lib_1.connect)().then(() => {
        const server = app_1.default.listen(port, () => {
            console.log('running in test branch');
            console.log(`Listening at http://localhost:${port}/api`);
        });
        server.on('error', () => console.log('error'));
    });
}
catch (e) {
    console.log('error');
    throw e;
}

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map