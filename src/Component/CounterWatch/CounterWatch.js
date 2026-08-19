import React, { useEffect, useState } from "react";
const CounterWatch=()=>{
    const [count,setCount]=useState(20)
    useEffect(()=>{
        if(count===0)
        {
            return;
        }
        const timer=setTimeout(()=>{
                  setCount(count-1);
        },1000);
        return ()=>clearTimeout(timer)
    },[count])
        return (
            <div>
                Watcher Time : {count}
            </div>
        )
}

export default CounterWatch;