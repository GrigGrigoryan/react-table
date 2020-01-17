module.exports = (app, services, baseRoute) => {
    app.route(`/${baseRoute}`)
        .get(async (req, res, next) => {
            try {
                res.sendFile('login.html', {root: process.env.root, tab: 'login'});
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            res.sendFile('index.html', {root: process.env.root, tab: 'home'});
        });
};