const errorHandler = (err, req, res, next) => {
  console.log(err, "tes");
  let code = 500;
  let message = "Internal Server Error";

  if (err.name === "Invalid email/password") {
    code = 401;
    message = err.name;
  }

  if (err.name === "You are already premium") {
    code = 403;
    message = err.name;
  }

  if (err.name === "Answers is not found") {
    code = 404;
    message = err.name;
  }

  if (
    err.name === "Your name can't be different" ||
    err.name === "Your email can't be different" ||
    err.name === "Invalid Answer"
  ) {
    code = 400;
    message = err.name;
  }

  if (
    err.name === "Email is required" ||
    err.name === "Password is required" ||
    err.name === "Name is required"
  ) {
    code = 400;
    message = err.name;
  }

  if (err.name === "JsonWebTokenError") {
    code = 401;
    message = "Invalid Token";
  }

  if (err.name === "Error patch role") {
    code = 400;
    message = err.name;
  }

  if (err.name === "University not found") {
    code = 404;
    message = err.name;
  }

  if (err.name === "Task not found") {
    code = 404;
    message = err.name;
  }

  if (err.name === "Transaction failed") {
    code = 401;
    message = err.name;
  }

  if (err.name === "Premium member only") {
    code = 401;
    message = err.name;
  }

  res.status(code).json({ statusCode: code, message });
};


module.exports = errorHandler
