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
  sports: "축구|농구|야구|배구|테니스|배드민턴|탁구|골프|수영|달리기|사이클|복싱|레슬링|유도|태권도|가라테|펜싱|양궁|체조|피겨스케이팅|스피드스케이팅|아이스하키|스키|스노보드|서핑|스케이트보드|암벽등반|등산|조정|요트|럭비|미식축구|크리켓|필드하키|핸드볼|스쿼시|볼링|당구|다트|역도|철인3종|마라톤|경마|자동차 경주|다이빙|수구|치어리딩|얼티밋 프리스비|라크로스|컬링|클라이밍|스케이팅".split("|"),
  space: "태양|수성|금성|지구|달|화성|목성|토성|천왕성|해왕성|명왕성|은하수|안드로메다은하|블랙홀|초신성|성운|혜성|소행성|유성|일식|월식|국제우주정거장|우주왕복선|로켓|인공위성|우주망원경|화성 탐사 로버|우주비행사|외계인|미확인 비행물체|별자리|북극성|북두칠성|오리온자리|중력|광년|궤도|대기|태양계|우주|빅뱅|암흑물질|외계행성|적색거성|백색왜성|은하단|우주유영|달 기지|화성 식민지|웜홀|소행성대|왜행성|우주 탐사선|발사대|관제 센터".split("|"),
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

function uniqueAnswers(items: SpyfallAnswer[]) {
  return [...new Map(items.map((item) => [item.english.trim().toLocaleLowerCase(), item])).values()];
}

const extraAnswers: Partial<Record<SpyfallCategoryId, Pair[]>> = {
  places: [
    ["Escape Room", "방 탈출 카페"], ["Cat Cafe", "고양이 카페"], ["Dog Cafe", "강아지 카페"], ["Comic Book Cafe", "만화 카페"],
    ["Board Game Cafe", "보드게임 카페"], ["Silent Disco", "사일런트 디스코"], ["Haunted House", "유령의 집"], ["Secret Bar", "비밀 바"],
    ["Food Truck Festival", "푸드트럭 축제"], ["Night Market", "야시장"], ["Drive-in Theater", "자동차 극장"], ["VR Arcade", "VR 게임장"],
    ["Photo Booth", "셀프 사진관"], ["Fortune Teller's Shop", "점집"], ["Tattoo Studio", "타투숍"], ["Pet Hotel", "반려동물 호텔"],
    ["Cooking Studio", "요리 스튜디오"], ["Indoor Skydiving Center", "실내 스카이다이빙장"], ["Trampoline Park", "트램펄린 파크"], ["Ice Hotel", "얼음 호텔"],
    ["Capsule Hotel", "캡슐 호텔"], ["Treehouse Hotel", "트리하우스 호텔"], ["Floating Restaurant", "수상 레스토랑"], ["Underground Mall", "지하상가"],
    ["Observatory Deck", "전망대"], ["Aquarium Tunnel", "수족관 터널"], ["Chocolate Factory", "초콜릿 공장"], ["Movie Set", "영화 촬영장"],
    ["Backstage Dressing Room", "무대 뒤 분장실"], ["Celebrity Waiting Room", "연예인 대기실"], ["Airport Lost and Found", "공항 분실물 센터"], ["Police Interrogation Room", "경찰 조사실"],
    ["Luxury Yacht", "호화 요트"], ["Desert Camp", "사막 캠프"], ["Jungle Lodge", "정글 롯지"], ["Volcano Observatory", "화산 관측소"],
    ["Robot Cafe", "로봇 카페"], ["Zero-Waste Store", "제로 웨이스트 상점"], ["Wedding Photo Studio", "웨딩 촬영 스튜디오"], ["Tiny House", "초소형 주택"],
  ],
  jobs: [
    ["Detective", "탐정"], ["Private Investigator", "사설 조사관"], ["Magician", "마술사"], ["Stunt Performer", "스턴트 배우"],
    ["Voice Actor", "성우"], ["Game Streamer", "게임 스트리머"], ["Content Creator", "콘텐츠 크리에이터"], ["Podcast Host", "팟캐스트 진행자"],
    ["Drone Pilot", "드론 조종사"], ["Professional Gamer", "프로게이머"], ["Theme Park Designer", "테마파크 디자이너"], ["Toy Designer", "장난감 디자이너"],
    ["Chocolate Taster", "초콜릿 테이스터"], ["Food Stylist", "푸드 스타일리스트"], ["Mystery Shopper", "미스터리 쇼퍼"], ["Pet Sitter", "펫시터"],
    ["Dog Trainer", "반려견 훈련사"], ["Zookeeper", "사육사"], ["Wildlife Photographer", "야생동물 사진작가"], ["Storm Chaser", "폭풍 추적가"],
    ["Treasure Hunter", "보물 사냥꾼"], ["Archaeologist", "고고학자"], ["Volcanologist", "화산학자"], ["Marine Biologist", "해양생물학자"],
    ["Crime Scene Investigator", "과학수사관"], ["Forensic Scientist", "법의학자"], ["Cybersecurity Expert", "사이버 보안 전문가"], ["Ethical Hacker", "화이트 해커"],
    ["Robotics Engineer", "로봇공학자"], ["AI Researcher", "AI 연구원"], ["Space Tour Guide", "우주여행 가이드"], ["Astronaut Trainer", "우주비행사 훈련관"],
    ["Movie Director", "영화감독"], ["Casting Director", "캐스팅 디렉터"], ["Special Effects Artist", "특수효과 아티스트"], ["Foley Artist", "음향효과 아티스트"],
    ["Fashion Stylist", "패션 스타일리스트"], ["Perfumer", "조향사"], ["Wedding Planner", "웨딩 플래너"], ["Party Planner", "파티 플래너"],
    ["Professional Organizer", "정리 전문가"], ["Sleep Coach", "수면 코치"], ["Life Coach", "라이프 코치"], ["Dating Coach", "연애 코치"],
    ["Sommelier", "소믈리에"], ["Tea Master", "티 마스터"], ["Brewmaster", "양조 전문가"], ["Ice Cream Maker", "아이스크림 제조사"],
    ["Roller Coaster Tester", "롤러코스터 테스터"], ["Water Slide Tester", "워터슬라이드 테스터"], ["Professional Cuddler", "전문 포옹가"], ["Fortune Cookie Writer", "포춘쿠키 문구 작가"],
    ["Island Caretaker", "섬 관리인"], ["Luxury Travel Reviewer", "럭셔리 여행 리뷰어"], ["Meme Creator", "밈 크리에이터"], ["Escape Room Designer", "방 탈출 디자이너"],
  ],
  countries: [["Singapore", "싱가포르"], ["Mongolia", "몽골"], ["Cambodia", "캄보디아"], ["Laos", "라오스"], ["United Arab Emirates", "아랍에미리트"], ["Saudi Arabia", "사우디아라비아"], ["Israel", "이스라엘"], ["Jordan", "요르단"], ["Cuba", "쿠바"], ["Costa Rica", "코스타리카"]],
  movies: [["Parasite", "기생충"], ["Interstellar", "인터스텔라"], ["The Truman Show", "트루먼 쇼"], ["La La Land", "라라랜드"], ["The Grand Budapest Hotel", "그랜드 부다페스트 호텔"], ["Everything Everywhere All at Once", "에브리씽 에브리웨어 올 앳 원스"], ["The Devil Wears Prada", "악마는 프라다를 입는다"], ["Knives Out", "나이브스 아웃"], ["Inside Out", "인사이드 아웃"], ["Coco", "코코"]],
  sports: [["Pickleball", "피클볼"], ["Padel", "파델"], ["Breakdancing", "브레이킹"], ["Parkour", "파쿠르"], ["Drone Racing", "드론 레이싱"], ["E-sports", "e스포츠"], ["Sepak Takraw", "세팍타크로"], ["Bouldering", "볼더링"], ["Freediving", "프리다이빙"], ["Snowkiting", "스노카이팅"]],
  celebrities: [["Bong Joon-ho", "봉준호"], ["Son Heung-min", "손흥민"], ["IU", "아이유"], ["BTS", "방탄소년단"], ["Taylor Swift", "테일러 스위프트"], ["Zendaya", "젠데이아"], ["Ryan Reynolds", "라이언 레이놀즈"], ["Emma Stone", "엠마 스톤"], ["Gordon Ramsay", "고든 램지"], ["MrBeast", "미스터비스트"]],
  brands: [["Netflix", "넷플릭스"], ["Spotify", "스포티파이"], ["Airbnb", "에어비앤비"], ["LEGO", "레고"], ["Nintendo", "닌텐도"], ["Dyson", "다이슨"], ["Patagonia", "파타고니아"], ["Red Bull", "레드불"], ["Kakao", "카카오"], ["Naver", "네이버"]],
  history: [["The Moon Landing", "달 착륙"], ["The Renaissance", "르네상스"], ["The Industrial Revolution", "산업혁명"], ["The Fall of the Berlin Wall", "베를린 장벽 붕괴"], ["The Invention of the Internet", "인터넷의 발명"], ["The Gold Rush", "골드러시"], ["The Silk Road", "실크로드"], ["The Titanic Disaster", "타이타닉 침몰"], ["The Printing Press", "인쇄술의 발명"], ["The First Olympic Games", "최초의 올림픽"]],
  space: [["James Webb Space Telescope", "제임스 웹 우주망원경"], ["Saturn's Rings", "토성의 고리"], ["The Dark Side of the Moon", "달의 뒷면"], ["Mars Helicopter", "화성 헬리콥터"], ["Space Tourism", "우주 관광"], ["Lunar Eclipse", "월식"], ["Solar Flare", "태양 플레어"], ["Neutron Star", "중성자별"], ["Galaxy Collision", "은하 충돌"], ["Alien Signal", "외계 신호"]],
};

const transportationAnswers: Pair[] = [
  ["City Bus", "시내버스"], ["Express Bus", "고속버스"], ["School Bus", "통학버스"], ["Double-Decker Bus", "2층 버스"], ["Party Bus", "파티 버스"],
  ["Subway", "지하철"], ["Bullet Train", "고속열차"], ["Night Train", "야간열차"], ["Sleeper Train", "침대열차"], ["Monorail", "모노레일"],
  ["Taxi", "택시"], ["Limousine", "리무진"], ["Rental Car", "렌터카"], ["Convertible", "오픈카"], ["Sports Car", "스포츠카"],
  ["Ambulance", "구급차"], ["Fire Engine", "소방차"], ["Police Car", "경찰차"], ["Garbage Truck", "쓰레기 수거차"], ["Food Truck", "푸드트럭"],
  ["Motorcycle", "오토바이"], ["Electric Scooter", "전동 킥보드"], ["Bicycle", "자전거"], ["Tandem Bicycle", "2인용 자전거"], ["Skateboard", "스케이트보드"],
  ["Airplane", "비행기"], ["Private Jet", "전용기"], ["Helicopter", "헬리콥터"], ["Hot-Air Balloon", "열기구"], ["Hang Glider", "행글라이더"],
  ["Ferry", "여객선"], ["Cruise Ship", "크루즈선"], ["Speedboat", "쾌속정"], ["Sailboat", "요트"], ["Submarine", "잠수함"],
  ["Cable Car", "케이블카"], ["Gondola", "곤돌라"], ["Rickshaw", "인력거"], ["Tuk-Tuk", "툭툭"], ["Horse-Drawn Carriage", "마차"],
  ["Snowmobile", "스노모빌"], ["Jet Ski", "제트스키"], ["Hovercraft", "호버크래프트"], ["Segway", "세그웨이"], ["Camper Van", "캠핑카"],
  ["Monster Truck", "몬스터 트럭"], ["Forklift", "지게차"], ["Bulldozer", "불도저"], ["Tractor", "트랙터"], ["Golf Cart", "골프 카트"],
  ["Rocket", "로켓"], ["Space Shuttle", "우주왕복선"], ["Mars Rover", "화성 탐사 로버"], ["Drone Taxi", "드론 택시"], ["Self-Driving Car", "자율주행차"],
];

const everydayObjectAnswers: Pair[] = [
  ["Toothbrush", "칫솔"], ["Umbrella", "우산"], ["Wallet", "지갑"], ["Keychain", "열쇠고리"], ["Water Bottle", "물병"],
  ["Phone Charger", "휴대폰 충전기"], ["Earbuds", "무선 이어폰"], ["Power Bank", "보조 배터리"], ["Remote Control", "리모컨"], ["Alarm Clock", "알람시계"],
  ["Hair Dryer", "헤어드라이어"], ["Electric Shaver", "전기면도기"], ["Makeup Mirror", "화장 거울"], ["Nail Clippers", "손톱깎이"], ["Comb", "빗"],
  ["Coffee Mug", "커피 머그잔"], ["Frying Pan", "프라이팬"], ["Rice Cooker", "전기밥솥"], ["Bottle Opener", "병따개"], ["Lunch Box", "도시락통"],
  ["Backpack", "백팩"], ["Suitcase", "여행 가방"], ["Sunglasses", "선글라스"], ["Baseball Cap", "야구 모자"], ["Wristwatch", "손목시계"],
  ["Notebook", "공책"], ["Sticky Notes", "포스트잇"], ["Highlighter", "형광펜"], ["Stapler", "스테이플러"], ["Scissors", "가위"],
  ["Flashlight", "손전등"], ["Measuring Tape", "줄자"], ["Screwdriver", "드라이버"], ["Padlock", "자물쇠"], ["Extension Cord", "멀티탭"],
  ["Vacuum Cleaner", "진공청소기"], ["Laundry Basket", "빨래 바구니"], ["Clothes Hanger", "옷걸이"], ["Iron", "다리미"], ["Doormat", "현관 매트"],
  ["Tissue Box", "휴지 상자"], ["Bandage", "반창고"], ["Hand Sanitizer", "손 소독제"], ["Face Mask", "마스크"], ["Thermometer", "체온계"],
  ["Selfie Stick", "셀카봉"], ["Tripod", "삼각대"], ["Bluetooth Speaker", "블루투스 스피커"], ["Smartwatch", "스마트워치"], ["Tablet", "태블릿"],
  ["Rubber Duck", "고무 오리"], ["Snow Globe", "스노글로브"], ["Piggy Bank", "돼지 저금통"], ["Board Game", "보드게임"], ["Deck of Cards", "트럼프 카드"],
];

const landmarkAnswers: Pair[] = [
  ["Eiffel Tower", "에펠탑"], ["Statue of Liberty", "자유의 여신상"], ["Great Wall of China", "만리장성"], ["Taj Mahal", "타지마할"], ["Sydney Opera House", "시드니 오페라 하우스"],
  ["Colosseum", "콜로세움"], ["Big Ben", "빅벤"], ["Machu Picchu", "마추픽추"], ["Christ the Redeemer", "구세주 그리스도상"], ["Burj Khalifa", "부르즈 할리파"],
  ["Sagrada Familia", "사그라다 파밀리아"], ["Leaning Tower of Pisa", "피사의 사탑"], ["Golden Gate Bridge", "금문교"], ["Mount Fuji", "후지산"], ["Angkor Wat", "앙코르와트"],
  ["Pyramids of Giza", "기자의 피라미드"], ["Petra", "페트라"], ["Niagara Falls", "나이아가라 폭포"], ["Grand Canyon", "그랜드 캐니언"], ["Stonehenge", "스톤헨지"],
  ["Louvre Museum", "루브르 박물관"], ["Times Square", "타임스스퀘어"], ["Hollywood Sign", "할리우드 사인"], ["Mount Rushmore", "러시모어산"], ["Las Vegas Strip", "라스베이거스 스트립"],
  ["Brandenburg Gate", "브란덴부르크 문"], ["Arc de Triomphe", "개선문"], ["Neuschwanstein Castle", "노이슈반슈타인성"], ["Acropolis", "아크로폴리스"], ["Pompeii", "폼페이"],
  ["Santorini", "산토리니"], ["Blue Mosque", "블루 모스크"], ["Hagia Sophia", "아야 소피아"], ["The Kremlin", "크렘린궁"], ["Prague Castle", "프라하성"],
  ["CN Tower", "CN 타워"], ["Chichen Itza", "치첸이트사"], ["Moai Statues", "모아이 석상"], ["Salar de Uyuni", "우유니 소금사막"], ["Panama Canal", "파나마 운하"],
  ["Marina Bay Sands", "마리나 베이 샌즈"], ["Petronas Towers", "페트로나스 트윈 타워"], ["Gardens by the Bay", "가든스 바이 더 베이"], ["Ha Long Bay", "하롱베이"], ["Banaue Rice Terraces", "바나우에 계단식 논"],
  ["Gyeongbokgung Palace", "경복궁"], ["N Seoul Tower", "남산서울타워"], ["Lotte World Tower", "롯데월드타워"], ["Jeju Seongsan Ilchulbong", "제주 성산일출봉"], ["Busan Gwangan Bridge", "부산 광안대교"],
  ["Fushimi Inari Shrine", "후시미 이나리 신사"], ["Tokyo Skytree", "도쿄 스카이트리"], ["Shibuya Crossing", "시부야 스크램블 교차로"], ["Forbidden City", "자금성"], ["Terracotta Army", "진시황 병마용"],
];

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
  sports: [["Do you need a team?", "팀이 필요한 운동인가요?"], ["Is special equipment required?", "특별한 장비가 필요한가요?"], ["Can people play it indoors?", "실내에서도 할 수 있나요?"], ["Is it in the Olympics?", "올림픽 종목인가요?"], ["Is it physically demanding?", "체력 소모가 큰가요?"]],
  celebrities: [["Is this person known worldwide?", "이 사람은 세계적으로 유명한가요?"], ["Are they active on social media?", "SNS 활동을 많이 하나요?"], ["Have they won major awards?", "큰 상을 받은 적이 있나요?"], ["Would young people recognize them?", "젊은 세대도 알아볼까요?"], ["Are they mainly known for entertainment?", "주로 연예 활동으로 유명한가요?"]],
  brands: [["Is this brand expensive?", "이 브랜드는 비싼 편인가요?"], ["Do you own something from this brand?", "이 브랜드 제품을 가지고 있나요?"], ["Is it available worldwide?", "전 세계에서 살 수 있나요?"], ["Is its logo easy to recognize?", "로고를 쉽게 알아볼 수 있나요?"], ["Would you recommend its products?", "이 브랜드 제품을 추천하나요?"]],
  history: [["Did this happen more than a century ago?", "100년도 더 전에 일어난 일인가요?"], ["Did it change the world?", "세상을 바꾼 사건인가요?"], ["Is it taught in school?", "학교에서 배우나요?"], ["Are famous leaders connected to it?", "유명 지도자와 관련 있나요?"], ["Can people visit related sites today?", "오늘날 관련 장소를 방문할 수 있나요?"]],
  space: [["Can it be seen without a telescope?", "망원경 없이 볼 수 있나요?"], ["Is it inside our solar system?", "태양계 안에 있나요?"], ["Could humans travel there?", "인간이 그곳에 갈 수 있나요?"], ["Is it larger than Earth?", "지구보다 큰가요?"], ["Does it produce light?", "스스로 빛을 내나요?"]],
  transportation: [["Does it travel on land?", "땅 위로 이동하나요?"], ["Can many people ride it together?", "여러 사람이 함께 탈 수 있나요?"], ["Would you use it for a long trip?", "장거리 여행에 이용할 수 있나요?"], ["Does it need a professional driver?", "전문 운전자가 필요한가요?"], ["Is it faster than a car?", "자동차보다 빠른가요?"]],
  "everyday-objects": [["Do you use this every day?", "매일 사용하는 물건인가요?"], ["Can you carry it in a bag?", "가방에 넣고 다닐 수 있나요?"], ["Does it need electricity?", "전기가 필요한가요?"], ["Would you find it in a kitchen?", "주방에서 볼 수 있나요?"], ["Is it easy to lose?", "잃어버리기 쉬운 물건인가요?"]],
  "famous-landmarks": [["Have you seen this in a movie?", "영화에서 본 적 있나요?"], ["Is it in Asia?", "아시아에 있나요?"], ["Was it built more than a century ago?", "100년도 더 전에 지어졌나요?"], ["Would you take a photo there?", "그곳에서 사진을 찍고 싶나요?"], ["Is it a UNESCO World Heritage site?", "유네스코 세계유산인가요?"]],
};

function questionsFor(categoryId: SpyfallCategoryId): SpyfallExampleQuestion[] {
  const pairs = [...categoryQuestionSeeds[categoryId], ...commonQuestionTemplates.slice(0, 25)];
  return pairs.map(([english, korean], index) => ({
    id: `${categoryId}-question-${String(index + 1).padStart(2, "0")}`,
    english,
    korean,
  }));
}

const retainedCategoryIds: SpyfallCategoryId[] = [
  "places", "countries", "jobs", "movies", "sports", "celebrities", "brands", "history", "space",
];

const legacyCategories = (legacyCategoryData as LegacyCategory[])
  .filter((category) => retainedCategoryIds.includes(category.id as SpyfallCategoryId))
  .map((category): SpyfallCategory => ({
  id: category.id as SpyfallCategoryId,
  title: category.title,
  titleKo: category.titleKo,
  items: uniqueAnswers([
    ...category.items.map((english, index) => ({
      id: `${category.id}-${slug(english)}-${String(index + 1).padStart(3, "0")}`,
      english,
      korean: legacyKorean(category, english, index),
      category: category.id as SpyfallCategoryId,
      difficulty: difficultyFor(index),
    })),
    ...answersFromPairs(category.id as SpyfallCategoryId, extraAnswers[category.id as SpyfallCategoryId] ?? []),
  ]),
  questions: questionsFor(category.id as SpyfallCategoryId),
}));

const addedCategories: SpyfallCategory[] = [
  { id: "transportation", title: "Transportation", titleKo: "교통수단", items: answersFromPairs("transportation", transportationAnswers), questions: questionsFor("transportation") },
  { id: "everyday-objects", title: "Everyday Objects", titleKo: "일상 물건", items: answersFromPairs("everyday-objects", everydayObjectAnswers), questions: questionsFor("everyday-objects") },
  { id: "famous-landmarks", title: "Famous Landmarks", titleKo: "세계 명소", items: answersFromPairs("famous-landmarks", landmarkAnswers), questions: questionsFor("famous-landmarks") },
];

export const spyfallContent: SpyfallCategory[] = [...legacyCategories, ...addedCategories];

