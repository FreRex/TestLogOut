"use strict";
exports.getToken = (req, res, next) => {
    const jwt = require('.././middleware/jwt');
    let token = jwt.setToken("2", "wert");
    let payload = jwt.getPayload(token);
    res.json({
        token: token,
        payload: payload
    });
};
