 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function Upload(){
 const [form,setForm]=useState({title:"",description:"",tags:""}),[file,setFile]=useState(null),[status,setStatus]=useState("");
 const router=useRouter();
 async function submit(e){e.preventDefault();try{setStatus("Uploading...");const body=new FormData();body.append("video",file);Object.entries(form).forEach(([k,v])=>body.append(k,v));const v=await api("/videos/upload",{method:"POST",body});router.push(`/watch/${v._id}`)}catch(e){setStatus(e.message)}}
 return <main className="shell"><form className="form panel" onSubmit={submit}><h1>Upload video</h1><input required placeholder="Video title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><textarea rows="5" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><input placeholder="Tags: react,node,mongodb" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/><input required type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])}/><button className="btn">Publish video</button><p className="muted">{status}</p></form></main>
}
