import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const Cource = ({ cource }) => {
    return (
        <Link to={`/cource-details/${cource._id}`}>
            <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                    <img
                        src={cource.courceThumbnail || "https://imgs.search.brave.com/L35xuY9rLpgS4Fh-6AD4abs8X9S_AKzxuMeG3ccOkrE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA3LzkxLzIyLzU5/LzM2MF9GXzc5MTIy/NTkyNl9NVUVQdWtv/MHhnakt2V2VBSEdQ/ZEVyUUhZNlgyWkox/bS5qcGc"}
                        alt="course"
                        className="w-full h-36 object-cover rounded-t-lg"
                    />
                </div>
                <CardContent className="px-5 py-4 space-y-3">
                    <h1 className="hover:underline font-bold text-lg truncate">
                        {cource.courceTitle}
                    </h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={cource.creator?.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1 className="font-medium text-sm">{cource.creator?.name}</h1>
                        </div>
                        <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
                            {cource.courceLevel}
                        </Badge>
                    </div>
                    <div className="text-lg font-bold">
                        <span>₹{cource.courcePrice}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Cource
