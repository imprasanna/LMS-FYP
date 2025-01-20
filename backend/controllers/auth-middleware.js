const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");
const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id, user.role);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('token', token, cookieOptions);

    // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

const protectsAdmin = async(req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
      console.log(req.headers);
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access'
        }); 
        
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await Admin.findById(decoded.id);
    // console.log(currentUser);
    req.user = currentUser;
    next();
}


const protectsTeacher = async(req, res, next)=>{
  const {token} = req.cookies;
  if(!token){
    console.log(req.headers);
      return res.status(401).json({
          status: 'fail',
          message: 'You are not logged in! Please log in to get access'
      }); 
      
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await Teacher.findById(decoded.id);
  req.user = currentUser;
  next();
}

const protectsStudent = async(req, res, next)=>{
  const {token} = req.cookies;
  if(!token){
    console.log(req.headers);
      return res.status(401).json({
          status: 'fail',
          message: 'You are not logged in! Please log in to get access'
      }); 
      
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await Student.findById(decoded.id);
  req.user = currentUser;
  next();
}




const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this task', 403)
      );
    }
    next();
  };
};


module.exports = {createSendToken, restrictTo, protectsAdmin, protectsTeacher, protectsStudent};