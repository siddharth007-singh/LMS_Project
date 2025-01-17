import React,{useState, useEffect} from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useCreateLectureMutation, useGetCourceLectureQuery } from '@/features/api/courseApi';
import { use } from 'react';
import Lecture from './Lecture';

const CreateLecture = () => {
    const navigate = useNavigate();
    const params = useParams();
    const courceId = params.courceId;
    const [lectureTitle, setLectureTitle] = useState("");

    const [createLecture, {isLoading, isSuccess, error}] = useCreateLectureMutation();

    const createLectureHandler = async() => {
        await createLecture({lectureTitle, courceId});
    }

    const {data: lectureData, isLoading:lectureLoading, error:lectureError, refetch} = useGetCourceLectureQuery(courceId);

    useEffect(() => {
        if(isSuccess){
            refetch();
            toast.success("Lecture created successfully");
            setLectureTitle("");
        }
        if (error) {
            toast.error(error.data.message);
    }
    },[isSuccess, error]);

    return (
        <div>
            <div className="flex-1 mx-10">
                <div className="mb-4">
                    <h1 className="font-bold text-xl">
                        Lets add some lecture details for your new course
                    </h1>
                    <p className="text-sm">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
                        laborum!
                    </p>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label>Add Lecture</Label>
                        <Input
                            type="text"
                            value={lectureTitle}
                            onChange={(e) => setLectureTitle(e.target.value)}
                            placeholder="Your lecture Name"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate(`/admin/cources/${courceId}`)}> 
                            Back To Cource
                        </Button>
                        <Button disabled={isLoading} onClick={createLectureHandler}>
                            {
                                isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Lecture"
                            }
                        </Button>
                    </div>
                    <div className='mt-10'>
                        {
                            lectureLoading? (<Loader2 className="w-10 h-10 animate-spin" />) : lectureError? (<p>Failed to load lectures.</p>):lectureData.lectures.length===0 ?(<p>No lectures availabe</p>):(
                                lectureData.lectures.map((lecture, index) => (
                                    <Lecture
                                    key={lecture._id}
                                    lecture={lecture}
                                    courceId={courceId}
                                    index={index}
                                    />
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateLecture