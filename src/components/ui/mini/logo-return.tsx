import React from 'react'
import { Button } from "@/components/ui/mini/button";
import { useNavigate } from "react-router-dom";

const LogoReturn = () => {
    const navigate =useNavigate()
  return (
    <Button variant="ghost" size="sm" onClick={() => navigate('/')}   >
        Table<span className="text-primary">Fabro</span>
  </Button>
  )
}

export {LogoReturn}
