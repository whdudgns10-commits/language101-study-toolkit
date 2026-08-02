"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import type { SupportedLanguage } from "@/types/language";

type ActivityPhrase = Record<SupportedLanguage, string>;

// Activity screens were created at different times and some still render legacy
// literal labels. This compatibility layer keeps those screens in sync with the
// global language selector while they continue to share their existing state.
const phrases: ActivityPhrase[] = [
  { en:"Activities", ko:"활동", ja:"アクティビティ", zh:"活动" },
  { en:"True or False", ko:"진실 혹은 거짓", ja:"本当かウソか", zh:"真假问答" },
  { en:"30 Second Speaking", ko:"30초 말하기", ja:"30秒スピーキング", zh:"30秒口语" },
  { en:"20 Questions", ko:"스무고개", ja:"20の質問", zh:"二十问" },
  { en:"What If Challenge", ko:"만약에 챌린지", ja:"もしもチャレンジ", zh:"如果挑战" },
  { en:"Funny Questions", ko:"재미있는 질문", ja:"面白い質問", zh:"趣味问题" },
  { en:"Conversation Starters", ko:"대화 시작 질문", ja:"会話のきっかけ", zh:"对话开场问题" },
  { en:"Fun Discuss", ko:"재미있는 토론", ja:"楽しいディスカッション", zh:"趣味讨论" },
  { en:"Guessing Words", ko:"단어 맞히기", ja:"単語当て", zh:"猜词" },
  { en:"Word Battle", ko:"단어 배틀", ja:"ワードバトル", zh:"单词对战" },
  { en:"Balance Game", ko:"밸런스 게임", ja:"究極の二択", zh:"二选一游戏" },
  { en:"Alphabet Challenge", ko:"알파벳 챌린지", ja:"アルファベットチャレンジ", zh:"字母挑战" },
  { en:"Debate: Pros & Cons", ko:"찬반 토론", ja:"賛否ディベート", zh:"正反方辩论" },
  { en:"Choose One Out of Three", ko:"세 가지 중 하나 선택", ja:"三つから一つ選ぶ", zh:"三选一" },
  { en:"Useful Expressions", ko:"유용한 표현", ja:"便利な表現", zh:"实用表达" },
  { en:"Rank It", ko:"순위 정하기", ja:"ランキング", zh:"排序挑战" },
  { en:"Time Challenge", ko:"타임 챌린지", ja:"タイムチャレンジ", zh:"限时挑战" },
  { en:"Find the Spy", ko:"스파이 찾기", ja:"スパイを探せ", zh:"寻找间谍" },
  { en:"Spyfall", ko:"스파이폴", ja:"スパイフォール", zh:"谍影重重" },
  { en:"Secret Mission", ko:"비밀 미션", ja:"秘密のミッション", zh:"秘密任务" },
  { en:"Never Have I Ever", ko:"한 번도 해본 적 없어", ja:"今まで一度もない", zh:"我从来没有" },
  { en:"3 Things in 5 Seconds", ko:"5초 안에 3가지 말하기", ja:"5秒で3つ答える", zh:"5秒说出3个" },
  { en:"Think Fast Challenge", ko:"순발력 챌린지", ja:"瞬発力チャレンジ", zh:"快速反应挑战" },
  { en:"Unexpected Questions, Better Conversations", ko:"뜻밖의 질문으로 더 즐거운 대화", ja:"意外な質問でもっと楽しい会話", zh:"意外的问题，更好的对话" },
  { en:"Name three things before the timer runs out.", ko:"제한 시간이 끝나기 전에 세 가지를 말하세요.", ja:"時間切れになる前に3つ答えましょう。", zh:"请在倒计时结束前说出三个答案。" },
  { en:"Back", ko:"뒤로", ja:"戻る", zh:"返回" },
  { en:"Exit", ko:"종료", ja:"終了", zh:"退出" },
  { en:"Game Settings", ko:"게임 설정", ja:"ゲーム設定", zh:"游戏设置" },
  { en:"Settings", ko:"설정", ja:"設定", zh:"设置" },
  { en:"All", ko:"전체", ja:"すべて", zh:"全部" },
  { en:"All Levels", ko:"모든 난이도", ja:"すべてのレベル", zh:"所有难度" },
  { en:"All Categories", ko:"모든 카테고리", ja:"すべてのカテゴリー", zh:"所有类别" },
  { en:"Beginner", ko:"초급", ja:"初級", zh:"初级" },
  { en:"Intermediate", ko:"중급", ja:"中級", zh:"中级" },
  { en:"Upper Intermediate", ko:"중상급", ja:"中上級", zh:"中高级" },
  { en:"Advanced", ko:"고급", ja:"上級", zh:"高级" },
  { en:"Easy", ko:"쉬움", ja:"やさしい", zh:"简单" },
  { en:"Medium", ko:"보통", ja:"普通", zh:"中等" },
  { en:"Hard", ko:"어려움", ja:"難しい", zh:"困难" },
  { en:"Light", ko:"가볍게", ja:"ライト", zh:"轻松" },
  { en:"Funny", ko:"재미있게", ja:"面白い", zh:"有趣" },
  { en:"Wild", ko:"과감하게", ja:"ワイルド", zh:"大胆" },
  { en:"Category", ko:"카테고리", ja:"カテゴリー", zh:"类别" },
  { en:"Difficulty", ko:"난이도", ja:"難易度", zh:"难度" },
  { en:"Players", ko:"참가자", ja:"参加者", zh:"参与者" },
  { en:"Current Player", ko:"현재 플레이어", ja:"現在のプレイヤー", zh:"当前玩家" },
  { en:"Random Player", ko:"랜덤 플레이어", ja:"ランダムプレイヤー", zh:"随机玩家" },
  { en:"Up Next", ko:"다음 차례", ja:"次の番", zh:"下一位" },
  { en:"Round", ko:"라운드", ja:"ラウンド", zh:"回合" },
  { en:"Question", ko:"질문", ja:"質問", zh:"问题" },
  { en:"Previous", ko:"이전", ja:"前へ", zh:"上一个" },
  { en:"Previous Question", ko:"이전 질문", ja:"前の質問", zh:"上一个问题" },
  { en:"Next", ko:"다음", ja:"次へ", zh:"下一个" },
  { en:"Next Question", ko:"다음 질문", ja:"次の質問", zh:"下一个问题" },
  { en:"Next Topic", ko:"다음 주제", ja:"次のトピック", zh:"下一个主题" },
  { en:"Next Player", ko:"다음 플레이어", ja:"次のプレイヤー", zh:"下一位玩家" },
  { en:"Next Turn", ko:"다음 차례", ja:"次のターン", zh:"下一回合" },
  { en:"Random", ko:"랜덤", ja:"ランダム", zh:"随机" },
  { en:"Random Question", ko:"랜덤 질문", ja:"ランダム質問", zh:"随机问题" },
  { en:"Random Draw", ko:"랜덤 뽑기", ja:"ランダム抽選", zh:"随机抽取" },
  { en:"Shuffle", ko:"다시 뽑기", ja:"シャッフル", zh:"重新抽取" },
  { en:"Shuffling...", ko:"뽑는 중...", ja:"シャッフル中...", zh:"正在抽取..." },
  { en:"Skip", ko:"건너뛰기", ja:"スキップ", zh:"跳过" },
  { en:"Start", ko:"시작", ja:"開始", zh:"开始" },
  { en:"Start Game", ko:"게임 시작", ja:"ゲーム開始", zh:"开始游戏" },
  { en:"Start Practice", ko:"연습 시작", ja:"練習を始める", zh:"开始练习" },
  { en:"Start Timer", ko:"타이머 시작", ja:"タイマー開始", zh:"开始计时" },
  { en:"Pause", ko:"일시정지", ja:"一時停止", zh:"暂停" },
  { en:"Resume", ko:"계속", ja:"再開", zh:"继续" },
  { en:"Reset", ko:"초기화", ja:"リセット", zh:"重置" },
  { en:"Reset Votes", ko:"투표 초기화", ja:"投票をリセット", zh:"重置投票" },
  { en:"Running", ko:"진행 중", ja:"進行中", zh:"进行中" },
  { en:"Success", ko:"성공", ja:"成功", zh:"成功" },
  { en:"Failed", ko:"실패", ja:"失敗", zh:"失败" },
  { en:"Finish", ko:"종료", ja:"終了", zh:"结束" },
  { en:"End Game", ko:"게임 종료", ja:"ゲーム終了", zh:"结束游戏" },
  { en:"Play Again", ko:"다시 하기", ja:"もう一度", zh:"再玩一次" },
  { en:"Favorite", ko:"즐겨찾기", ja:"お気に入り", zh:"收藏" },
  { en:"Add to favorites", ko:"즐겨찾기에 추가", ja:"お気に入りに追加", zh:"添加到收藏" },
  { en:"Remove from favorites", ko:"즐겨찾기 해제", ja:"お気に入りから削除", zh:"取消收藏" },
  { en:"Favorites Only", ko:"즐겨찾기만", ja:"お気に入りのみ", zh:"仅收藏" },
  { en:"Save", ko:"저장", ja:"保存", zh:"保存" },
  { en:"Save to My Study", ko:"My Study에 저장", ja:"My Studyに保存", zh:"保存到 My Study" },
  { en:"Saved to My Study", ko:"My Study에 저장됨", ja:"My Studyに保存済み", zh:"已保存到 My Study" },
  { en:"Memo", ko:"메모", ja:"メモ", zh:"笔记" },
  { en:"Search", ko:"검색", ja:"検索", zh:"搜索" },
  { en:"Follow-up Questions", ko:"추가 질문", ja:"追加質問", zh:"追问" },
  { en:"Show Follow-up Questions", ko:"추가 질문 보기", ja:"追加質問を表示", zh:"显示追问" },
  { en:"Hide Follow-up Questions", ko:"추가 질문 숨기기", ja:"追加質問を隠す", zh:"隐藏追问" },
  { en:"Useful Expressions", ko:"유용한 표현", ja:"便利な表現", zh:"实用表达" },
  { en:"Show Useful Expressions", ko:"유용한 표현 보기", ja:"便利な表現を表示", zh:"显示实用表达" },
  { en:"Hide Useful Expressions", ko:"유용한 표현 숨기기", ja:"便利な表現を隠す", zh:"隐藏实用表达" },
  { en:"Answer Style", ko:"답변 방식", ja:"回答スタイル", zh:"回答方式" },
  { en:"Everyone Answers", ko:"모두 답하기", ja:"全員が答える", zh:"所有人回答" },
  { en:"One Person Answers", ko:"한 명이 답하기", ja:"一人が答える", zh:"一人回答" },
  { en:"Pair Discussion", ko:"짝 토론", ja:"ペアで話す", zh:"两人讨论" },
  { en:"Vote First, Explain After", ko:"먼저 투표하고 설명하기", ja:"先に投票して説明", zh:"先投票后说明" },
  { en:"Solo Choice", ko:"개인 선택", ja:"個人で選択", zh:"个人选择" },
  { en:"Group Vote", ko:"그룹 투표", ja:"グループ投票", zh:"小组投票" },
  { en:"Recent", ko:"최근 질문", ja:"最近", zh:"最近" },
  { en:"Recent Questions", ko:"최근 질문", ja:"最近の質問", zh:"最近的问题" },
  { en:"History", ko:"기록", ja:"履歴", zh:"记录" },
  { en:"Session Summary", ko:"세션 요약", ja:"セッションまとめ", zh:"练习总结" },
  { en:"Questions viewed", ko:"확인한 질문", ja:"確認した質問", zh:"已查看问题" },
  { en:"No questions match these filters.", ko:"조건에 맞는 질문이 없습니다.", ja:"条件に合う質問がありません。", zh:"没有符合筛选条件的问题。" },
  { en:"Try another category or add questions to your favorites.", ko:"다른 카테고리를 선택하거나 즐겨찾기를 확인해보세요.", ja:"別のカテゴリーを選ぶか、お気に入りを確認してください。", zh:"请选择其他类别或查看收藏。" },
  { en:"Finding a great question...", ko:"좋은 질문을 찾는 중...", ja:"質問を選んでいます...", zh:"正在挑选好问题..." },
  { en:"Finding an unexpected question...", ko:"뜻밖의 질문을 찾는 중...", ja:"意外な質問を選んでいます...", zh:"正在挑选意外的问题..." },
  { en:"Why did you choose this option?", ko:"왜 이 선택지를 골랐나요?", ja:"なぜこの選択肢を選びましたか？", zh:"为什么选择这个选项？" },
  { en:"Show Argument Ideas", ko:"논거 아이디어 보기", ja:"論点のアイデアを見る", zh:"查看论点提示" },
  { en:"Main Argument 1", ko:"핵심 주장 1", ja:"主な主張 1", zh:"主要论点 1" },
  { en:"Main Argument 2", ko:"핵심 주장 2", ja:"主な主張 2", zh:"主要论点 2" },
  { en:"Main Argument 3", ko:"핵심 주장 3", ja:"主な主張 3", zh:"主要论点 3" },
  { en:"Examples or Evidence", ko:"예시 또는 근거", ja:"例または根拠", zh:"示例或证据" },
  { en:"Possible Rebuttal", ko:"예상 반론", ja:"予想される反論", zh:"可能的反驳" },
  { en:"Team Notes", ko:"팀 메모", ja:"チームメモ", zh:"团队笔记" },
  { en:"Leader", ko:"리더", ja:"リーダー", zh:"队长" },
  { en:"TIME OUT", ko:"시간 종료", ja:"タイムアップ", zh:"时间到" },
  { en:"WINNER", ko:"우승자", ja:"優勝者", zh:"获胜者" },
  { en:"OUT", ko:"탈락", ja:"脱落", zh:"淘汰" },
  { en:"READY", ko:"준비", ja:"準備", zh:"准备" },
  { en:"NOW", ko:"현재", ja:"現在", zh:"当前" },
  { en:"SURVIVOR", ko:"생존", ja:"生存", zh:"幸存" },
  { en:"No limit", ko:"제한 없음", ja:"制限なし", zh:"不限时" },
  { en:"Sound", ko:"소리", ja:"サウンド", zh:"声音" },
  { en:"Full Screen", ko:"전체 화면", ja:"全画面", zh:"全屏" },
  { en:"Presentation Mode", ko:"프레젠테이션 모드", ja:"プレゼンテーションモード", zh:"演示模式" },
  { en:"Random Penalty", ko:"랜덤 벌칙", ja:"ランダム罰ゲーム", zh:"随机惩罚" },
  { en:"Random Question Mode", ko:"자동 질문 모드", ja:"ランダム質問モード", zh:"随机问题模式" },
  { en:"Experience Survival", ko:"경험 생존 게임", ja:"体験サバイバル", zh:"经历生存赛" },
  { en:"Translate", ko:"한국어로 번역", ja:"翻訳", zh:"翻译" },
  { en:"Hide Translation", ko:"번역 숨기기", ja:"翻訳を隠す", zh:"隐藏翻译" },
];

const reverse = new Map<string, ActivityPhrase>();
for (const phrase of phrases) for (const value of Object.values(phrase)) reverse.set(value, phrase);

function translateValue(value: string, language: SupportedLanguage) {
  const surrounding = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!surrounding) return value;
  const [, before, core, after] = surrounding;
  const direct = reverse.get(core);
  if (direct) return `${before}${direct[language]}${after}`;
  const round = core.match(/^Round\s+(\d+)$/i);
  if (round) return `${before}${language === "ko" ? `라운드 ${round[1]}` : language === "ja" ? `ラウンド ${round[1]}` : language === "zh" ? `第 ${round[1]} 回合` : core}${after}`;
  const player = core.match(/^Player\s+(\d+)$/i);
  if (player) return `${before}${language === "ko" ? `참가자 ${player[1]}` : language === "ja" ? `プレイヤー ${player[1]}` : language === "zh" ? `玩家 ${player[1]}` : core}${after}`;
  return value;
}

function translateTree(root: Node, language: SupportedLanguage) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    if (node.parentElement?.closest("script,style,[data-no-activity-translate]") || !node.nodeValue) continue;
    const next = translateValue(node.nodeValue, language);
    if (next !== node.nodeValue) node.nodeValue = next;
  }
  const elements = root instanceof Element ? [root, ...root.querySelectorAll<HTMLElement>("[aria-label],[placeholder],[title]")] : [...document.querySelectorAll<HTMLElement>("[aria-label],[placeholder],[title]")];
  for (const element of elements) for (const attribute of ["aria-label", "placeholder", "title"] as const) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const next = translateValue(value, language);
    if (next !== value) element.setAttribute(attribute, next);
  }
}

export function ActivityLanguageBridge() {
  const pathname = usePathname();
  const { language } = useLanguage();
  useEffect(() => {
    if (!pathname.startsWith("/activities")) return;
    let scheduled = 0;
    const apply = () => { scheduled = 0; translateTree(document.body, language); };
    apply();
    const observer = new MutationObserver(() => {
      if (!scheduled) scheduled = window.requestAnimationFrame(apply);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "placeholder", "title"] });
    return () => { observer.disconnect(); if (scheduled) cancelAnimationFrame(scheduled); };
  }, [language, pathname]);
  return null;
}
