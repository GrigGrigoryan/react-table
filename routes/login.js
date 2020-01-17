module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .post(async (req, res) => {
            try {
                const {username, password} = req.body;

                const userVerified = await services.userService.verifyUser(username, password);

                if (userVerified.errors.length > 0) {
                    throw userVerified.errors;
                }

                return res.json({
                    status: "Success",
                    message: `User: ${userVerified.username} logged in successfully`
                });
            } catch (err) {
                return res.json({
                    status: 'Error',
                    message: err
                });
            }
        });
};