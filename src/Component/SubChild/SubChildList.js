import React from "react";
import CounterContext from "../../Context/Counter/CounterContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
const SubChildList=()=>{
    const amount = useSelector(state=>state.amount);
   const {count,setCount}=useContext(CounterContext) 
     return(
        
        <div>
            <h1>This is SubChild Component {count}</h1>
            <div className="d-flex justify-content-between align-items-center border rounded-3 p-3">
      
      

      <div className="text-center">
        <h5 className="text-muted mb-1">Amount</h5>
        <h2 className="fw-bold text-primary">₹ {amount}</h2>
      </div>

      
        </div>
        </div>
     )
}

export default SubChildList;