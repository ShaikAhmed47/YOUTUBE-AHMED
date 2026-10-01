import VideoCard from "../../components/VideoCard";
import { API } from "../../lib/api";
export default async function Trending(){
 const videos=await (await fetch(`${API}/videos/trending`,{cache:"no-store"})).json();
 return <main className="shell"><h1>Trending</h1><p className="muted">Videos ordered using engagement signals.</p><section className="grid">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</section></main>
}
