const {User} = require('../db/models');

module.exports = {
    user: async () => {
        await User.destroy({truncate: true, restartIdentity: true});
    }
};