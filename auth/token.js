const jwt = require('jsonwebtoken');

module.exports = function(req, res, next)
{
   const { auth } = req.cookies;
   if (!auth) return res.status(401).redirect('/api/user/login');
   try
   {
    const { user } = jwt.verify(auth, process.env.SECRET);
    req.user = user;
    next();
   } catch(e)
   {
    console.error(e);
    res.status(404).redirect('/api/user/login');
   }
}