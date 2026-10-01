import VideoCard from "../components/VideoCard";
import { API } from "../lib/api";

async function getVideos(q=""){
  const r=await fetch(`${API}/videos${q?`?q=${encodeURIComponent(q)}`:""}`,{cache:"no-store"});
  return r.json();
}
export default async function Home({searchParams}) {
  const params=await searchParams; const q=params?.q||""; const videos=await getVideos(q);
  
  const categories = ["All", "Gaming", "Music", "Live", "Mixes", "News", "JavaScript", "React", "Node.js", "Podcasts"];
  
  return (
    <main className="shell" style={{paddingTop:'0'}}>
      {!q && (
        <div style={{display:'flex', gap:'12px', overflowX:'auto', padding:'12px 0 24px 0', borderBottom:'1px solid #292929', marginBottom:'24px', position:'sticky', top:0, background:'#0f0f0f', zIndex:5}} className="categories-pills">
          {categories.map((c, i) => (
            <div key={c} style={{background: i===0 ? '#f1f1f1' : '#272727', color: i===0 ? '#0f0f0f' : '#f1f1f1', padding:'6px 12px', borderRadius:'8px', fontSize:'14px', whiteSpace:'nowrap', fontWeight:'500', cursor:'pointer'}}>
              {c}
            </div>
          ))}
        </div>
      )}
      {q && <h2 style={{marginTop:0, marginBottom:'24px'}}>Search results for: {q}</h2>}
      <section className="grid">
        {videos.map(v=><VideoCard key={v._id} video={v}/>)}
      </section>
    </main>
  );
}
