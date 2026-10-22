import type { SpyfallAnswer } from "@/types/2026-07-26-spyfall";

type SpyfallCandidateGridProps = {
  candidates: SpyfallAnswer[];
  answer?: SpyfallAnswer;
  compact?: boolean;
};

export function SpyfallCandidateGrid({
  candidates,
  answer,
  compact = false,
}: SpyfallCandidateGridProps) {
  return <div className={`spyfall-candidate-grid ${compact ? "is-compact" : ""}`}>
    {candidates.map((candidate, index) => <div
      className={answer?.id === candidate.id ? "is-answer" : ""}
      key={candidate.id}
    >
      <span>{index + 1}</span>
      <b>{candidate.english}</b>
      <small className="spyfall-candidate-korean">{candidate.korean}</small>
      {answer?.id === candidate.id && <small className="spyfall-candidate-answer">ANSWER · 정답</small>}
    </div>)}
  </div>;
}

