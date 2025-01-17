import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Subtitles } from "lucide-react";
import RichTextEditor from '@/components/RichtextEditor';
import { useEditCourceMutation, useGetCourceByIdQuery, usePublishUnbulishMutation, useRemoveCourceMutation } from '@/features/api/courseApi';

const CourceTab = () => {
    const [input, setInput] = useState({
        courceTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courceLevel: "",
        courcePrice: "",
        courceThumbnail: "",
      });
    
    const params = useParams();
    const courceId = params.courceId;

    const {data:courceByIdData, isLoading:courceByIdLoading, refetch} = useGetCourceByIdQuery(courceId);
    const [publishUnbulish, {data:publishData}] = usePublishUnbulishMutation();
    const [removeCource, {isSuccess:removeCourceData}] = useRemoveCourceMutation(courceId);

    // 11:23:46

    //now populate the input fields with the data
    useEffect(() => {
        if(courceByIdData?.course){
            const cource = courceByIdData.course;
            setInput({
                courceTitle: cource.courceTitle,
                subTitle: cource.subTitle,
                description: cource.description,
                category: cource.category,
                courceLevel: cource.courceLevel,
                courcePrice: cource.courcePrice,
                courceThumbnail: "",
            })
        }
    },[courceByIdData]);

      const [previewThumbnail, setPreviewThumbnail] = useState("");
      const navigate = useNavigate();
    
      const [editCource, { data, isLoading, isSuccess, error }] = useEditCourceMutation();
      
    
      const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
      };
    
      const selectCategory = (value) => {
        setInput({ ...input, category: value });
      };
      const selectCourseLevel = (value) => {
        setInput({ ...input, courceLevel: value });
      };

      // get file
      const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          setInput({ ...input, courceThumbnail: file });
          const fileReader = new FileReader();
          fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
          fileReader.readAsDataURL(file);
        }
      };
    
      const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courceTitle", input.courceTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courceLevel", input.courceLevel);
        formData.append("courcePrice", input.courcePrice);
        formData.append("courceThumbnail", input.courceThumbnail);
    
        await editCource({ formData, courceId });
      };

      const publishStatusHandler = async (action) => {
        try {
            const response = await publishUnbulish({courceId, query:action});
            if(response.data){
                refetch();
                toast.success(response.data.message);
            }  
        } catch (error) {
            toast.error(error.data.message);
        }
      };
    
      useEffect(() => {
        if (isSuccess) {
          toast.success(data.message || "Course update.");
        }
        if (error) {
          toast.error(error.data.message || "Failed to update course");
        }
      }, [isSuccess, error]);

    if(courceByIdLoading) return <Loader2 className="h-10 w-10 animate-spin" />

    const RemoveCourceHandler = async (courceData) => {
        removeCource(courceData);
        navigate("/admin/cources");
        toast.success("Course removed successfully.");
    }





    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button disabled={courceByIdData?.course.lectures.length===0} variant="outline" onClick={()=>publishStatusHandler(courceByIdData?.course.isPublished?"false":"true")}>{courceByIdData?.course.isPublished?"UnPublished":"Published"}</Button>
                    <Button className="bg-red-100 text-red-600 hover:bg-red-200 focus:ring focus:ring-red-300" onClick={()=>RemoveCourceHandler(courceByIdData?.course._id)}>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courceTitle"
                            value={input.courceTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select
                                defaultValue={input.category}
                                onValueChange={selectCategory}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select
                                defaultValue={input.courceLevel}
                                onValueChange={selectCourseLevel}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="courcePrice"
                                value={input.courcePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                        />
                        {previewThumbnail && (
                            <img
                                src={previewThumbnail}
                                className="e-64 my-2"
                                alt="Course Thumbnail"
                            />
                        )}
                    </div>
                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourceTab