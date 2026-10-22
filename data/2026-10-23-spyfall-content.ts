import legacyCategoryData from "./2026-07-26-spyfall-categories.json";
import type {
  SpyfallAnswer,
  SpyfallCategory,
  SpyfallCategoryId,
  SpyfallDifficulty,
  SpyfallExampleQuestion,
} from "@/types/2026-07-26-spyfall";

type LegacyCategory = { id: string; title: string; titleKo: string; items: string[] };
type Pair = readonly [english: string, korean: string];

const difficultyFor = (index: number): SpyfallDifficulty =>
  index % 5 === 0 ? "advanced" : index % 2 === 0 ? "intermediate" : "beginner";

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const exactKorean = new Map<string, string>([
  ["Airport", "공항"], ["Cafe", "카페"], ["School", "학교"], ["Hospital", "병원"], ["Subway", "지하철"],
  ["Gym", "헬스장"], ["Amusement Park", "놀이공원"], ["Movie Theater", "영화관"], ["Convenience Store", "편의점"],
  ["Police Station", "경찰서"], ["Beach", "해변"], ["Campsite", "캠핑장"], ["Hotel", "호텔"], ["Library", "도서관"],
  ["Karaoke Room", "노래방"], ["Hair Salon", "미용실"], ["Department Store", "백화점"], ["Wedding Hall", "결혼식장"],
  ["Swimming Pool", "수영장"], ["Restaurant", "식당"], ["Zoo", "동물원"], ["Market", "시장"], ["Office", "사무실"],
  ["Soccer Stadium", "축구 경기장"], ["Concert Hall", "콘서트장"], ["Art Gallery", "미술관"], ["Museum", "박물관"],
  ["Sauna", "사우나"], ["Nightclub", "나이트클럽"], ["Casino", "카지노"], ["University", "대학교"], ["Bus Terminal", "버스 터미널"],
  ["Train Station", "기차역"], ["Pharmacy", "약국"], ["Bank", "은행"], ["Post Office", "우체국"], ["Park", "공원"],
  ["Bowling Alley", "볼링장"], ["PC Cafe", "PC방"], ["Theater", "극장"], ["Rooftop Bar", "루프탑 바"],
  ["Fast Food Restaurant", "패스트푸드점"], ["Ski Resort", "스키장"], ["Water Park", "워터파크"], ["Aquarium", "수족관"],
  ["Baseball Stadium", "야구장"], ["Basketball Court", "농구장"], ["Church", "교회"], ["Courthouse", "법원"], ["Bakery", "빵집"],
  ["Bookstore", "서점"], ["Fire Station", "소방서"], ["Dentist", "치과"], ["Veterinary Clinic", "동물병원"],
  ["Shopping Mall", "쇼핑몰"], ["Supermarket", "슈퍼마켓"], ["Gas Station", "주유소"], ["Car Wash", "세차장"],
  ["Parking Garage", "주차장"], ["Harbor", "항구"], ["Farm", "농장"], ["Factory", "공장"], ["Warehouse", "창고"],
  ["Construction Site", "건설 현장"], ["Playground", "놀이터"], ["Theme Park", "테마파크"], ["Botanical Garden", "식물원"],
  ["National Park", "국립공원"], ["Mountain Cabin", "산장"], ["Cruise Ship", "크루즈선"], ["Airplane", "비행기"],
  ["Train", "기차"], ["Bus", "버스"], ["Taxi", "택시"], ["Ferry", "여객선"], ["Space Station", "우주 정거장"],
  ["Laboratory", "연구실"], ["Recording Studio", "녹음실"], ["Newsroom", "뉴스룸"], ["Radio Station", "라디오 방송국"],
  ["TV Studio", "TV 스튜디오"], ["Dance Studio", "댄스 스튜디오"], ["Yoga Studio", "요가 스튜디오"], ["Spa", "스파"],
]);

const koreanLists: Partial<Record<SpyfallCategoryId, string[]>> = {
  countries: "대한민국|일본|중국|미국|캐나다|멕시코|브라질|아르헨티나|칠레|페루|영국|아일랜드|프랑스|독일|스페인|포르투갈|이탈리아|네덜란드|벨기에|스위스|오스트리아|덴마크|스웨덴|노르웨이|핀란드|아이슬란드|폴란드|체코|그리스|튀르키예|이집트|모로코|남아프리카공화국|케냐|나이지리아|가나|에티오피아|탄자니아|호주|뉴질랜드|인도|파키스탄|방글라데시|스리랑카|네팔|태국|베트남|필리핀|인도네시아|말레이시아|헝가리|루마니아|크로아티아|콜롬비아".split("|"),
  jobs: "교사|의사|간호사|경찰관|소방관|요리사|제빵사|조종사|승무원|엔지니어|소프트웨어 개발자|디자이너|건축가|변호사|판사|기자|사진작가|배우|가수|무용가|음악가|예술가|작가|번역가|여행 가이드|호텔 매니저|바리스타|웨이터|농부|수의사|치과의사|약사|과학자|우주비행사|정비사|전기기사|배관공|목수|미용사|피트니스 트레이너|프로 운동선수|코치|회계사|은행원|마케팅 매니저|영업사원|사업가|사회복지사|사서|배달 기사|응급구조사|상담사|연구원|접수원|통역사".split("|"),
  animals: "개|고양이|사자|호랑이|코끼리|기린|얼룩말|원숭이|고릴라|판다|코알라|캥거루|곰|늑대|여우|토끼|사슴|말|소|돼지|양|염소|닭|오리|독수리|부엉이|펭귄|홍학|앵무새|공작|돌고래|고래|상어|문어|해파리|바다거북|악어|뱀|도마뱀|개구리|나비|벌|개미|거미|전갈|햄스터|수달|너구리|고슴도치|나무늘보|미어캣|카멜레온|펠리컨|해마|불가사리|바닷가재|게|백조|매".split("|"),
  foods: "피자|햄버거|파스타|스테이크|치킨|타코|부리토|초밥|라면|카레|비빔밥|김치|떡볶이|삼겹살|쌀국수|팟타이|볶음밥|만두|훠궈|샌드위치|샐러드|수프|팬케이크|와플|프렌치토스트|오믈렛|크루아상|베이글|도넛|치즈케이크|아이스크림|초콜릿|쿠키|애플파이|브라우니|팝콘|감자튀김|나초|피시앤칩스|케밥|파에야|라자냐|리소토|치킨윙|해산물 모둠|구운 연어|과일 샐러드|요거트|시리얼|아보카도 토스트|짜장면|짬뽕|케이크|소주|칵테일|만두 한 개|팬케이크 한 장".split("|"),
  sports: "축구|농구|야구|배구|테니스|배드민턴|탁구|골프|수영|달리기|사이클|복싱|레슬링|유도|태권도|가라테|펜싱|양궁|체조|피겨스케이팅|스피드스케이팅|아이스하키|스키|스노보드|서핑|스케이트보드|암벽등반|등산|조정|요트|럭비|미식축구|크리켓|필드하키|핸드볼|스쿼시|볼링|당구|다트|역도|철인3종|마라톤|경마|자동차 경주|다이빙|수구|치어리딩|얼티밋 프리스비|라크로스|컬링|클라이밍|스케이팅".split("|"),
  space: "태양|수성|금성|지구|달|화성|목성|토성|천왕성|해왕성|명왕성|은하수|안드로메다은하|블랙홀|초신성|성운|혜성|소행성|유성|일식|월식|국제우주정거장|우주왕복선|로켓|인공위성|우주망원경|화성 탐사 로버|우주비행사|외계인|미확인 비행물체|별자리|북극성|북두칠성|오리온자리|중력|광년|궤도|대기|태양계|우주|빅뱅|암흑물질|외계행성|적색거성|백색왜성|은하단|우주유영|달 기지|화성 식민지|웜홀|소행성대|왜행성|우주 탐사선|발사대|관제 센터".split("|"),
  "school-subjects": "수학|영어|한국어|일본어|중국어|스페인어|프랑스어|독일어|역사|세계사|지리|경제|정치|법|윤리|철학|심리학|사회학|생물학|화학|물리학|지구과학|천문학|환경과학|컴퓨터과학|코딩|로봇공학|공학|통계학|회계학|경영학|마케팅|미술|음악|연극|무용|체육|보건|가정|목공|사진|미디어학|문예창작|대중연설|토론|문학|종교학|진로교육|디자인|건축|저널리즘".split("|"),
};

const categoryFallback: Record<string, string> = {
  places: "장소", movies: "영화", celebrities: "유명인", brands: "브랜드", history: "역사 주제",
};

const placeWords: Record<string, string> = {
  airport: "공항", apartment: "아파트", archaeological: "고고학", area: "구역", arena: "경기장", assembly: "조립", attic: "다락방",
  backstage: "무대 뒤", backyard: "뒷마당", balcony: "발코니", ballroom: "연회장", bamboo: "대나무", banquet: "연회", bar: "바",
  barbershop: "이발소", barn: "헛간", basement: "지하실", bathroom: "욕실", bedroom: "침실", booth: "부스", border: "국경",
  brewery: "양조장", bridge: "다리", building: "건물", cabin: "오두막", cafeteria: "식당", canal: "운하", cathedral: "대성당",
  cemetery: "묘지", center: "센터", chamber: "회의실", chapel: "예배당", check: "보관소", checkpoint: "검문소", city: "시청",
  clinic: "클리닉", closet: "옷장", club: "클럽", conservatory: "온실", counter: "카운터", courtroom: "법정", coworking: "공유 업무",
  crater: "분화구", crematorium: "화장장", cubicle: "칸막이 사무실", customs: "세관", daycare: "어린이집", deck: "갑판",
  depot: "차고지", desert: "사막", desk: "안내 데스크", dining: "식당", dock: "하역장", dormitory: "기숙사", dressing: "분장실",
  duty: "면세", elevator: "엘리베이터", embassy: "대사관", emergency: "응급실", employment: "고용", entrance: "입구", esports: "e스포츠",
  exhibition: "전시", exit: "출구", factory: "공장", farmhouse: "농가", farmers: "농산물", ferry: "여객선", film: "촬영장",
  fire: "소방", fishing: "낚시", flea: "벼룩", flower: "꽃", food: "음식", forest: "숲", fortress: "요새", funeral: "장례식장",
  furniture: "가구", gaming: "게임", garage: "차고", garden: "정원", glacier: "빙하", glamping: "글램핑", government: "정부",
  greenhouse: "온실", guesthouse: "게스트하우스", hallway: "복도", harbor: "항구", hardware: "철물", highway: "고속도로", home: "집",
  honeymoon: "신혼여행", hostel: "호스텔", hotel: "호텔", house: "집", immigration: "출입국", intensive: "중환자", internet: "인터넷",
  island: "섬", jewelry: "보석", kitchen: "주방", lakeside: "호숫가", language: "어학원", laundromat: "빨래방", lecture: "강의실",
  lighthouse: "등대", line: "라인", living: "거실", lobby: "로비", lodge: "산장", lounge: "라운지", makeup: "분장실",
  marina: "마리나", market: "시장", maternity: "산부인과", meditation: "명상", meeting: "회의실", military: "군사", monastery: "수도원",
  monument: "기념비", mosque: "모스크", motel: "모텔", mountain: "산", museum: "박물관", nursery: "아기방", observatory: "전망대",
  office: "사무실", opera: "오페라", operating: "수술실", orchard: "과수원", orphanage: "고아원", outlet: "아울렛", palace: "궁전",
  pantry: "식료품 저장실", parliament: "국회의사당", passport: "여권", patio: "테라스", pawnshop: "전당포", pedestrian: "보행자",
  penthouse: "펜트하우스", pharmacy: "약국", photography: "사진", pier: "부두", planetarium: "천문관", platform: "승강장", polling: "투표소",
  porch: "현관", prison: "교도소", promenade: "산책로", public: "공중", rainforest: "열대우림", reception: "접수처", recording: "녹음",
  reef: "산호초", rehabilitation: "재활", rehearsal: "연습실", repair: "정비", reserve: "보호구역", resort: "리조트", restroom: "화장실",
  river: "강", riverside: "강변", room: "방", rooftop: "옥상", royal: "왕실", runway: "활주로", sanctuary: "보호구역", scenic: "경치 좋은",
  school: "학교", science: "과학", security: "보안실", senior: "노인", shelter: "보호소", shipyard: "조선소", shop: "가게",
  shopping: "쇼핑", shrine: "신사", site: "유적지", smoking: "흡연", souvenir: "기념품", station: "역", stall: "노점", stairwell: "계단",
  stop: "정류장", storage: "창고", store: "가게", street: "거리", studio: "스튜디오", summit: "정상", synagogue: "유대교 회당",
  tax: "세무서", teachers: "교무실", temple: "사원", terminal: "터미널", theater: "극장", thrift: "중고", ticket: "매표소",
  tollgate: "톨게이트", tower: "관제탑", town: "광장", trail: "등산로", travel: "여행", treehouse: "트리하우스", tunnel: "터널",
  tutoring: "학원", united: "유엔", university: "대학교", veterinary: "동물병원", vineyard: "포도밭", vip: "VIP", volcanic: "화산",
  waiting: "대기실", warehouse: "창고", waterfall: "폭포", welfare: "복지", wildlife: "야생동물", winery: "와이너리", yard: "마당",
};

function translatePlace(english: string) {
  const translated = english.split(/\s+/).map((word) => placeWords[word.toLowerCase().replace(/[^a-z]/g, "")] ?? word);
  return translated.join(" ");
}

function legacyKorean(category: LegacyCategory, english: string, index: number) {
  const direct = exactKorean.get(english);
  if (direct) return direct;
  const listed = koreanLists[category.id as SpyfallCategoryId]?.[index];
  if (listed) return listed;
  if (category.id === "places") {
    const translated = translatePlace(english);
    return /[가-힣]/.test(translated) ? translated : `장소 · ${translated}`;
  }
  // Movie titles, celebrity names, and brand names are commonly identified by their original names.
  if (category.id === "movies") return `영화 제목 · ${english}`;
  if (category.id === "celebrities") return `유명인 · ${english}`;
  if (category.id === "brands") return `브랜드 · ${english}`;
  return `${categoryFallback[category.id] ?? category.titleKo} · ${english}`;
}

function answersFromPairs(categoryId: SpyfallCategoryId, pairs: readonly Pair[]): SpyfallAnswer[] {
  return pairs.map(([english, korean], index) => ({
    id: `${categoryId}-${slug(english)}-${String(index + 1).padStart(3, "0")}`,
    english,
    korean,
    category: categoryId,
    difficulty: difficultyFor(index),
  }));
}

function expandPairs(bases: readonly Pair[], variants: readonly Pair[]): Pair[] {
  return bases.flatMap(([english, korean]) => variants.map(([suffixEn, suffixKo]) => [
    suffixEn ? `${english} ${suffixEn}` : english,
    suffixKo ? `${korean} ${suffixKo}` : korean,
  ] as const));
}

const relationshipBases: Pair[] = [
  ["Blind Date", "소개팅"], ["First Date", "첫 데이트"], ["Breakup", "이별"], ["Marriage", "결혼"],
  ["Secret Crush", "짝사랑"], ["Jealousy", "질투"], ["Flirting", "플러팅"], ["Love Confession", "사랑 고백"],
  ["Anniversary", "기념일"], ["Long-Distance Relationship", "장거리 연애"], ["Couple Argument", "커플 싸움"],
  ["Meeting the Parents", "부모님께 인사하기"], ["Wedding Proposal", "청혼"], ["Online Dating", "온라인 데이팅"],
  ["Getting Back Together", "재결합"], ["Friendship", "우정"], ["Roommate Conflict", "룸메이트 갈등"],
  ["Office Romance", "사내 연애"], ["Double Date", "더블 데이트"], ["Wedding Ceremony", "결혼식"],
];
const relationshipVariants: Pair[] = [["", ""], ["Conversation", "대화"], ["Plan", "계획"], ["Story", "이야기"], ["Advice", "조언"]];

const funnyBases: Pair[] = [
  ["Missing the Last Train", "막차 놓치기"], ["Falling Asleep", "졸다가 잠들기"], ["Sending a Message to the Wrong Person", "메시지 잘못 보내기"],
  ["Forgetting Someone's Name", "이름 까먹기"], ["Getting Caught Lying", "거짓말하다 들키기"], ["Losing Your Wallet", "지갑 잃어버리기"],
  ["Awkward Silence", "어색한 침묵"], ["Getting Lost", "길 잃기"], ["Being Late", "지각하기"], ["Calling Your Ex by Accident", "전 애인에게 실수로 전화하기"],
  ["Tripping in Public", "사람들 앞에서 넘어지기"], ["Wearing Clothes Inside Out", "옷을 뒤집어 입기"], ["Forgetting Your Lines", "대사 잊어버리기"],
  ["Laughing at the Wrong Time", "엉뚱한 순간에 웃기"], ["Singing Off-Key", "음치로 노래하기"], ["Breaking Something", "물건 깨뜨리기"],
  ["Walking into the Wrong Room", "방을 잘못 들어가기"], ["Mistaking a Stranger for a Friend", "낯선 사람을 친구로 착각하기"],
  ["Food Stuck in Your Teeth", "이에 음식 끼기"], ["Phone Ringing at a Quiet Moment", "조용한 순간에 휴대폰 울리기"],
];
const funnyVariants: Pair[] = [["", ""], ["at School", "학교에서"], ["at Work", "직장에서"], ["on a Date", "데이트 중"], ["While Traveling", "여행 중"]];

const hobbyBases: Pair[] = [
  ["Camping", "캠핑"], ["Hiking", "등산"], ["Bowling", "볼링"], ["Karaoke", "노래방"], ["Gaming", "게임"],
  ["Swimming", "수영"], ["Dancing", "춤추기"], ["Photography", "사진 촬영"], ["Cooking", "요리"], ["Traveling", "여행"],
  ["Yoga", "요가"], ["Fishing", "낚시"], ["Cycling", "자전거 타기"], ["Running", "달리기"], ["Painting", "그림 그리기"],
  ["Reading", "독서"], ["Gardening", "정원 가꾸기"], ["Baking", "베이킹"], ["Surfing", "서핑"], ["Pottery", "도예"],
];
const hobbyVariants: Pair[] = [["", ""], ["Class", "수업"], ["Club", "동호회"], ["Competition", "대회"], ["Weekend Session", "주말 모임"]];

const entertainmentBases: Pair[] = [
  ["Horror Movie", "공포 영화"], ["Romantic Comedy", "로맨틱 코미디"], ["Action Movie", "액션 영화"], ["Reality Show", "리얼리티 쇼"],
  ["K-pop Concert", "케이팝 콘서트"], ["Netflix Series", "넷플릭스 시리즈"], ["Music Festival", "음악 축제"], ["Talent Show", "장기자랑"],
  ["Animation", "애니메이션"], ["Musical", "뮤지컬"], ["Comedy Show", "코미디 쇼"], ["Documentary", "다큐멘터리"],
  ["Award Show", "시상식"], ["Fan Meeting", "팬 미팅"], ["Movie Premiere", "영화 시사회"], ["Talk Show", "토크 쇼"],
  ["Live Stream", "라이브 방송"], ["Web Drama", "웹드라마"], ["Street Performance", "거리 공연"], ["Magic Show", "마술 쇼"],
];
const entertainmentVariants: Pair[] = [["", ""], ["Night", "나이트"], ["Party", "파티"], ["Marathon", "몰아보기"], ["Fan Event", "팬 행사"]];

const commonQuestionTemplates: Pair[] = [
  ["Have you experienced this before?", "이것을 경험해 본 적 있나요?"],
  ["Would you recommend it to a friend?", "친구에게 추천하고 싶나요?"],
  ["Is it popular with young people?", "젊은 사람들에게 인기가 많나요?"],
  ["Would you usually do this alone?", "보통 혼자 하는 편인가요?"],
  ["Does it usually cost a lot?", "보통 비용이 많이 드나요?"],
  ["Is special preparation needed?", "특별한 준비가 필요한가요?"],
  ["Is it more common on weekends?", "주말에 더 흔한가요?"],
  ["Could it make someone nervous?", "이것 때문에 긴장할 수 있나요?"],
  ["Would people take photos of it?", "사람들이 사진을 찍을 만한가요?"],
  ["Is it usually planned in advance?", "보통 미리 계획하나요?"],
  ["Can it happen unexpectedly?", "예상하지 못하게 생길 수 있나요?"],
  ["Would you talk about it afterward?", "나중에 이것에 관해 이야기할 것 같나요?"],
  ["Is it suitable for beginners?", "초보자에게도 적합한가요?"],
  ["Does age matter for this?", "이것에는 나이가 중요한가요?"],
  ["Would the weather affect it?", "날씨의 영향을 받나요?"],
  ["Is it usually indoors?", "보통 실내에서 하나요?"],
  ["Do people need special clothing?", "특별한 옷이 필요한가요?"],
  ["Could it be embarrassing?", "창피한 상황이 될 수 있나요?"],
  ["Is it common in Korea?", "한국에서도 흔한가요?"],
  ["Would you enjoy doing it again?", "다시 해도 즐거울 것 같나요?"],
  ["Does it involve many people?", "여러 사람이 함께하나요?"],
  ["Can it last more than an hour?", "한 시간 넘게 이어질 수 있나요?"],
  ["Would children enjoy it?", "아이들도 좋아할 만한가요?"],
  ["Is it easy to explain to someone?", "다른 사람에게 쉽게 설명할 수 있나요?"],
  ["Would it make a good gift?", "선물로도 괜찮을까요?"],
  ["Can you find it in most cities?", "대부분의 도시에서 찾을 수 있나요?"],
  ["Does it require practice?", "연습이 필요한가요?"],
  ["Would you choose it for a special day?", "특별한 날에 선택할 만한가요?"],
  ["Is it better with friends?", "친구들과 함께하면 더 좋은가요?"],
  ["Can it create a strong memory?", "강한 추억으로 남을 수 있나요?"],
];

const categoryQuestionSeeds: Record<SpyfallCategoryId, Pair[]> = {
  places: [["Do you visit this place often?", "이 장소에 자주 가나요?"], ["Is it usually crowded?", "보통 사람이 많나요?"], ["Would you go there alone?", "혼자 가기도 하나요?"], ["Do people spend money there?", "그곳에서 돈을 쓰나요?"], ["Is it usually indoors or outdoors?", "보통 실내인가요, 실외인가요?"]],
  countries: [["Have you ever visited this country?", "이 나라에 가본 적 있나요?"], ["Is the food famous?", "음식이 유명한가요?"], ["Is it expensive to travel there?", "여행 비용이 비싼가요?"], ["Would you like to live there?", "그 나라에 살고 싶나요?"], ["Is the weather usually warm?", "보통 날씨가 따뜻한가요?"]],
  jobs: [["Does this job require special training?", "이 직업은 전문 교육이 필요한가요?"], ["Do people wear a uniform?", "유니폼을 입나요?"], ["Is the work stressful?", "업무 스트레스가 큰가요?"], ["Do they work with many people?", "많은 사람과 일하나요?"], ["Would you choose this career?", "이 직업을 선택하고 싶나요?"]],
  movies: [["Would you watch this more than once?", "이 영화를 여러 번 볼 것 같나요?"], ["Is it suitable for children?", "아이들이 보기에도 괜찮나요?"], ["Is the soundtrack memorable?", "음악이 기억에 남나요?"], ["Would you watch it in a theater?", "영화관에서 보고 싶나요?"], ["Does it have a happy ending?", "결말이 행복한가요?"]],
  animals: [["Could this animal live near people?", "이 동물은 사람 가까이 살 수 있나요?"], ["Is it dangerous?", "위험한 동물인가요?"], ["Can it swim?", "수영할 수 있나요?"], ["Would you see it in a zoo?", "동물원에서 볼 수 있나요?"], ["Is it active at night?", "밤에 활동하나요?"]],
  foods: [["Would you eat this for breakfast?", "아침으로 먹을 만한가요?"], ["Is it usually spicy?", "보통 매운 음식인가요?"], ["Can you cook it at home?", "집에서 만들 수 있나요?"], ["Is it eaten with your hands?", "손으로 먹는 음식인가요?"], ["Would you order it for delivery?", "배달로 주문할 만한가요?"]],
  sports: [["Do you need a team?", "팀이 필요한 운동인가요?"], ["Is special equipment required?", "특별한 장비가 필요한가요?"], ["Can people play it indoors?", "실내에서도 할 수 있나요?"], ["Is it in the Olympics?", "올림픽 종목인가요?"], ["Is it physically demanding?", "체력 소모가 큰가요?"]],
  celebrities: [["Is this person known worldwide?", "이 사람은 세계적으로 유명한가요?"], ["Are they active on social media?", "SNS 활동을 많이 하나요?"], ["Have they won major awards?", "큰 상을 받은 적이 있나요?"], ["Would young people recognize them?", "젊은 세대도 알아볼까요?"], ["Are they mainly known for entertainment?", "주로 연예 활동으로 유명한가요?"]],
  brands: [["Is this brand expensive?", "이 브랜드는 비싼 편인가요?"], ["Do you own something from this brand?", "이 브랜드 제품을 가지고 있나요?"], ["Is it available worldwide?", "전 세계에서 살 수 있나요?"], ["Is its logo easy to recognize?", "로고를 쉽게 알아볼 수 있나요?"], ["Would you recommend its products?", "이 브랜드 제품을 추천하나요?"]],
  history: [["Did this happen more than a century ago?", "100년도 더 전에 일어난 일인가요?"], ["Did it change the world?", "세상을 바꾼 사건인가요?"], ["Is it taught in school?", "학교에서 배우나요?"], ["Are famous leaders connected to it?", "유명 지도자와 관련 있나요?"], ["Can people visit related sites today?", "오늘날 관련 장소를 방문할 수 있나요?"]],
  space: [["Can it be seen without a telescope?", "망원경 없이 볼 수 있나요?"], ["Is it inside our solar system?", "태양계 안에 있나요?"], ["Could humans travel there?", "인간이 그곳에 갈 수 있나요?"], ["Is it larger than Earth?", "지구보다 큰가요?"], ["Does it produce light?", "스스로 빛을 내나요?"]],
  "school-subjects": [["Did you study this at school?", "학교에서 이 과목을 배웠나요?"], ["Does it involve a lot of writing?", "글을 많이 써야 하나요?"], ["Is it useful in daily life?", "일상생활에 유용한가요?"], ["Does it require calculations?", "계산이 필요한가요?"], ["Would you choose it as a major?", "전공으로 선택하고 싶나요?"]],
  "dating-relationships": [["Is this usually a good experience?", "보통 좋은 경험인가요?"], ["Have you experienced this before?", "경험해 본 적 있나요?"], ["Would you talk about this with your friends?", "친구들과 이것에 대해 이야기하나요?"], ["Can this make someone nervous?", "이것 때문에 긴장할 수 있나요?"], ["Does this happen often in relationships?", "연애할 때 자주 일어나나요?"]],
  "funny-situations": [["Has this ever happened to you?", "이런 일을 겪어본 적 있나요?"], ["Would you feel embarrassed?", "창피할 것 같나요?"], ["Would your friends laugh?", "친구들이 웃을 것 같나요?"], ["Is this something you can avoid?", "피할 수 있는 상황인가요?"], ["Would you tell someone about it?", "다른 사람에게 이야기할 것 같나요?"]],
  "hobbies-activities": [["Do you need special equipment?", "특별한 장비가 필요한가요?"], ["Can you do this alone?", "혼자 할 수 있나요?"], ["Is it expensive?", "비용이 많이 드나요?"], ["Is it physically tiring?", "체력적으로 힘든가요?"], ["Would you recommend it to beginners?", "초보자에게 추천하나요?"]],
  "movies-entertainment": [["Is this popular among young people?", "젊은 사람들에게 인기가 많나요?"], ["Can you enjoy this at home?", "집에서도 즐길 수 있나요?"], ["Would you do this with friends?", "친구들과 함께 하나요?"], ["Does it usually cost money?", "보통 돈이 드나요?"], ["Is this something you enjoy often?", "자주 즐기는 편인가요?"]],
};

function questionsFor(categoryId: SpyfallCategoryId): SpyfallExampleQuestion[] {
  const pairs = [...categoryQuestionSeeds[categoryId], ...commonQuestionTemplates.slice(0, 25)];
  return pairs.map(([english, korean], index) => ({
    id: `${categoryId}-question-${String(index + 1).padStart(2, "0")}`,
    english,
    korean,
  }));
}

const legacyCategories = (legacyCategoryData as LegacyCategory[]).map((category): SpyfallCategory => ({
  id: category.id as SpyfallCategoryId,
  title: category.title,
  titleKo: category.titleKo,
  items: category.items.map((english, index) => ({
    id: `${category.id}-${slug(english)}-${String(index + 1).padStart(3, "0")}`,
    english,
    korean: legacyKorean(category, english, index),
    category: category.id as SpyfallCategoryId,
    difficulty: difficultyFor(index),
  })),
  questions: questionsFor(category.id as SpyfallCategoryId),
}));

const addedCategories: SpyfallCategory[] = [
  { id: "dating-relationships", title: "Dating & Relationships ❤️", titleKo: "연애와 인간관계", items: answersFromPairs("dating-relationships", expandPairs(relationshipBases, relationshipVariants)), questions: questionsFor("dating-relationships") },
  { id: "funny-situations", title: "Funny Situations 😂", titleKo: "재미있는 상황", items: answersFromPairs("funny-situations", expandPairs(funnyBases, funnyVariants)), questions: questionsFor("funny-situations") },
  { id: "hobbies-activities", title: "Hobbies & Activities 🎯", titleKo: "취미와 활동", items: answersFromPairs("hobbies-activities", expandPairs(hobbyBases, hobbyVariants)), questions: questionsFor("hobbies-activities") },
  { id: "movies-entertainment", title: "Movies & Entertainment 🎬", titleKo: "영화와 엔터테인먼트", items: answersFromPairs("movies-entertainment", expandPairs(entertainmentBases, entertainmentVariants)), questions: questionsFor("movies-entertainment") },
];

export const spyfallContent: SpyfallCategory[] = [...legacyCategories, ...addedCategories];

