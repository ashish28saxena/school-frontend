import React from "react";
const Home=()=>{
    return(
        <div>
    

<div class="container-fluid">
  <div class="row">

    
  


    <div class="col-md-10">

     
      

      
      <div class="container mt-4">

        <div class="row">

          <div class="col-md-3 mb-3">
            <div class="card text-bg-primary">
              <div class="card-body">
                <h5>Total Users</h5>
                <h2>120</h2>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card text-bg-success">
              <div class="card-body">
                <h5>Orders</h5>
                <h2>450</h2>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card text-bg-warning">
              <div class="card-body">
                <h5>Revenue</h5>
                <h2>$15K</h2>
              </div>
            </div>
          </div>

          <div class="col-md-3 mb-3">
            <div class="card text-bg-danger">
              <div class="card-body">
                <h5>Pending</h5>
                <h2>18</h2>
              </div>
            </div>
          </div>

        </div>

        <div class="card mt-4">
          <div class="card-header">
            Recent Users
          </div>

          <div class="card-body">

            <table class="table table-bordered table-hover">

              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>1</td>
                  <td>Ashish</td>
                  <td>ashish@gmail.com</td>
                  <td><span class="badge bg-success">Active</span></td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>Rahul</td>
                  <td>rahul@gmail.com</td>
                  <td><span class="badge bg-warning">Pending</span></td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>


        </div>
    )
}

export default Home