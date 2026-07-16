import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import { MissionHeaderButton } from "@/components/mission-header-button";
export function MobileHeader(){return <header className="mobile-header"><Link href="/" className="mobile-brand" aria-label="언어교환101 홈"><span>L1</span><b>언어교환101<br/><em>Language Exchange 101</em></b></Link><nav><MissionHeaderButton/><Link href="/my-study" className="my-study-header-link" aria-label="My Study"><UserRound/><small>My Study</small></Link><Link href="/activities?focus=search" aria-label="활동 검색"><Search/></Link></nav></header>}
