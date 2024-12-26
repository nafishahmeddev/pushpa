import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(()=>{
    navigate("/pos");
  }, []);
  return <React.Fragment>Loading...</React.Fragment>;
}
