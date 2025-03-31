import { PixivArtwork } from '../types/fortune';

// 本地图片备选列表
export const LOCAL_ARTWORKS: PixivArtwork[] = [
  {
    id: "127455493",
    title: "观星少女",
    description: "星空下的女孩，描绘了宁静与梦想",
    date: "2023-05-12",
    tags: ["星空", "少女", "梦幻"],
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/images/artworks/127455493_p0.png"
  },
  {
    id: "127839312",
    title: "命运之轮",
    description: "命运的转折，机遇与挑战并存",
    date: "2023-07-23",
    tags: ["命运", "转折", "神秘"],
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/images/artworks/127839312_p0.png"
  },
  {
    id: "128707970",
    title: "魔法森林",
    description: "充满魔力的神秘森林，孕育奇迹的地方",
    date: "2023-10-15",
    tags: ["森林", "魔法", "奇幻"],
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/images/artworks/128707970_p0.png"
  }
];

// 从本地图片中随机选择一个
function getRandomLocalArtwork(): PixivArtwork {
  return LOCAL_ARTWORKS[Math.floor(Math.random() * LOCAL_ARTWORKS.length)];
}

export async function getRandomPopularArtwork(): Promise<PixivArtwork> {
  try {
    // 暂时使用本地图片，后续可以替换为实际的 Pixiv API 调用
    return getRandomLocalArtwork();
    
    // TODO: 实现 Pixiv API 调用
    // const PIXIV_API_PROXY = process.env.REACT_APP_PIXIV_API_PROXY;
    // if (!PIXIV_API_PROXY) {
    //   console.warn('Pixiv API proxy not configured, using local artworks');
    //   return getRandomLocalArtwork();
    // }
    
    // const response = await axios.get(`${PIXIV_API_PROXY}/popular`);
    // const artworks = response.data.artworks;
    
    // if (!artworks || artworks.length === 0) {
    //   console.warn('No artworks found from Pixiv API, using local artworks');
    //   return getRandomLocalArtwork();
    // }
    
    // const randomArtwork = artworks[Math.floor(Math.random() * artworks.length)];
    
    // return {
    //   id: randomArtwork.id,
    //   title: randomArtwork.title,
    //   artistId: randomArtwork.user.id,
    //   artistName: randomArtwork.user.name,
    //   imageUrl: randomArtwork.image_urls.large
    // };
  } catch (error) {
    console.error('Failed to fetch artwork from Pixiv:', error);
    return getRandomLocalArtwork();
  }
} 