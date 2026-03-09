import React from 'react'
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LogoReturn = () => {
    const navigate =useNavigate()
  return (
    <Button variant="ghost" size="sm" onClick={() => navigate('/')}   >
        Board<span className="text-primary">Forge</span>
  </Button>
  )
}

export {LogoReturn}
