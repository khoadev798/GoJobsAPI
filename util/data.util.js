const bcrypt = require('bcrypt');
const GLOBAL = require("../global/global")
const saltRounds = GLOBAL.SALT_ROUNDS;

let hashPassword =  (user) => {
    const salt =  bcrypt.genSaltSync(10);
    const hash =  bcrypt.hashSync(user.password, salt);
    user['password'] = hash;
    user['salt'] = salt;
    return user
}


module.exports = {
    hashPassword
}