module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .post(async (req, res) => {
            try {
                console.log('asdasdsd', req.body);
                const {firstname, lastname, username, email, password, password2} = req.body;
                const errors = [];
                console.log(firstname, lastname, username, email, password, password2);

                if (!firstname || !lastname || !username || !email || !password || !password2) {
                    errors.push('Please fill in all fields');
                    throw errors;
                }

                const usernameExist = await services.userService.getUserByUsername(username);
                const emailExist = await services.userService.getUserByEmail(email);

                if (usernameExist) {
                    errors.push(`User with username: ${username} already exist`);
                    throw errors;
                }

                if (emailExist) {
                    errors.push('Email is already exist');
                    throw errors;
                }

                if (password !== password2) {
                    errors.push('Passwords do not match');
                    throw errors;
                }

                if (password.length < 6) {
                    errors.push('Password should be at least 6 characters');
                    throw errors;
                }

                const userData = await services.userService.createUserData(req.body);

                return res.json({
                    status: 'Success',
                    message: `User: ${userData.username} registered successfully`
                });
            } catch (err) {
                return res.json({
                    status: 'Error',
                    message: err
                });
            }
        });
};