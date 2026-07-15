import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { MissionHeaderButton } from "@/components/mission-header-button";
export function MobileHeader(){return <header className="mobile-header"><Link href="/" className="mobile-brand"><span>L1</span><b>Language101<br/><em>Study Toolkit</em></b></Link><nav><MissionHeaderButton/><Link href="/activities?favorites=true" aria-label="즐겨찾기 보기"><Heart/></Link><Link href="/activities?focus=search" aria-label="활동 검색"><Search/></Link></nav></header>}
