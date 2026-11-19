import React, { useEffect, useState } from "react";

const EXTRA_API = "https://school-management-backend-ochre.vercel.app/api/library-extra";
const blankSupplier = { supplierName:"", contactPerson:"", phone:"", email:"", address:"" };
const blankDigital = { title:"", author:"", category:"", resourceType:"PDF", resourceUrl:"", description:"", accessLevel:"All" };

export default function LibraryExtras({ books = [], onRefreshBooks = () => {} }) {
  const [tab,setTab]=useState("purchases");
  const [suppliers,setSuppliers]=useState([]);
  const [purchases,setPurchases]=useState([]);
  const [losses,setLosses]=useState([]);
  const [audits,setAudits]=useState([]);
  const [digital,setDigital]=useState([]);
  const [supplierForm,setSupplierForm]=useState(blankSupplier);
  const [supplierEdit,setSupplierEdit]=useState("");
  const [purchase,setPurchase]=useState({supplierId:"",purchaseDate:new Date().toISOString().slice(0,10),expectedDate:"",remarks:"",items:[{bookId:"",quantity:1,unitPrice:0}]});
  const [loss,setLoss]=useState({bookId:"",quantity:1,type:"Lost",reason:"",reportedBy:""});
  const [audit,setAudit]=useState({remarks:"",items:[]});
  const [digitalForm,setDigitalForm]=useState(blankDigital);
  const [digitalEdit,setDigitalEdit]=useState("");
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);

  const api=async(path,options={})=>{
    const res=await fetch(`${EXTRA_API}${path}`,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
    const data=await res.json();
    if(!res.ok) throw new Error(data.message||"Request failed");
    return data;
  };
  const run=async(fn)=>{try{setError("");setMessage("");setBusy(true);await fn();}catch(e){setError(e.message);}finally{setBusy(false);}};
  const load=async()=>{
    try{
      const [s,p,l,a,d]=await Promise.all([api("/suppliers"),api("/purchases"),api("/loss-damage"),api("/audits"),api("/digital-resources")]);
      setSuppliers(s.data||[]);setPurchases(p.data||[]);setLosses(l.data||[]);setAudits(a.data||[]);setDigital(d.data||[]);
    }catch(e){setError(e.message);}
  };
  useEffect(()=>{load();},[]);

  const saveSupplier=e=>{e.preventDefault();run(async()=>{
    await api(supplierEdit?`/suppliers/${supplierEdit}`:"/suppliers",{method:supplierEdit?"PUT":"POST",body:JSON.stringify(supplierForm)});
    setSupplierForm(blankSupplier);setSupplierEdit("");setMessage("Supplier saved successfully");await load();
  });};
  const savePurchase=e=>{e.preventDefault();run(async()=>{
    await api("/purchases",{method:"POST",body:JSON.stringify(purchase)});
    setPurchase({supplierId:"",purchaseDate:new Date().toISOString().slice(0,10),expectedDate:"",remarks:"",items:[{bookId:"",quantity:1,unitPrice:0}]});
    setMessage("Purchase order created. Receive it to update stock.");await load();
  });};
  const saveLoss=e=>{e.preventDefault();run(async()=>{
    await api("/loss-damage",{method:"POST",body:JSON.stringify(loss)});
    setLoss({bookId:"",quantity:1,type:"Lost",reason:"",reportedBy:""});setMessage("Report submitted for approval");await load();
  });};
  const saveAudit=e=>{e.preventDefault();run(async()=>{
    await api("/audits",{method:"POST",body:JSON.stringify(audit)});
    setAudit({remarks:"",items:[]});setMessage("Audit draft saved");await load();
  });};
  const saveDigital=e=>{e.preventDefault();run(async()=>{
    await api(digitalEdit?`/digital-resources/${digitalEdit}`:"/digital-resources",{method:digitalEdit?"PUT":"POST",body:JSON.stringify(digitalForm)});
    setDigitalForm(blankDigital);setDigitalEdit("");setMessage("Digital resource saved");await load();
  });};
  const field=(label,control)=><div className="col-md-6"><label className="form-label">{label}</label>{control}</div>;
  const bookOptions=<><option value="">Select Book</option>{books.map(b=><option key={b._id} value={b._id}>{b.bookName} ({b.bookCode})</option>)}</>;

  return <div className="container-fluid py-3">
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div><h4 className="fw-bold mb-1">Advanced Library Management</h4><p className="text-muted mb-0">Purchases, stock loss, audit and digital resources</p></div>
      <button className="btn btn-outline-secondary btn-sm" onClick={()=>{load();onRefreshBooks();}}>Refresh</button>
    </div>
    {message&&<div className="alert alert-success">{message}</div>}{error&&<div className="alert alert-danger">{error}</div>}
    <div className="d-flex flex-wrap gap-2 mb-3">
      {[["purchases","Purchase & Suppliers"],["loss","Lost / Damaged"],["audit","Stock Audit"],["digital","Digital Library"]].map(([id,label])=><button key={id} className={`btn btn-sm ${tab===id?"btn-primary":"btn-outline-primary"}`} onClick={()=>setTab(id)}>{label}</button>)}
    </div>

    {tab==="purchases"&&<div className="row g-3">
      <div className="col-lg-5"><div className="card"><div className="card-header fw-bold">Supplier Master</div><div className="card-body">
        <form onSubmit={saveSupplier} className="row g-2">
          {field("Supplier Name",<input required className="form-control" value={supplierForm.supplierName} onChange={e=>setSupplierForm({...supplierForm,supplierName:e.target.value})}/>)}
          {field("Contact Person",<input className="form-control" value={supplierForm.contactPerson} onChange={e=>setSupplierForm({...supplierForm,contactPerson:e.target.value})}/>)}
          {field("Phone",<input className="form-control" value={supplierForm.phone} onChange={e=>setSupplierForm({...supplierForm,phone:e.target.value})}/>)}
          {field("Email",<input type="email" className="form-control" value={supplierForm.email} onChange={e=>setSupplierForm({...supplierForm,email:e.target.value})}/>)}
          <div className="col-12"><label className="form-label">Address</label><textarea className="form-control" value={supplierForm.address} onChange={e=>setSupplierForm({...supplierForm,address:e.target.value})}/></div>
          <div className="col-12"><button disabled={busy} className="btn btn-primary">{supplierEdit?"Update Supplier":"Add Supplier"}</button> {supplierEdit&&<button type="button" className="btn btn-secondary ms-2" onClick={()=>{setSupplierEdit("");setSupplierForm(blankSupplier);}}>Cancel</button>}</div>
        </form>
      </div></div>
      <div className="card mt-3"><div className="card-header fw-bold">Suppliers ({suppliers.length})</div><div className="table-responsive"><table className="table table-sm mb-0"><thead><tr><th>Name</th><th>Phone</th><th>Action</th></tr></thead><tbody>{suppliers.map(s=><tr key={s._id}><td>{s.supplierName}</td><td>{s.phone||"-"}</td><td><button className="btn btn-sm btn-outline-primary" onClick={()=>{setSupplierEdit(s._id);setSupplierForm({...blankSupplier,...s});}}>Edit</button></td></tr>)}{!suppliers.length&&<tr><td colSpan="3" className="text-center">No suppliers</td></tr>}</tbody></table></div></div></div>
      <div className="col-lg-7"><div className="card"><div className="card-header fw-bold">Create Purchase Order</div><div className="card-body"><form onSubmit={savePurchase} className="row g-2">
        {field("Supplier",<select required className="form-select" value={purchase.supplierId} onChange={e=>setPurchase({...purchase,supplierId:e.target.value})}><option value="">Select Supplier</option>{suppliers.map(s=><option key={s._id} value={s._id}>{s.supplierName}</option>)}</select>)}
        {field("Purchase Date",<input type="date" className="form-control" value={purchase.purchaseDate} onChange={e=>setPurchase({...purchase,purchaseDate:e.target.value})}/>)}
        {field("Expected Date",<input type="date" className="form-control" value={purchase.expectedDate} onChange={e=>setPurchase({...purchase,expectedDate:e.target.value})}/>)}
        <div className="col-12"><label className="form-label">Items</label>{purchase.items.map((it,i)=><div className="row g-2 mb-2" key={i}><div className="col-md-6"><select required className="form-select" value={it.bookId} onChange={e=>setPurchase(p=>({...p,items:p.items.map((x,j)=>j===i?{...x,bookId:e.target.value}:x)}))}>{bookOptions}</select></div><div className="col-md-2"><input type="number" min="1" className="form-control" value={it.quantity} onChange={e=>setPurchase(p=>({...p,items:p.items.map((x,j)=>j===i?{...x,quantity:Number(e.target.value)}:x)}))}/></div><div className="col-md-3"><input type="number" min="0" step="0.01" className="form-control" placeholder="Unit price" value={it.unitPrice} onChange={e=>setPurchase(p=>({...p,items:p.items.map((x,j)=>j===i?{...x,unitPrice:Number(e.target.value)}:x)}))}/></div><div className="col-md-1"><button type="button" className="btn btn-outline-danger" onClick={()=>setPurchase(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))}>×</button></div></div>)}<button type="button" className="btn btn-sm btn-outline-secondary" onClick={()=>setPurchase(p=>({...p,items:[...p.items,{bookId:"",quantity:1,unitPrice:0}]}))}>+ Add Item</button></div>
        <div className="col-12"><label className="form-label">Remarks</label><input className="form-control" value={purchase.remarks} onChange={e=>setPurchase({...purchase,remarks:e.target.value})}/></div>
        <div className="col-12"><b>Order Total: ₹{purchase.items.reduce((t,x)=>t+Number(x.quantity||0)*Number(x.unitPrice||0),0).toFixed(2)}</b></div><div className="col-12"><button disabled={busy||!purchase.items.length} className="btn btn-primary">Create Purchase Order</button></div>
      </form></div></div>
      <div className="card mt-3"><div className="card-header fw-bold">Purchase Orders</div><div className="table-responsive"><table className="table table-sm align-middle"><thead><tr><th>PO No.</th><th>Supplier</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>{purchases.map(p=><tr key={p._id}><td>{p.purchaseNumber}</td><td>{p.supplierId?.supplierName||"-"}</td><td>₹{p.totalAmount}</td><td>{p.status}</td><td>{p.status==="Ordered"&&<><button className="btn btn-sm btn-success me-1" onClick={()=>run(async()=>{await api(`/purchases/${p._id}/receive`,{method:"PATCH",body:"{}"});setMessage("Purchase received; book stock updated");await load();onRefreshBooks();})}>Receive</button><button className="btn btn-sm btn-outline-danger" onClick={()=>run(async()=>{await api(`/purchases/${p._id}/cancel`,{method:"PATCH",body:"{}"});await load();})}>Cancel</button></>}</td></tr>)}{!purchases.length&&<tr><td colSpan="5" className="text-center">No purchase orders</td></tr>}</tbody></table></div></div></div>
    </div>}

    {tab==="loss"&&<div className="row g-3"><div className="col-lg-4"><div className="card"><div className="card-header fw-bold">Report Lost / Damaged Book</div><div className="card-body"><form className="row g-2" onSubmit={saveLoss}>
      <div className="col-12"><label className="form-label">Book</label><select required className="form-select" value={loss.bookId} onChange={e=>setLoss({...loss,bookId:e.target.value})}>{bookOptions}</select></div>
      {field("Quantity",<input type="number" min="1" required className="form-control" value={loss.quantity} onChange={e=>setLoss({...loss,quantity:Number(e.target.value)})}/>)}
      {field("Type",<select className="form-select" value={loss.type} onChange={e=>setLoss({...loss,type:e.target.value})}><option>Lost</option><option>Damaged</option></select>)}
      {field("Reported By",<input className="form-control" value={loss.reportedBy} onChange={e=>setLoss({...loss,reportedBy:e.target.value})}/>)}
      <div className="col-12"><label className="form-label">Reason</label><textarea required className="form-control" value={loss.reason} onChange={e=>setLoss({...loss,reason:e.target.value})}/></div><div className="col-12"><button className="btn btn-primary">Submit Report</button></div>
    </form></div></div></div><div className="col-lg-8"><div className="card"><div className="card-header fw-bold">Reports & Approval</div><div className="table-responsive"><table className="table table-sm align-middle"><thead><tr><th>Book</th><th>Type</th><th>Qty</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>{losses.map(x=><tr key={x._id}><td>{x.bookId?.bookName||"-"}</td><td>{x.type}</td><td>{x.quantity}</td><td>{x.reason}</td><td>{x.status}</td><td>{x.status==="Pending"&&<><button className="btn btn-sm btn-success me-1" onClick={()=>run(async()=>{await api(`/loss-damage/${x._id}/decision`,{method:"PATCH",body:JSON.stringify({status:"Approved"})});setMessage("Approved; available stock reduced");await load();onRefreshBooks();})}>Approve</button><button className="btn btn-sm btn-outline-danger" onClick={()=>run(async()=>{await api(`/loss-damage/${x._id}/decision`,{method:"PATCH",body:JSON.stringify({status:"Rejected"})});await load();})}>Reject</button></>}</td></tr>)}{!losses.length&&<tr><td colSpan="6" className="text-center">No reports</td></tr>}</tbody></table></div></div></div></div>}

    {tab==="audit"&&<div className="row g-3"><div className="col-lg-5"><div className="card"><div className="card-header fw-bold">New Stock Audit</div><div className="card-body"><form onSubmit={saveAudit}>
      <label className="form-label">Remarks</label><input className="form-control mb-3" value={audit.remarks} onChange={e=>setAudit({...audit,remarks:e.target.value})}/>
      <div className="d-flex justify-content-between mb-2"><b>Book Counts</b><button type="button" className="btn btn-sm btn-outline-primary" onClick={()=>setAudit(p=>({...p,items:[...p.items,{bookId:"",countedQuantity:0}]}))}>+ Add Book</button></div>
      {audit.items.map((it,i)=><div className="row g-2 mb-2" key={i}><div className="col-8"><select required className="form-select" value={it.bookId} onChange={e=>setAudit(p=>({...p,items:p.items.map((x,j)=>j===i?{...x,bookId:e.target.value}:x)}))}>{bookOptions}</select></div><div className="col-4"><input required type="number" min="0" className="form-control" placeholder="Counted" value={it.countedQuantity} onChange={e=>setAudit(p=>({...p,items:p.items.map((x,j)=>j===i?{...x,countedQuantity:Number(e.target.value)}:x)}))}/></div></div>)}
      <button disabled={!audit.items.length} className="btn btn-primary mt-2">Save Audit Draft</button>
    </form></div></div></div><div className="col-lg-7"><div className="card"><div className="card-header fw-bold">Audit History</div><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Audit</th><th>Book</th><th>System</th><th>Counted</th><th>Difference</th><th>Status</th><th>Action</th></tr></thead><tbody>{audits.map(a=><React.Fragment key={a._id}>{a.items.map((x,i)=><tr key={x._id||i}><td>{a.auditNumber}</td><td>{x.bookId?.bookName||"-"}</td><td>{x.systemQuantity}</td><td>{x.countedQuantity}</td><td className={x.difference<0?"text-danger":"text-success"}>{x.difference>0?"+":""}{x.difference}</td><td>{a.status}</td><td>{i===0&&a.status==="Draft"&&<button className="btn btn-sm btn-success" onClick={()=>run(async()=>{const reconcile=window.confirm("OK = reconcile book stock to counted quantity. Cancel = complete audit without changing stock.");await api(`/audits/${a._id}/complete`,{method:"PATCH",body:JSON.stringify({reconcile})});setMessage("Audit completed");await load();onRefreshBooks();})}>Complete</button>}</td></tr>)}</React.Fragment>)}{!audits.length&&<tr><td colSpan="7" className="text-center">No audits yet</td></tr>}</tbody></table></div></div></div></div>}

    {tab==="digital"&&<div className="row g-3"><div className="col-lg-4"><div className="card"><div className="card-header fw-bold">{digitalEdit?"Edit Digital Resource":"Add Digital Resource"}</div><div className="card-body"><form className="row g-2" onSubmit={saveDigital}>
      {field("Title",<input required className="form-control" value={digitalForm.title} onChange={e=>setDigitalForm({...digitalForm,title:e.target.value})}/>)}
      {field("Author",<input className="form-control" value={digitalForm.author} onChange={e=>setDigitalForm({...digitalForm,author:e.target.value})}/>)}
      {field("Category",<input className="form-control" value={digitalForm.category} onChange={e=>setDigitalForm({...digitalForm,category:e.target.value})}/>)}
      {field("Resource Type",<select className="form-select" value={digitalForm.resourceType} onChange={e=>setDigitalForm({...digitalForm,resourceType:e.target.value})}>{["PDF","eBook","Audio","Video","Link"].map(x=><option key={x}>{x}</option>)}</select>)}
      <div className="col-12"><label className="form-label">Resource URL</label><input required type="url" className="form-control" value={digitalForm.resourceUrl} onChange={e=>setDigitalForm({...digitalForm,resourceUrl:e.target.value})}/></div>
      {field("Access Level",<select className="form-select" value={digitalForm.accessLevel} onChange={e=>setDigitalForm({...digitalForm,accessLevel:e.target.value})}>{["All","Students","Teachers"].map(x=><option key={x}>{x}</option>)}</select>)}
      <div className="col-12"><label className="form-label">Description</label><textarea className="form-control" value={digitalForm.description} onChange={e=>setDigitalForm({...digitalForm,description:e.target.value})}/></div>
      <div className="col-12"><button className="btn btn-primary">{digitalEdit?"Update Resource":"Add Resource"}</button> {digitalEdit&&<button type="button" className="btn btn-secondary ms-2" onClick={()=>{setDigitalEdit("");setDigitalForm(blankDigital);}}>Cancel</button>}</div>
    </form></div></div></div><div className="col-lg-8"><div className="card"><div className="card-header fw-bold">Digital Resources ({digital.length})</div><div className="table-responsive"><table className="table table-sm align-middle"><thead><tr><th>Title</th><th>Type</th><th>Access</th><th>Open</th><th>Action</th></tr></thead><tbody>{digital.map(d=><tr key={d._id}><td>{d.title}<div className="small text-muted">{d.author}</div></td><td>{d.resourceType}</td><td>{d.accessLevel}</td><td><a href={d.resourceUrl} target="_blank" rel="noreferrer">Open Resource</a></td><td><button className="btn btn-sm btn-outline-primary" onClick={()=>{setDigitalEdit(d._id);setDigitalForm({...blankDigital,...d});}}>Edit</button> <button className="btn btn-sm btn-outline-danger" onClick={()=>run(async()=>{await api(`/digital-resources/${d._id}`,{method:"DELETE"});await load();})}>Deactivate</button></td></tr>)}{!digital.length&&<tr><td colSpan="5" className="text-center">No digital resources</td></tr>}</tbody></table></div></div></div></div>}
  </div>;
}
