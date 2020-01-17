module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .post(async (req, res) => {
            try {
                const {name, email, password, password2} = req.body;
                const errors = [];

                if (!name || !email || !password || !password2) {
                    errors.push('Please fill in all fields');
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

                const userExist = await services.userService.getUserByEmail(email);

                if (userExist) {
                    errors.push('Email is already exist');
                    throw errors;
                }

                if (errors.length > 0) {
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