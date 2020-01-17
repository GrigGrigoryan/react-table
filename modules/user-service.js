const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserService {
    constructor(app) {
        this.app = app;
    }

    async getUserByUsername (username) {
        const user = await this.app.db.users.findOne({username});

        if (!user) {
            throw new Error('User is not defined');
        }
    }

    getUserByEmail (email) {
        return this.app.db.users.findOne({email});
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
        if (!data.name) {
            throw new Error('firstname is not defined');
        }

        if (!data.username) {
            throw new Error('username is not defined');
        }

        if (!data.email) {
            throw new Error('email is not defined');
        }

        if (!data.password) {
            throw new Error('password is not defined');
        }

        let user = new this.app.db.users();

        user.name = data.name;
        user.username = data.username;
        user.email = data.email;

        bcrypt.hashSync(data.password, saltRounds);

        user.password = bcrypt.hashSync(data.password, saltRounds);

        return user.save();
    }
}

module.exports = UserService;