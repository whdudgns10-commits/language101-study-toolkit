import { EyeOff } from "lucide-react";

type SpyfallVotePanelProps = {
  alivePlayers: number[];
  voterNumber: number;
  voterPosition: number;
  voterTotal: number;
  selectedVote: number | null;
  onSelect: (number: number) => void;
  onConfirm: () => void;
};

export function SpyfallVotePanel({
  alivePlayers,
  voterNumber,
  voterPosition,
  voterTotal,
  selectedVote,
  onSelect,
  onConfirm,
}: SpyfallVotePanelProps) {
  return <section className="spyfall-card spyfall-voting">
    <EyeOff aria-hidden="true"/>
    <div className="spyfall-progress">Voter {voterPosition} / {voterTotal}</div>
    <h1>스파이 의심 투표</h1>
    <p>참가자 {voterNumber}님만 화면을 보고 스파이라고 생각하는 한 명을 선택하세요.</p>
    <small>Private vote · 다른 사람에게 선택을 보여주지 마세요.</small>
    <div className="spyfall-player-grid">
      {alivePlayers.map((number) => <button
        aria-pressed={selectedVote === number}
        className={selectedVote === number ? "is-selected" : ""}
        disabled={number === voterNumber}
        key={number}
        onClick={() => onSelect(number)}
      >{number}</button>)}
    </div>
    <button
      className="button button-primary spyfall-main-button"
      disabled={!selectedVote}
      onClick={onConfirm}
    >투표 확정 · Confirm Vote</button>
  </section>;
}

