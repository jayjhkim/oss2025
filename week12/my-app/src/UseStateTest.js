import React from "react";
import { useState } from "react";

export default function UseStateTest() {
    const [count, setCount] = useState(0);

    console.log("count");

    return(
        <>
            <div>count: (count)</div>
            <button onClick={ () => setCount(count + 1) }>+1</button>
        </>
         
    )
}