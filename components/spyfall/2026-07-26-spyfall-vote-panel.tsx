import { EyeOff } from "lucide-react";

type SpyfallVotePanelProps = {
  alivePlayers: number[];
  playerNames: string[];
  voterNumber: number;
  voterPosition: number;
  voterTotal: number;
  selectedVote: number | null;
  onSelect: (number: number) => void;
  onConfirm: () => void;
};

export function SpyfallVotePanel({
  alivePlayers,
  playerNames,
  voterNumber,
  voterPosition,
  voterTotal,
  selectedVote,
  onSelect,
  onConfirm,
}: SpyfallVotePanelProps) {
  const playerName = (number: number) => playerNames[number - 1]?.trim() || `Player ${number}`;
  return <section className="spyfall-card spyfall-voting">
    <EyeOff aria-hidden="true"/>
    <div className="spyfall-progress">Voter {voterPosition} / {voterTotal}</div>
    <h1>Suspect Vote<small>스파이 의심 투표</small></h1>
    <p>Only {playerName(voterNumber)} should look. Choose the person you think is the spy.<small>{playerName(voterNumber)}님만 화면을 보고 스파이라고 생각하는 한 명을 선택하세요.</small></p>
    <small>PRIVATE VOTE · 다른 사람에게 선택을 보여주지 마세요.</small>
    <div className="spyfall-player-grid">
      {alivePlayers.map((number) => <button
        aria-pressed={selectedVote === number}
        className={selectedVote === number ? "is-selected" : ""}
        disabled={number === voterNumber}
        key={number}
        onClick={() => onSelect(number)}
      ><b>{playerName(number)}</b><small>Player {number}</small></button>)}
    </div>
    <button
      className="button button-primary spyfall-main-button"
      disabled={!selectedVote}
      onClick={onConfirm}
    >Confirm Vote<small>투표 확정</small></button>
  </section>;
}
