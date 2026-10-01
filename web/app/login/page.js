 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function Login(){
 const [register,setRegister]=useState(false),[form,setForm]=useState({name:"",email:"demo@streamtube.dev",password:"Demo@123"}),[error,setError]=useState("");
 const router=useRouter();
 async function submit(e){e.preventDefault();try{const d=await api(register?"/auth/register":"/auth/login",{method:"POST",body:JSON.stringify(form)});localStorage.setItem("token",d.token);router.push("/");}catch(e){setError(e.message)}}
 return <main className="shell"><form className="form panel" onSubmit={submit}><h1>{register?"Create account":"Login"}</h1>{register&&<input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}<input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>{error&&<p style={{color:"#ff6b6b"}}>{error}</p>}<button className="btn">{register?"Register":"Login"}</button><button type="button" className="btn dark" onClick={()=>setRegister(!register)}>{register?"Already have an account":"Create an account"}</button></form></main>
}
