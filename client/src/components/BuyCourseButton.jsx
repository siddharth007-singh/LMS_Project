import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi.js'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BuyCourseButton = ({courceId}) => {

  const [createCheckoutSession, {data, isLoading, isSuccess, isError, error}] = useCreateCheckoutSessionMutation();

  const handleBuyCourse = async () => {
    await createCheckoutSession(courceId);
  };

  useEffect(() => {
    if(isSuccess){
      if(data?.url){
        window.location.href = data.url;  //redirect to srtripe checkout page
      }
      else{
        toast.error("Something went wrong");
      }
    }
    if(isError){
      toast.error(error.data.message || "Something went wrong");
    }
  },[data, isSuccess, isError, error]);

  return (
    <Button disabled={isLoading} className="w-full" onClick={handleBuyCourse}>
      {
        isLoading ?(
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/> 
            Please Wait
          </>)
          : "Buy Course"
        }
    </Button>
  )
}

export default BuyCourseButton


