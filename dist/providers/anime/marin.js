"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../../models");
/**
 * @attention Cloudflare bypass is **REQUIRED**.
 */
class Marin extends models_1.AnimeParser {
    constructor() {
        super(...arguments);
        this.name = 'Marin';
        this.baseUrl = 'https://marin.moe';
        this.logo = 'https://i.pinimg.com/736x/62/8d/3f/628d3f2e60b0aa8c8fa9598e8dae6320.jpg';
        this.classPath = 'ANIME.Marin';
        /**
         * @param query Search query
         */
        this.search = async (query, page = 1) => {
            let token = await this.getToken();
            let data;
            try {
                let response = await axios_1.default.post('https://marin.moe/anime', { "page": page, "sort": "az-a", "filter": { "type": [], "status": [], "content_rating": [], "genre": [], "group": [], "production": [], "source": [], "resolution": [], "audio": [], "subtitle": [] }, "search": query }, {
                    headers: {
                        Origin: 'https://marin.moe/',
                        Referer: 'https://marin.moe/anime',
                        Cookie: `__ddg1=;__ddg2_=; XSRF-TOKEN=${token[1]}; marinmoe_session=${token[0]};`,
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                        "x-xsrf-token": token[1].split(';')[0].replace("%3D", "="),
                        "x-inertia": true
                    },
                });
                data = await response.data;
            }
            catch (error) {
                console.log(error);
            }
            let response_data = {
                currentPage: page,
                hasNextPage: data.props.anime_list.meta.last_page > page,
                results: data.props.anime_list.data.map((el) => {
                    return {
                        id: el.slug,
                        title: el.title,
                        image: el.cover,
                        releaseDate: el.year,
                        type: el.type
                    };
                })
            };
            return response_data;
        };
        /**
         * @param id Anime id
         */
        this.fetchAnimeInfo = async (id) => {
            let data;
            try {
                let response = await axios_1.default.get(`https://marin.moe/anime/${id}`, {
                    headers: {
                        Origin: 'https://marin.moe/',
                        Referer: `https://marin.moe/anime/${id}`,
                        Cookie: `__ddg1=;__ddg2_=;`,
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                        "x-inertia": true,
                        "x-inertia-version": "884345c4d568d16e3bb2fb3ae350cca9",
                        "x-requested-with": "XMLHttpRequest",
                    },
                });
                data = await response.data;
            }
            catch (error) {
                console.log(error);
            }
            let episodes = data.props.episode_list.data;
            if (data.props.anime.last_episode > 36) {
                let token = await this.getToken();
                for (let index = 2; index < data.props.anime.last_episode / 36; index++) {
                    let response = await axios_1.default.post(`https://marin.moe/anime/${id}`, { "filter": { "episodes": true, "specials": true }, "eps_page": index }, {
                        headers: {
                            Origin: 'https://marin.moe/',
                            Referer: `https://marin.moe/anime/${id}`,
                            Cookie: `__ddg1=;__ddg2_=; XSRF-TOKEN=${token[1]}; marinmoe_session=${token[0]};`,
                            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                            "x-inertia": true,
                            "x-inertia-version": "884345c4d568d16e3bb2fb3ae350cca9",
                            "x-requested-with": "XMLHttpRequest",
                            "x-xsrf-token": token[1].split(';')[0].replace("%3D", "="),
                        },
                    });
                    let data = await response.data;
                    console.log(data.props.episode_list.data[0]);
                    episodes = episodes.concat(data.props.episode_list.data);
                }
            }
            //{"filter":{"episodes":true,"specials":true},"eps_page":2}
            let response_data = {
                id: id,
                title: {
                    native: data.props.anime.alt_titles["Official Title"][0].text,
                    romaji: data.props.anime.title,
                    english: data.props.anime.alt_titles["Official Title"][1].text
                },
                synonyms: data.props.anime.alt_titles["Synonym"].map((el) => {
                    return el.text;
                }),
                image: data.props.anime.cover,
                cover: data.props.anime.cover,
                description: data.props.anime.description,
                status: data.props.anime.status.name,
                releaseDate: data.props.anime.release_date,
                totalEpisodes: data.props.anime.last_episode,
                currentEpisode: data.props.anime.last_episode,
                genres: data.props.anime.genre_list.map((el) => {
                    return el.name;
                }),
                studios: data.props.anime.production_list.map((el) => {
                    return el.name;
                }),
                type: data.props.anime.type.name,
                ageRating: data.props.anime.content_rating.name,
                episodes: episodes.map((el) => {
                    return {
                        id: el.sort,
                        title: el.title,
                        number: el.sort,
                        image: el.cover,
                        airdate: el.release_date
                    };
                })
            };
            return response_data;
        };
        /**
         *
         * @param episodeId Episode id
         */
        this.fetchEpisodeSources = async (id, episodeNumber) => {
            let data;
            try {
                let response = await axios_1.default.get(`https://marin.moe/anime/${id}/${episodeNumber}`, {
                    headers: {
                        Origin: 'https://marin.moe/',
                        Referer: `https://marin.moe/anime/${id}/${episodeNumber}`,
                        Cookie: `__ddg1=;__ddg2_=;`,
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
                        "x-inertia": true,
                        "x-inertia-version": "884345c4d568d16e3bb2fb3ae350cca9",
                        "x-requested-with": "XMLHttpRequest",
                    },
                });
                data = await response.data;
            }
            catch (error) {
                console.log(error);
            }
            let response_data = {
                sources: data.props.video.data.mirror.map((el) => {
                    return {
                        url: el.code.file,
                        quality: el.resolution,
                        isM3U8: false,
                        duration: el.code.duration,
                        thumbnail: el.code.thumbnail
                    };
                }),
                sprites: data.props.video.data.mirror[0].code.sprite,
                spriteVtt: data.props.video.data.mirror[0].code.vtt,
            };
            return response_data;
        };
        /**
         *
         * @param episodeId Episode id
         */
        this.fetchEpisodeServers = (episodeId) => {
            throw new Error('Method not implemented.');
        };
    }
    async getToken() {
        let token = [];
        let response = await axios_1.default.get('https://marin.moe/anime', {
            headers: {
                Referer: 'https://marin.moe/anime',
                Cookie: '__ddg1_=;__ddg2_=;',
            },
        });
        token.push(response.headers['set-cookie'][1].replace('marinmoe_session=', ''));
        token.push(response.headers['set-cookie'][0].replace('XSRF-TOKEN=', ''));
        return token;
    }
}
exports.default = Marin;
(async () => {
    let marin = new Marin();
    console.log(await marin.fetchEpisodeSources('dewhzcns', 1));
})();
//# sourceMappingURL=marin.js.map