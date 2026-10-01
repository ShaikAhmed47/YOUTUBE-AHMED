 "use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [q,setQ]=useState("");
  const router=useRouter();
  function submit(e){e.preventDefault();router.push(q?`/?q=${encodeURIComponent(q)}`:"/");}
  return <header className="topbar">
    <div style={{display:'flex', alignItems:'center', gap:'16px', minWidth:'180px'}}>
      <span style={{fontSize:'20px', cursor:'pointer', padding:'8px'}}>☰</span>
      <Link className="logo" href="/">
        <span style={{color:'red', fontSize:'24px', marginRight:'2px'}}>▶</span> 
        StreamTube
      </Link>
    </div>
    <form className="search" onSubmit={submit}>
      <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/>
      <button>🔍</button>
    </form>
    <div className="row" style={{minWidth:'180px', justifyContent:'flex-end'}}>
      <Link className="btn dark" href="/upload">Upload</Link>
      <Link className="btn" href="/login">Sign in</Link>
    </div>
  </header>
}
