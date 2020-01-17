const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .post(async (req, res) => {
            try {
                const {username, password} = req.body;

                const userVerified = await services.userService.verifyUser(username, password);

                if (userVerified.errors.length > 0) {
                    throw userVerified.errors;
                }

                let token = jwt.sign(
                    {username}, config.secret,
                    {expiresIn: '24h'},  //expires in 24 hours.
                );

                return res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token
                });
            } catch (err) {
                return res.json({
                    status: 'Error',
                    message: err
                });
            }
        });
};