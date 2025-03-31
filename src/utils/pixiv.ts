import { PixivArtwork } from '../types/fortune';

// 本地图片备选列表
const LOCAL_ARTWORKS: PixivArtwork[] = [
  {
    id: "local-1",
    title: "星空下的少女",
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/Fortune-telling-website/images/artworks/121423493.jpg"
  },
  {
    id: "local-2",
    title: "樱花季节",
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/Fortune-telling-website/images/artworks/121839312.jpg"
  },
  {
    id: "local-3",
    title: "魔法少女",
    artistId: "local-artist",
    artistName: "二次元占卜屋",
    imageUrl: "/Fortune-telling-website/images/artworks/122107970.jpg"
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