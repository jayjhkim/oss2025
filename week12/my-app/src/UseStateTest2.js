import React from "react";
import { useState } from "react";

export default function Color() {
    const [color, setColor] = useState('Red');
    const changeColor = (c) => { setColor(c) };

    console.log("color");

    return(
        <>
            <div class='colorgroup'>
            <h3>Color is {color}</h3>
            <button type='button' onClick={()=>changeColor('Red')}>Red</button>
            <button type='button' onClick={()=>setColor('Blue')}>Blue</button>
            </div>
        </>
         
    )
}