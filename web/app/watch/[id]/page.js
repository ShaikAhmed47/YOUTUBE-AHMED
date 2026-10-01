 "use client";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import { api,SERVER } from "../../../lib/api";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function Watch(){
 const {id}=useParams(); const [video,setVideo]=useState(null); const [comments,setComments]=useState([]); const [text,setText]=useState("");
 const [subscribed, setSubscribed] = useState(false);
 async function load(){setVideo(await api(`/videos/${id}`));setComments(await api(`/comments/${id}`));}
 useEffect(()=>{if(id)load()},[id]);
 async function like(){await api(`/videos/${id}/like`,{method:"POST"});load()}
 async function comment(e){e.preventDefault();await api(`/comments/${id}`,{method:"POST",body:JSON.stringify({text})});setText("");load()}
 async function subscribe(){
    if(!video?.channel?._id) return;
    try {
      const res = await api(`/channels/${video.channel._id}/subscribe`, {method:"POST"});
      setSubscribed(res.subscribed);
    } catch(err) {
      alert("Must be logged in to subscribe");
    }
 }

 if(!video)return <main className="shell"><p>Loading...</p></main>;
 const src=video.videoUrl.startsWith("http")?video.videoUrl:`${SERVER}${video.videoUrl}`;
 return (
  <main className="shell detail" style={{display:'flex', gap:'24px', maxWidth:'1600px'}}>
    <div style={{flex:1, minWidth:0}}>
      <video className="video" controls src={src} autoPlay style={{width:'100%', borderRadius:'12px', background:'#000'}} />
      <h1 style={{fontSize:'20px', margin:'12px 0 10px 0'}}>{video.title}</h1>
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'12px'}}>
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
          <a href={`/channel/${video.channel?.handle}`}>
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#333', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {video.channel?.avatar ? <img src={video.channel.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/> : video.channel?.name?.[0]||'C'}
            </div>
          </a>
          <div>
            <a href={`/channel/${video.channel?.handle}`} style={{fontWeight:'bold', display:'block'}}>{video.channel?.name}</a>
            <div className="muted" style={{fontSize:'12px'}}>{video.channel?.subscribers?.toLocaleString() || 0} subscribers</div>
          </div>
          <button onClick={subscribe} style={{background: subscribed ? '#272727' : '#f1f1f1', color: subscribed ? '#f1f1f1' : '#0f0f0f', border:'none', padding:'10px 16px', borderRadius:'18px', fontWeight:'500', cursor:'pointer', marginLeft:'12px'}}>
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        <div style={{display:'flex', gap:'8px'}}>
          <div style={{background:'#272727', borderRadius:'18px', display:'flex', overflow:'hidden'}}>
            <button onClick={like} style={{background:'transparent', border:'none', color:'#fff', padding:'10px 16px', cursor:'pointer', fontWeight:'500', display:'flex', alignItems:'center', gap:'6px'}}>
              👍 {video.likes.length}
            </button>
            <div style={{width:'1px', background:'#3f3f3f', margin:'6px 0'}}></div>
            <button style={{background:'transparent', border:'none', color:'#fff', padding:'10px 16px', cursor:'pointer'}}>
              👎
            </button>
          </div>
          <button style={{background:'#272727', borderRadius:'18px', border:'none', color:'#fff', padding:'10px 16px', cursor:'pointer', fontWeight:'500', display:'flex', alignItems:'center', gap:'6px'}}>
            Share
          </button>
        </div>
      </div>

      <div style={{background:'#272727', borderRadius:'12px', padding:'12px', marginTop:'16px', fontSize:'14px'}}>
        <div style={{fontWeight:'bold', marginBottom:'8px'}}>{video.views.toLocaleString()} views • {timeAgo(video.createdAt)}</div>
        <div style={{whiteSpace:'pre-wrap', lineHeight:'1.4'}}>{video.description}</div>
      </div>

      <div style={{marginTop:'24px'}}>
        <h2 style={{fontSize:'20px', marginBottom:'24px'}}>{comments.length} Comments</h2>
        <div style={{display:'flex', gap:'16px', marginBottom:'32px'}}>
           <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#333', flexShrink:0}}></div>
           <form onSubmit={comment} style={{flex:1, display:'flex', flexDirection:'column', gap:'8px'}}>
             <input style={{width:'100%', background:'transparent', border:'none', borderBottom:'1px solid #444', color:'#fff', padding:'4px 0', fontSize:'14px', outline:'none'}} value={text} onChange={e=>setText(e.target.value)} placeholder="Add a comment..."/>
             <div style={{display:'flex', justifyContent:'flex-end'}}>
                <button disabled={!text} style={{background: text ? '#3ea6ff' : '#272727', color: text ? '#000' : '#717171', border:'none', padding:'10px 16px', borderRadius:'18px', fontWeight:'500', cursor: text ? 'pointer' : 'default'}}>Comment</button>
             </div>
           </form>
        </div>
        
        {comments.map(c=>(
          <div style={{display:'flex', gap:'16px', marginBottom:'20px'}} key={c._id}>
             <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#333', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
               {c.user?.name?.[0] || 'U'}
             </div>
             <div>
               <div style={{fontSize:'13px', fontWeight:'500', marginBottom:'4px'}}>@{c.user?.name} <span className="muted" style={{fontWeight:'normal', marginLeft:'4px'}}>{timeAgo(c.createdAt)}</span></div>
               <div style={{fontSize:'14px', lineHeight:'1.4'}}>{c.text}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  </main>
 );
}
