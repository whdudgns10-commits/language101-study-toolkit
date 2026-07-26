export type SpyfallLocationCategory =
  | "교통"
  | "교육"
  | "의료"
  | "여가"
  | "음식점"
  | "공공시설"
  | "쇼핑"
  | "스포츠"
  | "여행"
  | "유흥";

export type SpyfallLocation = {
  id: string;
  nameKo: string;
  nameEn: string;
  category: SpyfallLocationCategory;
  active: boolean;
};

export type SpyfallQuestion = {
  id: string;
  questionKo: string;
  questionEn: string;
  active: boolean;
};

export const spyfallLocationCategories: SpyfallLocationCategory[] = [
  "교통", "교육", "의료", "여가", "음식점",
  "공공시설", "쇼핑", "스포츠", "여행", "유흥",
];

const locationRows: Array<[string, string, SpyfallLocationCategory]> = [
  ["공항", "Airport", "교통"],
  ["카페", "Cafe", "음식점"],
  ["학교", "School", "교육"],
  ["병원", "Hospital", "의료"],
  ["지하철", "Subway", "교통"],
  ["헬스장", "Gym", "스포츠"],
  ["놀이공원", "Amusement Park", "여가"],
  ["영화관", "Movie Theater", "여가"],
  ["편의점", "Convenience Store", "쇼핑"],
  ["경찰서", "Police Station", "공공시설"],
  ["해변", "Beach", "여행"],
  ["캠핑장", "Campsite", "여행"],
  ["호텔", "Hotel", "여행"],
  ["도서관", "Library", "공공시설"],
  ["노래방", "Karaoke Room", "유흥"],
  ["미용실", "Hair Salon", "공공시설"],
  ["백화점", "Department Store", "쇼핑"],
  ["결혼식장", "Wedding Hall", "공공시설"],
  ["수영장", "Swimming Pool", "스포츠"],
  ["식당", "Restaurant", "음식점"],
  ["동물원", "Zoo", "여가"],
  ["시장", "Market", "쇼핑"],
  ["회사", "Office", "공공시설"],
  ["축구장", "Soccer Stadium", "스포츠"],
  ["콘서트장", "Concert Hall", "여가"],
  ["미술관", "Art Gallery", "여가"],
  ["박물관", "Museum", "여가"],
  ["사우나", "Sauna", "여가"],
  ["클럽", "Nightclub", "유흥"],
  ["카지노", "Casino", "유흥"],
  ["대학교", "University", "교육"],
  ["버스 터미널", "Bus Terminal", "교통"],
  ["기차역", "Train Station", "교통"],
  ["약국", "Pharmacy", "의료"],
  ["은행", "Bank", "공공시설"],
  ["우체국", "Post Office", "공공시설"],
  ["공원", "Park", "여가"],
  ["볼링장", "Bowling Alley", "스포츠"],
  ["PC방", "PC Cafe", "유흥"],
  ["공연장", "Theater", "여가"],
  ["루프탑 바", "Rooftop Bar", "유흥"],
  ["레스토랑", "Fine Dining Restaurant", "음식점"],
  ["패스트푸드점", "Fast Food Restaurant", "음식점"],
  ["스키장", "Ski Resort", "스포츠"],
  ["워터파크", "Water Park", "여가"],
  ["수족관", "Aquarium", "여가"],
  ["야구장", "Baseball Stadium", "스포츠"],
  ["농구장", "Basketball Court", "스포츠"],
  ["교회", "Church", "공공시설"],
  ["법원", "Courthouse", "공공시설"],
];

export const defaultSpyfallLocations: SpyfallLocation[] = locationRows.map(
  ([nameKo, nameEn, category], index) => ({
    id: `spyfall-location-${String(index + 1).padStart(2, "0")}`,
    nameKo,
    nameEn,
    category,
    active: true,
  }),
);

const questionRows: Array<[string, string]> = [
  ["여기 처음 와봤어요?", "Have you been here before?"],
  ["사람이 많은 편인가요?", "Is it usually crowded here?"],
  ["낮에 오는 게 좋아요, 밤에 오는 게 좋아요?", "Is it better to come during the day or at night?"],
  ["돈이 많이 드나요?", "Is it expensive to come here?"],
  ["혼자 오는 곳인가요?", "Do people usually come here alone?"],
  ["특별한 준비물이 필요한가요?", "Do you need to bring anything special?"],
  ["오래 머무는 곳인가요?", "Do people usually stay here for a long time?"],
  ["사진 찍기 좋은 곳인가요?", "Is this a good place to take pictures?"],
  ["여기에서 주로 무엇을 하나요?", "What do people usually do here?"],
  ["여기 올 때 특별한 옷을 입어야 하나요?", "Do you need to wear anything special here?"],
];

export const defaultSpyfallQuestions: SpyfallQuestion[] = questionRows.map(
  ([questionKo, questionEn], index) => ({
    id: `spyfall-question-${String(index + 1).padStart(2, "0")}`,
    questionKo,
    questionEn,
    active: true,
  }),
);

export function getDefaultSpyCount(playerCount: number) {
  return playerCount >= 7 ? 2 : 1;
}

export function resolveSpyfallWinner(spyCaught: boolean, spyGuessedLocation: boolean | null) {
  return spyCaught && spyGuessedLocation === false ? "citizens" : "spies";
}
