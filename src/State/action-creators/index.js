

export const depositMoney=(anount)=>{
       return (dispatch)=>{
        dispatch({
            type:'deposit',
            payload:anount
        })

       }
}


export const withdrawMoney=(amount)=>{
         return (dispatch)=>{
            dispatch({
                type:"withdraw",
                payload:amount
            })
         }
}