module.exports = (app, services, baseRoute) => {
    console.log(baseRoute);
    app.route(`/${baseRoute ? baseRoute : ''}`)
        .get((req, res, next) => {
            try {

                // Cookies that have not been signed
                console.log('Cookies: ', req.cookies);

                // Cookies that have been signed
                console.log('Signed Cookies: ', req.signedCookies);

                if (req.session.views) {
                    req.session.views++;
                    res.setHeader('Content-Type', 'text/html');
                    console.log('views', req.session.views);
                    console.log('expires in', (req.session.cookie.maxAge / 1000));
                    return res.send();
                } else {
                    req.session.views = 1;
                    return res.send(`welcome to the session demo ${req.user}. refresh!`);
                }
                // res.json({user: req.user});
            } catch (err) {
                next(err);
            }
        })
};