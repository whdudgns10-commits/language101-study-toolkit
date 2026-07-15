import Link from "next/link"; import { ArrowLeft, Home } from "lucide-react";
export function PageHeader({title,description}:{title:string;description:string}){return <header className="page-header section-shell"><Link href="/" aria-label="뒤로 가기"><ArrowLeft/></Link><div><h1>{title}</h1><p>{description}</p></div><Link href="/" aria-label="홈으로"><Home/></Link></header>}
