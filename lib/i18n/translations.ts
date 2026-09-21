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
  },
};
