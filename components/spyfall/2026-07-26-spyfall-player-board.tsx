type SpyfallPlayerBoardProps = {
  playerCount: number;
  eliminatedPlayers: number[];
  currentQuestioner?: number;
};

export function SpyfallPlayerBoard({
  playerCount,
  eliminatedPlayers,
  currentQuestioner,
}: SpyfallPlayerBoardProps) {
  return <section className="spyfall-player-board" aria-label="Player status">
    {Array.from({ length: playerCount }, (_, index) => index + 1).map((number) => {
      const eliminated = eliminatedPlayers.includes(number);
      return <div
        className={`${eliminated ? "is-eliminated" : "is-alive"} ${currentQuestioner === number ? "is-current" : ""}`}
        key={number}
      >
        <span>{number}</span>
        <b>{eliminated ? "OUT" : "ALIVE"}</b>
      </div>;
    })}
  </section>;
}

