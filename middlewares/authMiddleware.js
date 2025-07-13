// Very simple header-based auth middleware
function checkUserLoggedIn(req, res, next) {
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({ message: "Missing userId in headers" });
  }

  req.userId = parseInt(userId);
  next();
}

module.exports = { checkUserLoggedIn };
