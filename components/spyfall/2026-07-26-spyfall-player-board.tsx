type SpyfallPlayerBoardProps = {
  playerCount: number;
  eliminatedPlayers: number[];
  currentQuestioner?: number;
  playerNames?: string[];
};

export function SpyfallPlayerBoard({
  playerCount,
  eliminatedPlayers,
  currentQuestioner,
  playerNames = [],
}: SpyfallPlayerBoardProps) {
  return <section className="spyfall-player-board" aria-label="Player status">
    {Array.from({ length: playerCount }, (_, index) => index + 1).map((number) => {
      const eliminated = eliminatedPlayers.includes(number);
      return <div
        className={`${eliminated ? "is-eliminated" : "is-alive"} ${currentQuestioner === number ? "is-current" : ""}`}
        key={number}
      >
        <span>{number}</span>
        <strong>{playerNames[number - 1]?.trim() || `Player ${number}`}</strong>
        <b>{eliminated ? "OUT · 탈락" : "ALIVE · 생존"}</b>
      </div>;
    })}
  </section>;
}
