/**
 * Checks is email valid or not.
 * @param email
 * @returns {boolean}
 */
module.exports = (email) => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regExp.test(email)
};
