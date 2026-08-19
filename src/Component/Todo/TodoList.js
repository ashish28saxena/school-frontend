import React, { useState } from "react";

const TodoList = () => {
    const [todoName, setTodoName] = useState('');
    const [authorName, setAuthorName] = useState('')
    const [data, setData] = useState([]);
    const [isUpdate, setIsUpdate] = useState(true);
    const [editId, setEditId] = useState('');
    function submitTodoList() {
        if (todoName == "") {
            return false;
        }
        if (isUpdate == true) {
            setData([
                ...data,
                {
                    "todoName": todoName,
                    "authorName": authorName
                }
                ])


                
        } else {
            data[editId]['todoName'] = todoName
            data[editId]['authorName']= authorName
            setIsUpdate(true);
        }

        setTodoName('')
        setAuthorName('')
    }

    function editTodoList(index) {
        let editItem = data.filter((val, i) => i == index);
        editItem=editItem[0];
        console.log("test",editItem)
        setTodoName(editItem.todoName);
        setAuthorName(editItem.authorName);
        setEditId(index);
        setIsUpdate(false);
    }

    function deleteTodoList(index) {
        let delItem = data.filter((val, i) => i != index);
        setData([...delItem])
    }
    return (
        <div>
            <div>
                <h1> Add Todo </h1>
                <form>
                    <div class="form-group row">
                        <label for="staticEmail" class="col-sm-2 col-form-label">Todo Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="staticEmail" placeholder="Enter Todo" value={todoName} onChange={(e) => setTodoName(e.target.value)} />
                        </div>
                    </div>
                    <br></br>
                    <div class="form-group row">
                        <label for="staticEmail" class="col-sm-2 col-form-label">Author</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="staticEmail" placeholder="Enter Todo" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                        </div>
                    </div>
                    <br></br>
                    <div class="form-group row">

                        <div class="col-sm-12">
                            <button type="button" class="btn btn-success" onClick={submitTodoList}>{isUpdate ? 'Submit' : 'Update'}</button>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <h1>Todo List</h1>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, index) => {
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.todoName}</td>
                                        <td>{item.authorName}</td>
                                        <td><button type="button" class="btn btn-primary" onClick={() => editTodoList(index)}>Edit</button></td>
                                        <td><button type="button" class="btn btn-danger" onClick={() => deleteTodoList(index)}>Delete</button></td>
                                    </tr>
                                )
                            })
                        }


                    </tbody>
                </table>
            </div>


        </div>
    )
}

export default TodoList