import { BalanceGame } from "@/components/balance-game";
import { AccessGuard } from "@/components/access/2026-07-17-access-guard";
export const metadata={title:"Balance Game Practice | Language101",description:"Choose A or B and explain your choice."};
export default function Page(){return <AccessGuard><BalanceGame/></AccessGuard>}
