import { Data, DataItem, Route, ViewType } from '@/types';
import ofetch from '@/utils/ofetch';
import { parseDate } from '@/utils/parse-date';
import { load } from 'cheerio';

const feedTitle = 'Pokemon Go News';
const baseURL = 'https://pokemongolive.com';
const dateFormat = {
    en: 'MMMM D, YYYY',
    id: 'D MMMM YYYY',
};

export const route: Route = {
    path: '/news/:lang?',
    categories: ['game'],
    view: ViewType.Pictures,
    example: '/pokemongolive/news/en',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['pokemongolive.com/news'],
            target: '/news',
        },
    ],
    name: feedTitle,
    maintainers: ['akhy'],
    url: 'pokemongolive.com/news',
    handler: async (ctx) => {
        const { lang = 'en' } = ctx.req.param();
        const fullURL = `${baseURL}/news?hl=${lang}`;
        const response = await ofetch(fullURL);

        const $ = load(response);

        const imageURL = $('.navbar__logo img').first().attr('src');

        const list = $('a.blogList__post')
            .toArray()
            .map((i) => {
                const item = $(i);
                const itemTitle = item.find('.blogList__post__content__title').first();
                const itemPubDate = item.find('.blogList__post__content__date').first();
                const itemImage = item.find('.blogList__post__image img.image').first();

                const result: DataItem = {
                    title: itemTitle.text(),
                    link: item.attr('href') || '',
                    description: `<img src="${itemImage.attr('src')}"/><br/>`,
                    image: itemImage.attr('src'),
                    pubDate: parseDate(itemPubDate.text(), dateFormat[lang] || dateFormat.en, lang),
                    language: lang,
                };

                return result;
            });

        const data: Data = {
            title: feedTitle,
            link: fullURL,
            item: list,
            image: imageURL,
            allowEmpty: false,
            ttl: 60 * 12,
            language: lang,
        };

        return data;
    },
};
