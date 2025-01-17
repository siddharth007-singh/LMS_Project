import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import axios from 'axios';
import { Progress } from "@/components/ui/progress";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi';

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {

    const navigate = useNavigate();
    const params = useParams();
    const {courceId, lectureId} = params;
    

    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadeVideoInfo, setUploadeVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadeProgress, setUploadeProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);

    const {data:LectureById} = useGetLectureByIdQuery(lectureId);
    //Populating the dat
    const lecture = LectureById?.lecture;
    useEffect(() => {
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadeVideoInfo(lecture.videoInfo);
        }
    },[lecture]);

    const [editLecture, {data, isLoading, isSuccess, error}] = useEditLectureMutation();
    const [removeLecture, {data:removeData, isLoading:removeLoading, isSuccess:removeSuccess, error:removeError}] = useRemoveLectureMutation();
    
    


    const fileChangeHandler = async(e) => { 
        const file = e.target.files[0];
        if(file){
            const formData = new FormData();
            formData.append("file", file);    //this file is exactly same as mediaRoute file;
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/uploade-video`, formData,{
                    onUploadProgress:({loaded, total})=>{
                        setUploadeProgress(Math.round((loaded*100)/total));
                    }
                });

                if(res.data.success){
                    console.log(res);
                    setUploadeVideoInfo({videoUrl:res.data.data.url, publicId:res.data.data.public_id});
                    setBtnDisable(false);
                    toast.success(res.data.message || "Video uploaded successfully");
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message || "Failed to upload video");
            }
            finally{
                setMediaProgress(false);
            }
        }
    };


    const editLectureHandler = async() => {
        await editLecture({lectureTitle, videoInfo:uploadeVideoInfo, isPreviewFree:isFree, courceId, lectureId});
    }; 

    const removeLectureHandler = async() => {
        await removeLecture(lectureId);
        navigate(`/admin/cources/${courceId}/lecture`);
    }
    
    useEffect(() => {
        if(isSuccess){
            toast.success(data.message || "Lecture updated successfully");
            setLectureTitle("");
            setUploadeVideoInfo(null);
        }
        if(error){
            toast.error(error.message || "Failed to update lecture");
        }
    },[isSuccess, error]);

    useEffect(() => {
        if(removeSuccess){
            toast.success(removeData.message || "Lecture removed successfully");
        }
        if(error){
            toast.error(removeData.message || "Failed to remove lecture");
        }
    },[removeSuccess, removeError]);


    return (
        <div>
            <Card>
                <CardHeader className="flex justify-between">
                    <div>
                        <CardTitle>Edit Lecture</CardTitle>
                        <CardDescription>
                            Make changes and click save when done.
                        </CardDescription>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>Remove Lecture</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label>Title</Label>
                        <Input
                            value={lectureTitle}
                            onChange={(e) => setLectureTitle(e.target.value)}
                            type="text"
                            placeholder="Ex. Introduction to Javascript"
                        />
                    </div>
                    <div className='my-5'>
                        <Label>
                            Video <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="file"
                            accept="video/*"
                            onChange={fileChangeHandler}
                            placeholder="Ex. Introduction to Javascript"
                            className="w-fit"
                        />
                    </div>
                    <div className="flex items-center space-x-2 my-5">
                        <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                        <Label htmlFor="airplane-mode">Is this video FREE</Label>
                    </div>

                    {
                        mediaProgress && (
                            <div className='my-4'>
                                <Progress value={uploadeProgress}/>
                                <p>{uploadeProgress}% Uploade</p>
                            </div>
                        )
                    }

                    <div className="mt-4">
                        <Button disabled={isLoading} onClick={editLectureHandler}>
                            {
                                isLoading ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </> : "Update Lecture"
                            }

                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}

export default LectureTab