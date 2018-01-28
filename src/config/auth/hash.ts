'use strict';
import crypto = require ('crypto');

const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
};
export default {
    sha512: function (password, salt) {
        const hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        let value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    },

    saltHashPassword: function (userpassword) {
        const salt = genRandomString(16);
        /** Gives us salt of length 16 */
        let passwordData = this.sha512(userpassword, salt);
        return {
            salt: passwordData.salt,
            passwordHash: passwordData.passwordHash
        }
        //console.log('UserPassword = ' + userpassword);
        //console.log('Passwordhash = ' + passwordData.passwordHash);
        //console.log('nSalt = ' + passwordData.salt);
    }
};
