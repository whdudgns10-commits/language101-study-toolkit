"use client";
import Link from "next/link"; import { usePathname } from "next/navigation"; import { BookOpenText, Dices, Home, LayoutGrid, UserRound } from "lucide-react";
const items=[{href:"/",label:"Home",icon:Home},{href:"/activities",label:"Activities",icon:LayoutGrid},{href:"/random",label:"Random",icon:Dices},{href:"/expressions",label:"Expressions",icon:BookOpenText},{href:"/my-study",label:"My Study",icon:UserRound}];
export function MobileBottomNav(){const path=usePathname();return <nav className="mobile-bottom-nav" aria-label="모바일 주요 메뉴">{items.map(({href,label,icon:Icon})=>{const base=href.split("?")[0];const active=base==="/"?path==="/":path.startsWith(base);return <Link href={href} className={active?"is-active":""} key={label}><Icon/><span>{label}</span></Link>})}</nav>}
