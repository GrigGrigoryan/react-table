module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .get(async (req, res, next) => {
            try {
                res.sendFile('register.html', {root: process.env.root, tab: 'register'});
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res) => {
            try {
                const {name, email, password, password2} = req.body;
                const errors = [];

                if (!name || !email || !password || !password2) {
                    errors.push('Please fill in all fields');
                }

                if (password !== password2) {
                    errors.push('Passwords do not match');
                }

                if (password.length < 6) {
                    errors.push('Password should be at least 6 characters');
                }

                const userExist = await services.userService.getUserByEmail(email);

                if (userExist) {
                    errors.push('Email is already exist');
                }

                if (errors.length > 0) {
                    return res.send({
                        status: 'Error',
                        message: errors
                    });
                }

                const userData = await services.userService.createUserData(req.body);

                return res.send('/home');
            } catch (err) {
                next(err);
            }
        });
};