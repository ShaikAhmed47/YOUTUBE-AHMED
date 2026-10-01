import Link from "next/link";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="nav-group">
        <Link href="/" className="nav-item">
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </Link>
        <Link href="/" className="nav-item">
          <span className="icon">⚡</span>
          <span className="label">Shorts</span>
        </Link>
        <Link href="/" className="nav-item">
          <span className="icon">📺</span>
          <span className="label">Subscriptions</span>
        </Link>
      </div>
      
      <div className="divider"></div>
      
      <div className="nav-group">
        <div className="nav-title">You <span>›</span></div>
        <Link href="/" className="nav-item">
          <span className="icon">🕒</span>
          <span className="label">History</span>
        </Link>
      </div>
      
      <div className="divider"></div>
      
      <div className="nav-group">
        <div className="nav-title">Explore</div>
        <Link href="/trending" className="nav-item">
          <span className="icon">🔥</span>
          <span className="label">Trending</span>
        </Link>
        <Link href="/" className="nav-item">
          <span className="icon">🎵</span>
          <span className="label">Music</span>
        </Link>
        <Link href="/" className="nav-item">
          <span className="icon">🎮</span>
          <span className="label">Gaming</span>
        </Link>
      </div>
    </aside>
  );
}
