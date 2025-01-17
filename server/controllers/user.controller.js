import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/genrateToken.js";
import { deleteMedia, uploadeMedia } from "../utils/cloudinary.js";



export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({success:false, message: "Please fill in all fields."});
        }
        
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({success:false, message: "Email already exists."});
        }

        //Hashing
        const hashPass = await bcrypt.hash(password, 10);

        await User.create({name, email, password: hashPass});

        return res.status(200).json({success:true, message: "User created successfully."});


    } catch (error) {
        return res.status(500).json({success:false, message: error.message});
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({success:false, message: "Please fill in all fields."});
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({success:false, message: "Invalid credentials."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success:false, message: "Invalid credentials."});
        }

        //token genration
        generateToken(res, user, `Welcome back! ${user.name}`);


    } catch (error) {
        return res.status(500).json({success:false, message: error.message});
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({success:true, message: "Logged out successfully."});
    } catch (error) {
        return res.status(500).json({success:false, message: error.message});
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const UserId = req.id;
        const user = await User.findById(UserId).select("-password");
        return res.status(200).json({success:true, user});

    } catch (error) {
        return res.status(500).json({success:false, message: error.message});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({success:false, message: "User not found."});
        }

        //extracting public_id from user old image from url if it exist
        if(user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMedia(publicId);
        }

        //Uploade new image
        const cloudResponse = await uploadeMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        //If user Found
        const updatedData = {name, photoUrl};
        const updateduser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        return res.status(200).json({success:true, message:"Profile updated successfully.", user: updateduser});


    } catch (error) {
        return res.status(500).json({success:false, message: error.message});
    }
};

