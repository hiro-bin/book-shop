const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const ensureAuthorization = (req, res) => {
    try {
        let decodedJwt;
        let receivedJwt = req.headers["authorization"];
        if(receivedJwt) {
            decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        } else {
            throw new ReferenceError("jwt must be provided");
        }
        
        return decodedJwt;
    } catch(err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = ensureAuthorization;