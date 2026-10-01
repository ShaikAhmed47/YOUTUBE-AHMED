import Link from "next/link";

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

export default function VideoCard({ video }) {
  return (
    <article className="card">
      <Link href={`/watch/${video._id}`}>
        <div className="thumb">
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          ) : (
            <div style={{background:'#272727', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#555'}}>VIDEO</div>
          )}
        </div>
      </Link>
      <div className="cardbody" style={{display:'flex', gap:'12px', marginTop:'12px', padding:'0', alignItems:'flex-start'}}>
        <Link href={`/channel/${video.channel?.handle || ''}`}>
          <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'#333', overflow:'hidden', flexShrink:0}}>
            {video.channel?.avatar ? (
              <img src={video.channel.avatar} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/>
            ) : (
              <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'14px', textTransform:'uppercase'}}>{video.channel?.name?.[0] || 'C'}</div>
            )}
          </div>
        </Link>
        <div style={{display:'flex', flexDirection:'column'}}>
          <Link href={`/watch/${video._id}`}>
            <h3 style={{margin:'0 0 4px 0', fontSize:'16px', fontWeight:'600', color:'#f1f1f1', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{video.title}</h3>
          </Link>
          <Link href={`/channel/${video.channel?.handle || ''}`}>
            <div className="muted" style={{display:'flex', alignItems:'center', marginTop:'4px'}}>
              {video.channel?.name || "Channel"}
              <span style={{marginLeft:'4px', fontSize:'12px'}}>✓</span>
            </div>
          </Link>
          <div className="muted">
            {video.views.toLocaleString()} views • {timeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </article>
  );
}
