import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { Separator } from "@/components/ui/separator";
import BuyCourseButton from '@/components/BuyCourseButton';
import { useParams } from 'react-router-dom';
import { useGetCourceDetailsWithStatusQuery } from '@/features/api/purchaseApi';



const CourceDetails = () => {
    const { courceId } = useParams();
    const { data, isLoading, isError } = useGetCourceDetailsWithStatusQuery(courceId);

    console.log(data);  

    const handleContinueCourse = async() => {}

    if(isLoading) return <div>Loading...</div>
    if(isError) return <h1>Failed to load CourseDetails</h1>

    const {cource, purchsed} = data;


    
    return (
        <div className='space-y-5'>
            <div className="bg-[#2D2F31] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                    <h1 className="font-bold text-2xl md:text-3xl">
                        {cource?.courceTitle}
                    </h1>
                    <p className="text-base md:text-lg">{cource?.subTitle}</p>
                    <p>
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">
                            {cource?.creator.name}
                        </span> 
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} />
                        <p>Last updated {cource?.createdAt.split("T")[0]}</p>
                    </div>
                    <p>Students enrolled: {cource?.enrolledStudents.length}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p
                        className="text-sm"
                    // dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                    <p>When to Use Webpack:
                        When you need to manage complex dependencies in a JavaScript application.
                        When optimizing and bundling assets for production.
                        When using modern JavaScript frameworks/libraries like React, Vue, or Angular.</p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">

                        </CardContent>
                    </Card>
                </div>

                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className="w-full aspect-video mb-4">
                                <ReactPlayer
                                    width="100%"
                                    height={"100%"}
                                    url="https://www.youtube.com/watch?v=DNlBTMuGMso&t=140s"
                                    controls={true}
                                />
                            </div>
                            <h1>Lecture title</h1>
                            <Separator className="my-2" />
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {purchsed ? (
                                <Button onClick={handleContinueCourse} className="w-full">Continue Course</Button>
                            ) : (
                                <BuyCourseButton courceId={courceId}/>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourceDetails