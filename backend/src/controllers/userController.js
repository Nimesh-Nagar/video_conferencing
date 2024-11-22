import httpStatus from "http-status";
import { User } from "../modules/user.model.js";
import bcrypt, {hash}  from "bcrypt"

import crypto from "crypto"

// User Login

const login = async(req, res) => {
    const { username, password} = req.body;

    if( !username || !password ){
        return res.status(400).json({ message: "Please Provide "});
    }

    try{
        const user = await User.findOne( {username} );
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not Found"})
        }

        if (bcrypt.compare(password, user.password)){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({ message: "Token "})

        }

    } catch(e) {
        return res.status(500).json({ message: `Somthing went wrong ${e}`});

    }

}



// User Reginstration 
const register = async(req, res) => {
    const { name, username, password } = req.body;

    try{
        const existingUser = await User.findOne({ username });
        if (existingUser){
            return res.status(httpStatus.FOUND).json({ message : "User Already exists"});
    
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
            name: name, 
            username: username,
            password: hashedPassword
    
        }) 
    
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User Registered"})
    
    } catch(e){
        res.json({ message: `Somthing Went Wrong ${e}`});
    }

}



export { login, register}