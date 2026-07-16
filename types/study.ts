export type StudyStatus = "not-started" | "completed" | "used";
export type SavedExpressionStatus = "new" | "reviewing" | "used" | "mastered";

export type ExpressionUsageLog = {
  id: string; expressionId: string; expression: string; date: string; language?: string;
  situation: string; partner: string; confidence: 1 | 2 | 3 | 4 | 5; note: string; createdAt: string;
};

export type StudyProgressEntry = { status: StudyStatus; completedAt?: string; memo?: string };
export type DailyStudyProgress = {
  date: string;
  missions: Record<string, StudyProgressEntry>;
  dailyExpression: Record<string, StudyProgressEntry>;
  practiceExpressions: Record<string, StudyProgressEntry>;
};

export type SavedExpression = {
  id: string; expression: string; meaning: string; example: string; situation: string;
  language: string; difficulty: string; tags: string[]; note: string;
  status: SavedExpressionStatus; source?: string; createdAt: string; updatedAt: string;
};

export type StudyNote = {
  id: string; title: string; date: string; content: string;
  relatedExpressionIds: string[]; relatedMissionIds: string[];
  createdAt: string; updatedAt: string;
};
