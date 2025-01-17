import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useEffect } from 'react'
import { Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourceQuery } from '@/features/api/courseApi';


const CourceTable = () => {
    const {data, isLoading, refetch} = useGetCreatorCourceQuery();
    const navigate = useNavigate();
    useEffect(() => {
        refetch()
    },[]);


    if(isLoading) return <h1>Data is Loading...</h1>
    console.log(data);

    return (
        <div>
            <Button onClick={()=>navigate(`create`)}>Create Cource</Button>
            <Table>
                <TableCaption>A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.cource.map((course) => (
                        <TableRow key={course._id}>
                            <TableCell className="font-medium">{course?.courcePrice || "NA"}</TableCell>
                            <TableCell> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
                            <TableCell>{course.courceTitle}</TableCell>
                            <TableCell className="text-right">
                                <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CourceTable
