import React, { useState } from "react";
import ChileList from "../Child/ChileList";
import CounterContext from "../../Context/Counter/CounterContext";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { actioncreators } from '../../State/index';
import { bindActionCreators } from "redux";
const ParentList = () => {
    //const [count,setCount]=useState(0)
    const { count, setCount } = useContext(CounterContext)
    const dispatch= useDispatch();
    const {depositMoney,withdrawMoney,}=bindActionCreators(actioncreators,dispatch)
    const [amount,setAmount]=useState('')
    return (
        <div>
            <h1>This Is parent Component </h1>

            <div className="d-flex justify-content-between mt-2">
                <button
                    className="btn btn-danger px-4 py-2 fs-2"
                    onClick={() => setCount(count - 1)}
                >
                    −
                </button>

                <button
                    className="btn btn-success px-4 py-2 fs-4"
                    onClick={() => setCount(count + 1)}
                >
                    +
                </button>
            </div>



         <div className="container mt-5">
  <div className="card shadow-lg p-4 rounded-4">
    <h3 className="text-center mb-4 fw-bold">💰 Add Money</h3>

    <div className="container mt-5">
  <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", margin: "auto" }}>
    <h3 className="text-center mb-4 fw-bold text-primary">
      💰 Wallet Transaction
    </h3>

    <div className="mb-4">
      <label className="form-label fw-semibold">Enter Amount</label>
      <input
        type="number"
        className="form-control form-control-lg"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>

    <div className="d-flex gap-3">
      <button
        className="btn btn-danger w-50 py-2"
        onClick={() => withdrawMoney(parseInt(amount))}
      >
        💸 Withdraw
      </button>

      <button
        className="btn btn-success w-50 py-2"
        onClick={() => depositMoney(parseInt(amount))}
      >
        💰 Deposit
      </button>
    </div>
  </div>
</div>
  </div>
</div>

            <ChileList />
        </div>
    )
}

export default ParentList