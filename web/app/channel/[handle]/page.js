import VideoCard from "../../../components/VideoCard";
import { API } from "../../../lib/api";
export default async function Channel({params}){
 const {handle}=await params; const r=await fetch(`${API}/channels/${handle}`,{cache:"no-store"}); if(!r.ok)return <main className="shell"><h1>Channel not found</h1></main>;
 const {channel,videos}=await r.json();
 return <main className="shell"><div className="panel"><h1>{channel.name}</h1><p className="muted">@{channel.handle} • {channel.subscribers.toLocaleString()} subscribers</p><p>{channel.description}</p></div><h2>Videos</h2><section className="grid">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</section></main>
}
