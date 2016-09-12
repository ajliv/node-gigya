const crypto = require('crypto');


const SigUtils = {
    calcSignature(baseString, key) {
        const rawHmac = crypto.createHmac('sha1', Buffer.from(key, 'base64')).update(baseString);
        const signature = rawHmac.digest('base64');
        return signature;
    },

    validateUserSignature(UID, timestamp, secret, signature) {
        const now = Math.round(Date.now() / 1000);
        if (Math.abs(now - timestamp) > 180) {
            return false;
        }
        const baseString = `${timestamp}_${UID}`;
        const expectedSig = SigUtils.calcSignature(baseString, secret);
        return (expectedSig === signature);
    }
};


module.exports = SigUtils;
