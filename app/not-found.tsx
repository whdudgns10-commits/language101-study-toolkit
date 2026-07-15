import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404</span><h1>Activity not found</h1><p>This material may have moved or no longer exists.</p><Link className="button button-primary" href="/">Back to Toolkit</Link></main>;
}
