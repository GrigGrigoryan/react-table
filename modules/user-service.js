const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserService {
    constructor(app) {
        this.app = app;
    }

    async getUserByUsername (username) {
        return this.app.db.users.findOne({username});
    }

    getUserByEmail (email) {
        return this.app.db.users.findOne({email});
    }

    getUserById (_id) {
        return this.app.db.users.findOne({_id});
    }

    async verifyUser (username, password) {
        let loginInfo = {
            username,
            errors: []
        };

        const user = await this.app.db.users.findOne({username});

        if (!user) {
            loginInfo.errors.push(`User with name '${username}' is not defined`);
            return loginInfo;
        }

        const verify = await bcrypt.compareSync(password, user.password);

        if (!verify) {
            loginInfo.errors.push('Password is incorrect');
        }

        return loginInfo;
    }

    async createUserData (data) {
        let user = new this.app.db.users();

        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.username = data.username;
        user.email = data.email;

        bcrypt.hashSync(data.password, saltRounds);

        user.password = bcrypt.hashSync(data.password, saltRounds);

        return user.save();
    }
}

module.exports = UserService;