type SpyfallCandidateGridProps = {
  candidates: string[];
  answer?: string;
  compact?: boolean;
};

export function SpyfallCandidateGrid({
  candidates,
  answer,
  compact = false,
}: SpyfallCandidateGridProps) {
  return <div className={`spyfall-candidate-grid ${compact ? "is-compact" : ""}`}>
    {candidates.map((candidate, index) => <div
      className={answer === candidate ? "is-answer" : ""}
      key={candidate}
    >
      <span>{index + 1}</span>
      <b>{candidate}</b>
      {answer === candidate && <small>ANSWER · 정답</small>}
    </div>)}
  </div>;
}

