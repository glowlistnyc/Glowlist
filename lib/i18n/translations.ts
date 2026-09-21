export type Lang = 'en' | 'ja' | 'ko' | 'zh';
export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ja', label: 'JP', flag: '🇯🇵' },
  { code: 'ko', label: 'KR', flag: '🇰🇷' },
  { code: 'zh', label: 'ZH', flag: '🇨🇳' },
];

export const translations = {
  en: {
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
      contributeDesc:'Found a spot that deserves to be here? Had a great experience worth sharing? This guide gets better when more people contribute.',
    },
    card: { book:'Book', instagram:'Instagram', viewDetails:'View details →' },
    nav: { areas:'Areas', services:'Services', blog:'Blog', about:'About', contact:'Contact', allAreas:'All Areas →', allServices:'All Services →' },
    common: { verified:'Verified', featured:'Featured', noPosts:'Beauty guides and recommendations coming soon.', visitBlog:'Visit Blog →', allPosts:'All posts →' },
    community: {
      writeReview:'Write a Review ✨', writeReviewDesc:"Share your experience. Helps others find the right spot.",
      reportUpdate:'Report an Update', reportUpdateDesc:'Price, hours, or something changed? Let us know.',
      followIG:'Follow on Instagram', followIGDesc:'@glowlist_nyc — new spots, picks, and behind-the-scenes.',
      contactUs:'Contact Us', contactUsDesc:"Questions or feedback? We'd love to hear from you.",
    },
  },
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
      spotsDesc:'すべてのサロンを厳選しています。タップして詳細・料金を確認。',
      onMap:'マップで見る', findSpots:'近くのスポットを探す',
      blog:'ブログから', guides:'ガイドとおすすめ',
      contribute:'情報を共有', helpBuild:'NYCのビューティーマップを一緒に作ろう',
      contributeDesc:'おすすめのサロンを見つけた？良い体験を共有したい？みんなの投稿でガイドがよくなります。',
    },
    card: { book:'予約', instagram:'Instagram', viewDetails:'詳細を見る →' },
    nav: { areas:'エリア', services:'サービス', blog:'ブログ', about:'について', contact:'お問い合わせ', allAreas:'すべてのエリア →', allServices:'すべてのサービス →' },
    common: { verified:'認証済み', featured:'おすすめ', noPosts:'ビューティーガイドは近日公開予定です。', visitBlog:'ブログへ →', allPosts:'すべての記事 →' },
    community: {
      writeReview:'レビューを書く ✨', writeReviewDesc:'体験を共有して、次の人のお役に立ちましょう。',
      reportUpdate:'更新情報を送る', reportUpdateDesc:'価格や営業時間が変わりましたか？お知らせください。',
      followIG:'Instagramをフォロー', followIGDesc:'@glowlist_nyc — 新しいスポット・ピックなど',
      contactUs:'お問い合わせ', contactUsDesc:'ご質問やフィードバックがあればお聞かせください。',
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
      contributeDesc:'좋은 살롱을 알고 계신가요? 멋진 경험을 공유하셨나요? 함께 만들어가는 가이드입니다.',
    },
    card: { book:'예약', instagram:'인스타그램', viewDetails:'자세히 보기 →' },
    nav: { areas:'지역', services:'서비스', blog:'블로그', about:'소개', contact:'문의', allAreas:'모든 지역 →', allServices:'모든 서비스 →' },
    common: { verified:'인증됨', featured:'추천', noPosts:'뷰티 가이드가 곧 공개됩니다.', visitBlog:'블로그 방문 →', allPosts:'모든 게시물 →' },
    community: {
      writeReview:'리뷰 작성 ✨', writeReviewDesc:'경험을 공유해서 다른 분들께 도움을 드리세요.',
      reportUpdate:'업데이트 보고', reportUpdateDesc:'가격이나 영업 시간이 변경되었나요? 알려주세요.',
      followIG:'인스타그램 팔로우', followIGDesc:'@glowlist_nyc — 새로운 스팟, 추천 등',
      contactUs:'문의하기', contactUsDesc:'질문이나 피드백이 있으시면 알려주세요.',
    },
  },
  zh: {
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
      contributeDesc:'发现了值得推荐的地方？有精彩的经历想分享？大家的贡献让这份指南更好。',
    },
    card: { book:'预约', instagram:'Instagram', viewDetails:'查看详情 →' },
    nav: { areas:'地区', services:'服务', blog:'博客', about:'关于', contact:'联系我们', allAreas:'所有地区 →', allServices:'所有服务 →' },
    common: { verified:'已认证', featured:'推荐', noPosts:'美容指南即将发布。', visitBlog:'访问博客 →', allPosts:'所有文章 →' },
    community: {
      writeReview:'写评论 ✨', writeReviewDesc:'分享您的体验，帮助他人找到合适的地方。',
      reportUpdate:'报告更新', reportUpdateDesc:'价格或营业时间有变化吗？请告诉我们。',
      followIG:'关注Instagram', followIGDesc:'@glowlist_nyc — 新地点、推荐等',
      contactUs:'联系我们', contactUsDesc:'有任何问题或建议，欢迎告知我们。',
    },
  },
} as const;

export type Translations = typeof translations.en;
