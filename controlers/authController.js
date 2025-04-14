import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js"; // Assuming you have a User model

export const userLogin=(async (req, res, next) => {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: "User doesn't exist" });
        }
    
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
    
        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "4h" });
        console.log("token",token);
        
      
        res.status(200).json({
            message: "Login successful",
            token,
            name: user.name,
            email: user.email,
          });
      })

      export const userRegister = async (req, res, next) => {
        const { name, email, password } = req.body;
          // Check if user already exists
          const userExists = await User.findOne({ email });
          if (userExists) {
            return res.status(400).json({ message: "User already exists" });
          }
      
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Create a new user
          const newUser = new User({ name, email, password: hashedPassword , role:"user"});
          await newUser.save();
      
          // Generate JWT Token
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      
          // Return response with user data and token
          res.status(201).json({
            message: "User registered successfully",
            token,
            name: newUser.name,
            email: newUser.email,
          });
    }
    export const createTokenUser = async (req, res, next) => {
      const { name, email, phone } = req.body;
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: "User already exists" });
        }
        
        // Create a new user
        const newUser = new User({ name, email, phone, role:"user"});
        await newUser.save();
    
        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
        // Return response with user data and token
        res.status(201).json({
          message: "User registered successfully",
          token,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        });
  }
    
export const getUser=async(req,res)=>{
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
  

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) return res.status(500).json({ message: "token expired" });

      // Find user from DB
      const user = await User.findById(decoded.id).select("-password").populate({
        path: "orders",
        select: "vehicle issue pickup destination location state createdAt price driver payment_method",  // Example of selecting specific fields in orders
        populate: {
          path: 'driver', // Optionally populate the driver field (if you want more details about the driver)
          select: 'name email location', // Select the driver's name and email
        },
        
      });     

      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
}

export const authUser = async (req, res, next) => {  
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "User not found, go to Login" });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from DB
    const user = await User.findById(decoded.id).select("-password");
    
    req.user = user; // Attach user to the request object
    next();  // Proceed to the next middleware
  } catch (error) {
    console.error("Error verifying token", error);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};



export const userLogout=(req,res)=>{
        // In case you want to implement token invalidation, you would need a server-side session or a token blacklist.
        // For now, we just send a success message.
        res.json({ message: "Logout successful" });
      }
