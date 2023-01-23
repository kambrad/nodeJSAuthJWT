module.exports = (req, res, next) => {
    const { auth } = req.cookies;
    if ( auth ) 
    {
        return res.redirect('/api/user/account');
    }
    next();
}