import { Course } from "../models/cource.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, uploadeMedia } from "../utils/cloudinary.js";


export const createCourse = async (req, res) => {
    try {
        const {courceTitle, category} = req.body;
        if(!courceTitle || !category){
            return res.status(400).json({message: "Please fill all fields"});
        }

        const course = await Course.create({
            ...req.body,
            creator: req.id
        });
        return res.status(201).json({message:"Course created successfully", course});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const cource = await Course.find({creator: userId}).populate({path:"creator", select:"name photoUrl"});
        if(!cource){
            return res.status(404).json({cource:[],message: "No course found"});
        }
        return res.status(200).json({cource});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message});
    }
};

export const editCourse = async(req, res) => {
    try {
        const courceId = req.params.courceId;
        const {courceTitle, subTitle, description, category, courceLevel, courcePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courceId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courceThumbnail;
        if(thumbnail){
            if(course.courceThumbnail){
                const publicId = course.courceThumbnail.split("/").pop().split(".")[0];
                console.log("Thumbnail path:", thumbnail.path);
                await deleteMedia(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courceThumbnail = await uploadeMedia(thumbnail.path);
        }

 
        const updateData = {courceTitle, subTitle, description, category, courceLevel, courcePrice, courceThumbnail:courceThumbnail?.secure_url};

        course = await Course.findByIdAndUpdate(courceId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
};

//getting the cource data into the edit page
export const getCourceById = async (req, res) => {
    try {
        const courceId = req.params.courceId;
        const course = await Course.findById(courceId);

        if(!course){
            return res.status(404).json({message:"Course not found"});
        }
        return res.status(200).json({course, message:"Course found"});

    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to get cource by Id"});
    }
};

export const removeCource = async (req, res) => {
    try {
        const {courceId} = req.params;

        const cource = await Course.findByIdAndDelete(courceId);
        if(!cource){
            return res.status(404).json({message:"Cource not found"});
        }

        //Delete the cource thumbnail from cloudnary as well
        if(cource.courceThumbnail){
            const publicId = cource.courceThumbnail.split("/").pop().split(".")[0];
            await deleteMedia(publicId);
        }

        //Delete all the lectures associated with the cource
        await Lecture.deleteMany({_id:{$in:cource.lectures}});
        return res.status(200).json({message:"Cource removed successfully"});
        
    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to remove cource"});
    }
}

export const getPublishedCource = async (_, res) => { 
    try {
        const cource = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!cource){
            return res.status(404).json({message:"No cource found"});
        }
        return res.status(200).json({cource});

    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to get published cource"});
    }
}


export const createLecture = async (req, res) => {
    try {

        const {lectureTitle} = req.body;
        const {courceId} = req.params;

    
        if(!courceId || !lectureTitle){
            return res.status(400).json({message:"Lecture title and cource id is required"});
        }

        //create lecture
        const lecture = await Lecture.create({lectureTitle});

        //push this into the lectures column present in Cource table
        const course = await Course.findById(courceId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({message:"Lecture created successfully", lecture});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message || "Failed to create lecture"});
    }
};

export const getCourceLecture = async (req, res) => {
    try {
        const {courceId} = req.params;
        const cource = await Course.findById(courceId).populate("lectures");
        if(!cource){
            return res.status(404).json({message:"No cource found"});
        }
        return res.status(200).json({lectures:cource.lectures});
    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to get lecture"});
    }
};

export const editLecture = async (req, res) => {
    try {
        const {lectureId, courceId} = req.params;
        const {lectureTitle, videoInfo,  isPreviewFree} = req.body;

        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({message:"Lecture not found"});
        }

        //Update lecture
        if(lectureTitle){
            lecture.lectureTitle = lectureTitle;
        }

        if(videoInfo?.videoUrl && videoInfo?.publicId){
            lecture.videoUrl = videoInfo.videoUrl;
            lecture.publicId = videoInfo.publicId;
        }

        if(isPreviewFree){
            lecture.isPreviewFree = isPreviewFree;
        }

        await lecture.save();

        //Now update the lecture in the cource table
        const cource = await Course.findById(courceId);
        if(cource && cource.lectures.includes(lecture._id)){
            cource.lectures.push(lecture._id);
            await cource.save();
        };

        return res.status(200).json({message:"Lecture updated successfully", lecture});

    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to edit lecture"});
    }
}

export const RemoveLecture = async (req, res) => {
    try {
        const {lectureId} = req.params;

        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({message:"Lecture not found"});
        }
        //Delete Lecture video from cloudnary as well
        if(lecture.publicId){
            await deleteMedia(lecture.publicId);
        }

        //delete the lecture added into the cource Table as well
        await Course.updateOne(
            {lectures:lectureId},  //Find the lecture id in the lectures column
            {$pull:{lectures:lectureId}} //remove the lecture id from the lectures column
        )

        return res.status(200).json({message:"Lecture removed successfully"});

    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to remove lecture"});
    }
}


export const getLectureById = async (req, res) => {
    try {
        const {lectureId} = req.params;

        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({message:"Lecture not found"});
        }

        return res.status(200).json({lecture});
    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to get lecture by Id"});
    }
}

//Controlller for publish and unPublished

export const publishUnpublish = async (req, res) => {
    try {
        const {courceId} = req.params;
        const {publish} = req.query; //true or false status.

        const cource = await Course.findById(courceId);
        if(!cource){
            return res.status(404).json({message:"Cource not found"});
        }

        //Publish status based on the query
        cource.isPublished=publish==="true";   // Change To true or false;
        await cource.save();

        return res.status(200).json({message: `Course ${publish==="true"?"published":"unpublished"} successfully`});


    } catch (error) {
        return res.status(500).json({message: error.message || "Failed to publish/unpublish course"});
    }

};

