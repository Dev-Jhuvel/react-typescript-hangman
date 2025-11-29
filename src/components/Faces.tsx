import { useState, useEffect } from "react";

type facesProps = {
  index: number;
}
function Faces({index}: facesProps) {

  const [face, setFace] = useState("");

  useEffect(() => {
    const faces = [
    ['', ''],
    ['😅', '🤔'],
    ['😥', '😮'],
    ['🥲', '😫'],
    ['😭', '😬'],
    ['😡', '🤬'],
    ['😵', '💀'],
  ];
    const face = faces[index];
    const interval = setInterval(() => {
      
      setFace((prev) => (prev === face[0] ? face[1] : face[0]));

    }, 1000); // change every second
    return () => clearInterval(interval); // cleanup on unmount
    
  }, [index]);
  return face;
}

export default Faces;
