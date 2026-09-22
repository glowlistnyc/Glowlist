export type Lang = 'en' | 'ja' | 'ko' | 'zh-TW' | 'zh-CN';

export const LANGS: { code: Lang; label: string; sub?: string }[] = [
  { code: 'en',    label: 'EN' },
  { code: 'ja',    label: 'JP' },
  { code: 'ko',    label: 'KR' },
  { code: 'zh-TW', label: '繁體', sub: 'Traditional' },
  { code: 'zh-CN', label: '简体', sub: 'Simplified' },
];

const en = {
  hero: {
    eyebrow: 'Asian-inspired Beauty · New York',
    title: 'Find your next beauty spot in NYC.',
    search: 'Search by salon, area, or style…',
  },
  pills: { gelNails:'Gel Nails', lashLift:'Lash Lift', lashExtensions:'Lash Extensions', headSpa:'Head Spa', browseArea:'Browse by Area' },
  sections: {
    startHere:'Start Here', whatLooking:'What are you looking for?',
    curated:'Curated List', spotsNYC:'Spots to try in NYC',
    spotsDesc:'Every salon is handpicked. Tap any card for prices and details.',
    onMap:'On the Map', findSpots:'Find spots near you',
    blog:'From the Blog', guides:'Guides & recommendations',
    contribute:'Contribute', helpBuild:'Help us build the beauty map NYC actually needs.',
    contributeDesc:'Found a spot that deserves to be here? This guide gets better when more people contribute.',
  },
  card: { book:'Book', instagram:'Instagram', viewDetails:'View details →', verified:'Verified', featured:'Featured' },
  nav: { areas:'Areas', services:'Services', blog:'Blog', about:'About', contact:'Contact', allAreas:'All Areas →', allServices:'All Services →' },
  salon: {
    photos:'Photos', basicInfo:'Basic Information', prices:'Prices',
    otherLocations:'Other locations', backToAll:'← Back to all spots',
    bookAt:'Book at', viewOnGoogleMaps:'View on Google Maps →',
    googleReviews:'Google Reviews', communityReviews:'Community Reviews',
    yelpReviews:'Yelp Reviews', writeReview:'Write a Review →',
    noReviews:'No reviews yet. Be the first to share your experience.',
    priceDisclaimer:'Prices sourced from public menus and may not reflect current rates.',
    category:'Category', area:'Area', address:'Address', language:'Language',
    price:'Price', website:'Website', instagram:'Instagram', notes:'Notes',
  },
  common: {
    noPosts:'Beauty guides and recommendations coming soon.',
    visitBlog:'Visit Blog →', allPosts:'All posts →',
    learnAbout:'Learn about Glowlist →',
  },
  community: {
    writeReview:'Write a Review ✨', writeReviewDesc:"Share your experience. Helps others find the right spot.",
    reportUpdate:'Report an Update', reportUpdateDesc:'Price, hours, or something changed? Let us know.',
    followIG:'Follow on Instagram', followIGDesc:'@glowlist_nyc — new spots, picks, and behind-the-scenes.',
    contactUs:'Contact Us', contactUsDesc:"Questions or feedback? We'd love to hear from you.",
  },
  filters: {
    service:'Service', area:'Area', price:'Price',
    all:'All', nails:'Nails', lashes:'Lashes',
    allAreas:'All areas', manhattan:'Manhattan', brooklyn:'Brooklyn', queens:'Queens',
    priceAll:'All prices', reset:'Reset filters', showing:'Showing', spots:'spot',
    priceFrom:'From ',
  },
  about: {
    label:'About', title:'Finding good beauty in NYC',
    subtitle:'should not be this hard.',
    whyTitle:'Why Glowlist',
    whyBody1:"New York has hundreds of Asian-inspired nail and lash salons — but finding the right one still feels like a gamble. Google gives you star ratings. Instagram gives you aesthetics. Neither tells you whether they use Kokoist gel, whether the technician trained in Japan, or whether the vibe is calm enough for a first-timer.",
    whyBody2:'Glowlist was built to fix that. Every spot on this site is curated by someone who has either been there or has vetted it carefully. We organise by style, service, language, and feel — not just geography and stars.',
    p01Title:'Style over star ratings', p01Body:'Filter by Japanese gel, Korean lash lift, quiet atmosphere, Japanese-speaking staff — the things Google Maps will never show you.',
    p02Title:'A space to exhale', p02Body:'Every spot is chosen with care. Calm atmospheres, skilled hands, and the small details that make a service feel like a genuine treat.',
    p03Title:'Community-powered', p03Body:'Built on real recommendations from people who actually went. Not ads, not sponsorships — just spots worth knowing about.',
    howTitle:'How listings work',
    howBody1:"Salons are listed because they meet Glowlist's curation standards — not because they paid to be here. We verify pricing from public menus, check Instagram for style consistency, and cross-reference community feedback before publishing.",
    howBody2:'Featured placements are available for salons that want more visibility. These are always disclosed and never change how a salon is reviewed or ranked.',
    getInvolvedTitle:'Get involved',
  },
  contact: {
    label:'Get in touch', title:'Contact',
    subtitle:"Questions, feedback, salon partnerships, or press inquiries — we'd love to hear from you.",
    general:'General Inquiries', generalDesc:'Questions about listings, partnerships, or the site.',
    partnership:'Salon Partnerships', partnershipDesc:'Interested in a featured placement or getting your salon listed?',
    report:'Report an Update', reportDesc:'Price, hours, or service info needs updating?',
    review:'Write a Review', reviewDesc:"Share your experience at a salon you've visited.",
    responseNote:'We typically respond within 2–3 business days.',
  },
  pages: {
    browseArea:'Beauty Spots by Area', browseAreaDesc:'Find Asian-inspired nails and lashes across New York City.',
    allServices:'All Services', allServicesDesc:'Browse all beauty services available on Glowlist NYC.',
    blogTitle:'Beauty Guides & Tips', blogDesc:'Curated articles to help you find the best beauty spots in NYC.',
    disclaimer:'Disclaimer',
    clickToZoom:'Click an area to zoom in on the map.',
    spotIn:'spots in',
  },
} as const;

export type T = {
  hero: { eyebrow: string; title: string; search: string };
  pills: { gelNails: string; lashLift: string; lashExtensions: string; headSpa: string; browseArea: string };
  sections: {
    startHere: string; whatLooking: string; curated: string; spotsNYC: string; spotsDesc: string;
    onMap: string; findSpots: string; blog: string; guides: string;
    contribute: string; helpBuild: string; contributeDesc: string;
  };
  card: { book: string; instagram: string; viewDetails: string; verified: string; featured: string };
  nav: { areas: string; services: string; blog: string; about: string; contact: string; allAreas: string; allServices: string };
  salon: {
    photos: string; basicInfo: string; prices: string; otherLocations: string; backToAll: string;
    bookAt: string; viewOnGoogleMaps: string; googleReviews: string; communityReviews: string;
    yelpReviews: string; writeReview: string; noReviews: string; priceDisclaimer: string;
    category: string; area: string; address: string; language: string;
    price: string; website: string; instagram: string; notes: string;
  };
  common: { noPosts: string; visitBlog: string; allPosts: string; learnAbout: string };
  community: {
    writeReview: string; writeReviewDesc: string; reportUpdate: string; reportUpdateDesc: string;
    followIG: string; followIGDesc: string; contactUs: string; contactUsDesc: string;
  };
  filters: {
    service: string; area: string; price: string;
    all: string; nails: string; lashes: string;
    allAreas: string; manhattan: string; brooklyn: string; queens: string;
    priceAll: string; reset: string; showing: string; spots: string;
    priceFrom: string;  // "From " prefix translation
  };
  about: {
    label: string; title: string; subtitle: string;
    whyTitle: string; whyBody1: string; whyBody2: string;
    p01Title: string; p01Body: string;
    p02Title: string; p02Body: string;
    p03Title: string; p03Body: string;
    howTitle: string; howBody1: string; howBody2: string;
    getInvolvedTitle: string;
  };
  contact: {
    label: string; title: string; subtitle: string;
    general: string; generalDesc: string;
    partnership: string; partnershipDesc: string;
    report: string; reportDesc: string;
    review: string; reviewDesc: string;
    responseNote: string;
  };
  pages: {
    browseArea: string; browseAreaDesc: string;
    allServices: string; allServicesDesc: string;
    blogTitle: string; blogDesc: string;
    disclaimer: string;
    clickToZoom: string;
    spotIn: string;  // "X spots in [area]"
  };
};

export const translations: Record<Lang, T> = {
  en,
  ja: {
    hero: {
      eyebrow: 'アジアンビューティー · ニューヨーク',
      title: 'NYCで次のビューティースポットを見つけよう',
      search: 'サロン名、エリア、スタイルで検索…',
    },
    pills: { gelNails:'ジェルネイル', lashLift:'まつ毛リフト', lashExtensions:'まつ毛エクステ', headSpa:'ヘッドスパ', browseArea:'エリアで探す' },
    sections: {
      startHere:'まず確認', whatLooking:'何をお探しですか？',
      curated:'おすすめリスト', spotsNYC:'NYCのビューティースポット',
      spotsDesc:'すべてのサロンを厳選。タップして詳細・料金を確認。',
      onMap:'マップで見る', findSpots:'近くのスポットを探す',
      blog:'ブログから', guides:'ガイドとおすすめ',
      contribute:'情報を共有', helpBuild:'NYCのビューティーマップを一緒に作ろう',
      contributeDesc:'おすすめのサロンや体験をみんなのために共有しましょう。',
    },
    card: { book:'予約', instagram:'Instagram', viewDetails:'詳細を見る →', verified:'認証済み', featured:'おすすめ' },
    nav: { areas:'エリア', services:'サービス', blog:'ブログ', about:'について', contact:'お問い合わせ', allAreas:'すべてのエリア →', allServices:'すべてのサービス →' },
    salon: {
      photos:'写真', basicInfo:'基本情報', prices:'料金',
      otherLocations:'他の店舗', backToAll:'← サロン一覧に戻る',
      bookAt:'予約する', viewOnGoogleMaps:'Google マップで見る →',
      googleReviews:'Googleのレビュー', communityReviews:'コミュニティレビュー',
      yelpReviews:'Yelpのレビュー', writeReview:'レビューを書く →',
      noReviews:'まだレビューがありません。最初に体験を共有しましょう。',
      priceDisclaimer:'料金は公開メニューより。最新情報はサロンに直接ご確認ください。',
      category:'カテゴリー', area:'エリア', address:'住所', language:'言語',
      price:'料金', website:'ウェブサイト', instagram:'Instagram', notes:'メモ',
    },
    common: {
      noPosts:'ビューティーガイドは近日公開予定です。',
      visitBlog:'ブログへ →', allPosts:'すべての記事 →',
      learnAbout:'Glowlistについて →',
    },
    community: {
      writeReview:'レビューを書く ✨', writeReviewDesc:'体験を共有して、次の人のお役に立ちましょう。',
      reportUpdate:'更新情報を送る', reportUpdateDesc:'価格や営業時間が変わりましたか？',
      followIG:'Instagramをフォロー', followIGDesc:'@glowlist_nyc — 新しいスポット・ピックなど',
      contactUs:'お問い合わせ', contactUsDesc:'ご質問やフィードバックをお聞かせください。',
    },
    filters: {
      service:'サービス', area:'エリア', price:'料金',
      all:'すべて', nails:'ネイル', lashes:'まつ毛',
      allAreas:'すべてのエリア', manhattan:'マンハッタン', brooklyn:'ブルックリン', queens:'クイーンズ',
      priceAll:'料金指定なし', reset:'リセット', showing:'表示中', spots:'件',
      priceFrom:'〜',
    },
    about: {
      label:'について', title:'NYCで良いビューティーを探すのは',
      subtitle:'こんなに難しくあるべきではない。',
      whyTitle:'Glowlistとは',
      whyBody1:'ニューヨークにはアジアンインスパイアードのネイル・まつ毛サロンが数多くありますが、自分に合ったサロンを見つけるのは依然として難しいです。Googleは星評価を、Instagramはビジュアルを提供しますが、どちらもKokoist使用かどうか、日本で研修を積んだ技術者かどうか、初めての方でも安心できる雰囲気かどうかは教えてくれません。',
      whyBody2:'Glowlistはその問題を解決するために作られました。このサイトに掲載されているすべてのスポットは、実際に訪問した、または厳選した人によってキュレーションされています。地理や星評価だけでなく、スタイル・サービス・言語・雰囲気で整理しています。',
      p01Title:'星評価よりスタイルで', p01Body:'ジャパニーズジェル、韓国式まつ毛リフト、落ち着いた雰囲気、日本語スタッフ——Google マップでは決してわからないことでフィルタリングできます。',
      p02Title:'ほっとできる空間', p02Body:'すべてのスポットは丁寧に選ばれています。落ち着いた雰囲気、熟練した手技、そして本物のご褒美と感じさせる細部へのこだわり。',
      p03Title:'コミュニティの力で', p03Body:'実際に行った人のリアルなおすすめをもとにしています。広告でも、スポンサーシップでもなく、知る価値のあるスポットだけ。',
      howTitle:'掲載の仕組み',
      howBody1:'サロンはGlowlistのキュレーション基準を満たしているから掲載されています——お金を払ったからではありません。公開メニューで価格を確認し、Instagramでスタイルの一貫性をチェックし、コミュニティのフィードバックと照合してから掲載しています。',
      howBody2:'注目掲載（フィーチャード）は、より多くの露出を求めるサロン向けに提供されています。これらは常に開示され、サロンのレビューやランキングには影響しません。',
      getInvolvedTitle:'参加する',
    },
    contact: {
      label:'お問い合わせ', title:'コンタクト',
      subtitle:'ご質問、フィードバック、サロンパートナーシップ、プレス関連——お気軽にご連絡ください。',
      general:'一般的なお問い合わせ', generalDesc:'掲載、パートナーシップ、サイトに関するご質問。',
      partnership:'サロンパートナーシップ', partnershipDesc:'フィーチャード掲載やサロン登録にご興味がありますか？',
      report:'更新情報を報告', reportDesc:'価格、営業時間、サービス情報の更新が必要ですか？',
      review:'レビューを書く', reviewDesc:'訪問したサロンでの体験を共有してください。',
      responseNote:'通常2〜3営業日以内に回答いたします。',
    },
    pages: {
      browseArea:'エリア別ビューティースポット', browseAreaDesc:'ニューヨーク全体でアジアンインスパイアードのネイルとまつ毛を探す。',
      allServices:'すべてのサービス', allServicesDesc:'Glowlist NYCで提供されているすべてのビューティーサービスをご覧ください。',
      blogTitle:'ビューティーガイド＆ヒント', blogDesc:'NYCで最高のビューティースポットを見つけるためのキュレーション記事。',
      disclaimer:'免責事項',
      clickToZoom:'エリアをクリックするとマップにズームイン。',
      spotIn:'件',
    },
  },
  ko: {
    hero: {
      eyebrow: '아시안 뷰티 · 뉴욕',
      title: 'NYC에서 나만의 뷰티 스팟을 찾아보세요',
      search: '살롱, 지역 또는 스타일로 검색…',
    },
    pills: { gelNails:'젤 네일', lashLift:'래쉬 리프트', lashExtensions:'속눈썹 연장', headSpa:'헤드 스파', browseArea:'지역별 탐색' },
    sections: {
      startHere:'시작하기', whatLooking:'무엇을 찾고 계신가요?',
      curated:'큐레이션 목록', spotsNYC:'NYC 추천 뷰티 스팟',
      spotsDesc:'모든 살롱을 엄선했습니다. 카드를 탭하면 가격과 자세한 정보를 확인할 수 있습니다.',
      onMap:'지도에서 보기', findSpots:'가까운 스팟 찾기',
      blog:'블로그', guides:'가이드 및 추천',
      contribute:'공유하기', helpBuild:'NYC 뷰티 맵을 함께 만들어요',
      contributeDesc:'좋은 살롱이나 경험을 공유해서 도움을 드세요.',
    },
    card: { book:'예약', instagram:'인스타그램', viewDetails:'자세히 보기 →', verified:'인증됨', featured:'추천' },
    nav: { areas:'지역', services:'서비스', blog:'블로그', about:'소개', contact:'문의', allAreas:'모든 지역 →', allServices:'모든 서비스 →' },
    salon: {
      photos:'사진', basicInfo:'기본 정보', prices:'가격',
      otherLocations:'다른 지점', backToAll:'← 살롱 목록으로',
      bookAt:'예약하기', viewOnGoogleMaps:'Google 지도에서 보기 →',
      googleReviews:'구글 리뷰', communityReviews:'커뮤니티 리뷰',
      yelpReviews:'옐프 리뷰', writeReview:'리뷰 작성 →',
      noReviews:'아직 리뷰가 없습니다. 첫 번째로 경험을 공유해보세요.',
      priceDisclaimer:'가격은 공개 메뉴 기준이며 변동될 수 있습니다.',
      category:'카테고리', area:'지역', address:'주소', language:'언어',
      price:'가격', website:'웹사이트', instagram:'인스타그램', notes:'메모',
    },
    common: {
      noPosts:'뷰티 가이드가 곧 공개됩니다.',
      visitBlog:'블로그 방문 →', allPosts:'모든 게시물 →',
      learnAbout:'Glowlist 소개 →',
    },
    community: {
      writeReview:'리뷰 작성 ✨', writeReviewDesc:'경험을 공유해서 다른 분들께 도움을 드리세요.',
      reportUpdate:'업데이트 보고', reportUpdateDesc:'가격이나 영업 시간이 변경되었나요?',
      followIG:'인스타그램 팔로우', followIGDesc:'@glowlist_nyc — 새로운 스팟, 추천 등',
      contactUs:'문의하기', contactUsDesc:'질문이나 피드백이 있으시면 알려주세요.',
    },
    filters: {
      service:'서비스', area:'지역', price:'가격',
      all:'전체', nails:'네일', lashes:'속눈썹',
      allAreas:'전체 지역', manhattan:'맨해튼', brooklyn:'브루클린', queens:'퀸즈',
      priceAll:'전체 가격', reset:'필터 초기화', showing:'표시 중', spots:'개',
      priceFrom:'~',
    },
    about: {
      label:'소개', title:'NYC에서 좋은 뷰티를 찾는 것은',
      subtitle:'이렇게 어려울 필요가 없습니다.',
      whyTitle:'Glowlist란',
      whyBody1:'뉴욕에는 수백 개의 아시아계 살롱이 있지만, 올바른 곳을 찾는 것은 여전히 어렵습니다. Google은 별점을, Instagram은 미적 감각을 보여주지만, 실제 분위기나 기술 수준은 알려주지 않습니다.',
      whyBody2:'Glowlist는 그 문제를 해결하기 위해 만들어졌습니다. 모든 장소는 직접 방문했거나 꼼꼼히 검증한 사람이 큐레이션했습니다.',
      p01Title:'별점보다 스타일로', p01Body:'일본식 젤, 한국식 래쉬 리프트, 조용한 분위기 — Google 지도에서는 절대 알 수 없는 것들로 필터링하세요.',
      p02Title:'편안한 공간', p02Body:'모든 장소는 세심하게 선정되었습니다. 차분한 분위기와 숙련된 손길.',
      p03Title:'커뮤니티의 힘으로', p03Body:'실제로 방문한 사람들의 진짜 추천. 광고도, 스폰서십도 아닙니다.',
      howTitle:'등록 방식',
      howBody1:'살롱은 Glowlist의 큐레이션 기준을 충족하기 때문에 등록됩니다.',
      howBody2:'추천(피처드) 등록은 더 많은 노출을 원하는 살롱을 위해 제공됩니다.',
      getInvolvedTitle:'참여하기',
    },
    contact: {
      label:'문의하기', title:'연락처',
      subtitle:'질문, 피드백, 살롱 파트너십 — 언제든지 연락해 주세요.',
      general:'일반 문의', generalDesc:'등록, 파트너십 또는 사이트에 관한 질문.',
      partnership:'살롱 파트너십', partnershipDesc:'피처드 등록이나 살롱 등록에 관심이 있으신가요?',
      report:'업데이트 보고', reportDesc:'가격, 영업 시간 또는 서비스 정보 업데이트가 필요한가요?',
      review:'리뷰 작성', reviewDesc:'방문한 살롱에서의 경험을 공유해 주세요.',
      responseNote:'일반적으로 영업일 기준 2~3일 이내에 답변 드립니다.',
    },
    pages: {
      browseArea:'지역별 뷰티 스팟', browseAreaDesc:'뉴욕 전역에서 아시아계 살롱을 찾아보세요.',
      allServices:'모든 서비스', allServicesDesc:'Glowlist NYC의 모든 서비스를 살펴보세요.',
      blogTitle:'뷰티 가이드 및 팁', blogDesc:'NYC 최고의 뷰티 스팟을 찾기 위한 기사.',
      disclaimer:'면책조항',
      clickToZoom:'지역을 클릭하면 지도가 확대됩니다.',
      spotIn:'개',
    },
  },
  'zh-TW': {
    hero: {
      eyebrow: '亞洲美容 · 紐約',
      title: '在紐約找到您的下一個美容之地',
      search: '按沙龍、地區或風格搜索…',
    },
    pills: { gelNails:'凝膠美甲', lashLift:'睫毛提升', lashExtensions:'睫毛嫁接', headSpa:'頭皮護理', browseArea:'按地區瀏覽' },
    sections: {
      startHere:'開始探索', whatLooking:'您在尋找什麼？',
      curated:'精選列表', spotsNYC:'紐約美容推薦地點',
      spotsDesc:'每家沙龍都經過精心挑選。點擊卡片查看價格和詳情。',
      onMap:'地圖上查看', findSpots:'尋找附近地點',
      blog:'部落格文章', guides:'指南與推薦',
      contribute:'貢獻內容', helpBuild:'幫助我們建立紐約美容地圖',
      contributeDesc:'發現了值得推薦的地方？分享您的精彩體驗吧。',
    },
    card: { book:'預約', instagram:'Instagram', viewDetails:'查看詳情 →', verified:'已認證', featured:'推薦' },
    nav: { areas:'地區', services:'服務', blog:'部落格', about:'關於', contact:'聯絡我們', allAreas:'所有地區 →', allServices:'所有服務 →' },
    salon: {
      photos:'照片', basicInfo:'基本資訊', prices:'價格',
      otherLocations:'其他地點', backToAll:'← 返回所有沙龍',
      bookAt:'預約', viewOnGoogleMaps:'在 Google 地圖上查看 →',
      googleReviews:'Google 評論', communityReviews:'社群評論',
      yelpReviews:'Yelp 評論', writeReview:'撰寫評論 →',
      noReviews:'尚無評論，成為第一個分享體驗的人吧。',
      priceDisclaimer:'價格來自公開菜單，可能有所變動，請直接向沙龍確認。',
      category:'類別', area:'地區', address:'地址', language:'語言',
      price:'價格', website:'網站', instagram:'Instagram', notes:'備註',
    },
    common: {
      noPosts:'美容指南即將發布。',
      visitBlog:'訪問部落格 →', allPosts:'所有文章 →',
      learnAbout:'了解 Glowlist →',
    },
    community: {
      writeReview:'撰寫評論 ✨', writeReviewDesc:'分享您的體驗，幫助他人找到合適的地方。',
      reportUpdate:'回報更新', reportUpdateDesc:'價格或營業時間有變化嗎？',
      followIG:'追蹤 Instagram', followIGDesc:'@glowlist_nyc — 新地點、推薦等',
      contactUs:'聯絡我們', contactUsDesc:'有任何問題或建議，歡迎告知我們。',
    },
    filters: {
      service:'服務', area:'地區', price:'價格',
      all:'全部', nails:'美甲', lashes:'睫毛',
      allAreas:'全部地區', manhattan:'曼哈頓', brooklyn:'布魯克林', queens:'皇后區',
      priceAll:'全部價格', reset:'重置篩選', showing:'顯示', spots:'個',
      priceFrom:'起',
    },
    about: {
      label:'關於', title:'在紐約找到優質美容服務',
      subtitle:'不應該這麼困難。',
      whyTitle:'為何選擇 Glowlist',
      whyBody1:'紐約有數百家亞洲風格的美甲和睫毛沙龍，但找到合適的一家仍然感覺像是一場賭博。Google 給你星級評分，Instagram 給你視覺感受，但都無法告訴你他們是否使用 Kokoist 凝膠，技師是否在日本受訓，或者氛圍是否適合第一次嘗試的人。',
      whyBody2:'Glowlist 就是為了解決這個問題而建立的。此網站上的每個地點都由親自前往或仔細審查過的人策劃。我們按風格、服務、語言和感受來整理——而不僅僅是地理位置和星級。',
      p01Title:'風格勝於星級', p01Body:'按日式凝膠、韓式睫毛提升、安靜氛圍、日語工作人員篩選——這些是 Google 地圖永遠不會告訴你的事情。',
      p02Title:'讓人放鬆的空間', p02Body:'每個地點都經過精心選擇。平靜的氛圍、熟練的雙手，以及讓服務感覺像真正享受的細節。',
      p03Title:'社群驅動', p03Body:'建立在真正去過的人的真實推薦上。不是廣告，不是贊助——只有值得了解的地方。',
      howTitle:'登錄方式',
      howBody1:'沙龍被列出是因為它們符合 Glowlist 的策劃標準——而不是因為他們付費。我們從公開菜單核實價格，檢查 Instagram 的風格一致性，並在發布前交叉參考社群反饋。',
      howBody2:'推薦登錄（精選）適用於希望獲得更多曝光的沙龍。這些始終公開披露，且不會改變沙龍的評論或排名方式。',
      getInvolvedTitle:'參與其中',
    },
    contact: {
      label:'聯絡我們', title:'聯絡',
      subtitle:'問題、反饋、沙龍合作或媒體查詢——歡迎隨時聯繫。',
      general:'一般查詢', generalDesc:'關於登錄、合作或網站的問題。',
      partnership:'沙龍合作', partnershipDesc:'對精選登錄或讓您的沙龍被收錄感興趣？',
      report:'報告更新', reportDesc:'價格、營業時間或服務資訊需要更新？',
      review:'撰寫評論', reviewDesc:'分享您在沙龍的體驗。',
      responseNote:'我們通常在 2-3 個工作日內回覆。',
    },
    pages: {
      browseArea:'按地區瀏覽美容景點', browseAreaDesc:'在整個紐約市尋找亞洲風格的美甲和睫毛沙龍。',
      allServices:'所有服務', allServicesDesc:'瀏覽 Glowlist NYC 上提供的所有美容服務。',
      blogTitle:'美容指南與技巧', blogDesc:'幫助您找到紐約最佳美容景點的策劃文章。',
      disclaimer:'免責聲明',
      clickToZoom:'點擊地區可在地圖上放大顯示。',
      spotIn:'個地點',
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: '亚洲美容 · 纽约',
      title: '在纽约发现您的专属美容之地',
      search: '按沙龙、地区或风格搜索…',
    },
    pills: { gelNails:'凝胶美甲', lashLift:'睫毛提升', lashExtensions:'睫毛嫁接', headSpa:'头皮护理', browseArea:'按地区浏览' },
    sections: {
      startHere:'开始探索', whatLooking:'您在寻找什么？',
      curated:'精选列表', spotsNYC:'纽约美容推荐地点',
      spotsDesc:'每家沙龙都经过精心挑选。点击卡片查看价格和详情。',
      onMap:'地图上查看', findSpots:'寻找附近地点',
      blog:'博客文章', guides:'指南与推荐',
      contribute:'贡献内容', helpBuild:'帮助我们建立纽约美容地图',
      contributeDesc:'发现了值得推荐的地方？分享您的精彩体验吧。',
    },
    card: { book:'预约', instagram:'Instagram', viewDetails:'查看详情 →', verified:'已认证', featured:'推荐' },
    nav: { areas:'地区', services:'服务', blog:'博客', about:'关于', contact:'联系我们', allAreas:'所有地区 →', allServices:'所有服务 →' },
    salon: {
      photos:'照片', basicInfo:'基本信息', prices:'价格',
      otherLocations:'其他门店', backToAll:'← 返回所有沙龙',
      bookAt:'预约', viewOnGoogleMaps:'在 Google 地图上查看 →',
      googleReviews:'Google 评论', communityReviews:'社区评论',
      yelpReviews:'Yelp 评论', writeReview:'写评论 →',
      noReviews:'暂无评论，成为第一个分享体验的人吧。',
      priceDisclaimer:'价格来自公开菜单，可能有所变动，请直接向沙龙确认。',
      category:'类别', area:'地区', address:'地址', language:'语言',
      price:'价格', website:'网站', instagram:'Instagram', notes:'备注',
    },
    common: {
      noPosts:'美容指南即将发布。',
      visitBlog:'访问博客 →', allPosts:'所有文章 →',
      learnAbout:'了解 Glowlist →',
    },
    community: {
      writeReview:'写评论 ✨', writeReviewDesc:'分享您的体验，帮助他人找到合适的地方。',
      reportUpdate:'报告更新', reportUpdateDesc:'价格或营业时间有变化吗？',
      followIG:'关注 Instagram', followIGDesc:'@glowlist_nyc — 新地点、推荐等',
      contactUs:'联系我们', contactUsDesc:'有任何问题或建议，欢迎告知我们。',
    },
    filters: {
      service:'服务', area:'地区', price:'价格',
      all:'全部', nails:'美甲', lashes:'睫毛',
      allAreas:'全部地区', manhattan:'曼哈顿', brooklyn:'布鲁克林', queens:'皇后区',
      priceAll:'全部价格', reset:'重置筛选', showing:'显示', spots:'个',
      priceFrom:'起',
    },
    about: {
      label:'关于', title:'在纽约找到优质美容服务',
      subtitle:'不应该这么困难。',
      whyTitle:'为何选择 Glowlist',
      whyBody1:'纽约有数百家亚洲风格的美甲和睫毛沙龙，但找到合适的一家仍然感觉像是一场赌博。Google 给你星级评分，Instagram 给你视觉感受，但都无法告诉你他们是否使用 Kokoist 凝胶，技师是否在日本受训，或者氛围是否适合第一次尝试的人。',
      whyBody2:'Glowlist 就是为了解决这个问题而建立的。此网站上的每个地点都由亲自前往或仔细审查过的人策划。',
      p01Title:'风格胜于星级', p01Body:'按日式凝胶、韩式睫毛提升、安静氛围、日语工作人员筛选——这些是 Google 地图永远不会告诉你的事情。',
      p02Title:'让人放松的空间', p02Body:'每个地点都经过精心选择。平静的氛围、熟练的双手，以及让服务感觉像真正享受的细节。',
      p03Title:'社区驱动', p03Body:'建立在真正去过的人的真实推荐上。不是广告，不是赞助——只有值得了解的地方。',
      howTitle:'登录方式',
      howBody1:'沙龙被列出是因为它们符合 Glowlist 的策划标准——而不是因为他们付费。',
      howBody2:'推荐登录（精选）适用于希望获得更多曝光的沙龙。这些始终公开披露，且不会改变沙龙的评论或排名方式。',
      getInvolvedTitle:'参与其中',
    },
    contact: {
      label:'联系我们', title:'联系',
      subtitle:'问题、反馈、沙龙合作或媒体查询——欢迎随时联系。',
      general:'一般查询', generalDesc:'关于登录、合作或网站的问题。',
      partnership:'沙龙合作', partnershipDesc:'对精选登录或让您的沙龙被收录感兴趣？',
      report:'报告更新', reportDesc:'价格、营业时间或服务信息需要更新？',
      review:'撰写评论', reviewDesc:'分享您在沙龙的体验。',
      responseNote:'我们通常在 2-3 个工作日内回复。',
    },
    pages: {
      browseArea:'按地区浏览美容景点', browseAreaDesc:'在整个纽约市寻找亚洲风格的美甲和睫毛沙龙。',
      allServices:'所有服务', allServicesDesc:'浏览 Glowlist NYC 上提供的所有美容服务。',
      blogTitle:'美容指南与技巧', blogDesc:'帮助您找到纽约最佳美容景点的策划文章。',
      disclaimer:'免责声明',
      clickToZoom:'点击地区可在地图上放大显示。',
      spotIn:'个地点',
    },
  },
};
