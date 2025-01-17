import React from 'react'
import CourceTab from './CourceTab'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EditCource = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to="lecture">
          <Button className="hover:text-blue-600" variant="link">Go to lectures page</Button>
        </Link>
      </div>
      <CourceTab/>
    </div>
  )
}

export default EditCource