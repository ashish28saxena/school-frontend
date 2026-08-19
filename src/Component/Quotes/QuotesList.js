import React, { useEffect, useState } from "react";

const QuotesList = () => {
    const [data, setData] = useState([]);
    const [searchData, setSearchData] = useState('');
    function getData() {
        let result = fetch("https://dummyjson.com/quotes");
        result.then((Response) => Response.json())
            .then((Response1) => setData(Response1.quotes))
    }
    function searchGetData()
    {
            let result = fetch("https://dummyjson.com/quotes");
            result.then((Response) => Response.json())
            .then((Response1) => setData(Response1.quotes))
    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <div>
            <h1>Quotes List </h1>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Recipient's username" onChange={(e)=>setSearchData(e.target.value)}/>
                    <div class="input-group-append">
                        <span class="input-group-text" id="basic-addon2">
                            <button type="button" class="btn btn-secondary input-group-text" onClick={searchGetData}>Search</button>
                        </span>
                    </div>
            </div>




            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Quote</th>
                        <th scope="col">Author</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => {
                            return (
                                <tr>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.quote}</td>
                                    <td>{item.author}</td>
                                    <td><button type="button" class="btn btn-primary">Edit</button></td>
                                    <td><button type="button" class="btn btn-danger">Delete</button></td>
                                </tr>
                            )
                        })
                    }


                </tbody>
            </table>
        </div>
    )
}

export default QuotesList;