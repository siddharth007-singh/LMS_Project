import express from "express";
import upload from "../utils/multer.js";
import { uploadeMedia } from "../utils/cloudinary.js";


const router = express.Router();

router.route("/uploade-video").post(upload.single("file"), async (req, res) => {
    try {
        const result = await uploadeMedia(req.file.path);
        return res.status(200).json({
            success:true,
            message:"File uploaded successfully.",
            data:result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
});

export default router;