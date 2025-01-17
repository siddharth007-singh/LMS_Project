import React, { useEffect } from 'react'
import Cource from './Cource';
import { useGetCreatorCourceQuery } from '@/features/api/courseApi';

const MyLearning = () => {
    const myLearningCources = [1];

    const {data, isLoading, isSuccess, refetch} = useGetCreatorCourceQuery();
    
    useEffect(() => {refetch()}, []);
  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl">MY LEARNING</h1>
        <div className="my-5">
            {
                isLoading?<MyLearningSkeleton/>:myLearningCources.length === 0
                ?
                (<p>You are not Enrolled in any Cource</p>)
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.cource.map((cource, index) => <Cource key={index} cource={cource} />)}
                </div>
            }
        </div>
    </div>
  )
}

export default MyLearning

// Skeleton component for loading state
const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
        ></div>
      ))}
    </div>
);
