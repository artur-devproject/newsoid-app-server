const axios = require('axios');
const parser = require('xml-js');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const handle = require('./handlePosts')

module.exports = async function(source) {
    console.log("Loading from " + source.url)

    const xmlData = await axios.get(source.url, {
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
        timeout: 5000
    })
    .then(response => {
        if(source.encode == 'win1251') {
            return iconv.decode(Buffer.from(response.data), 'windows-1251');
        } else {
            return response.data;
        }
    })
    .catch((error)=> {
        console.log('...Проблемы с rss-каналом ' + source.url);
        return null
    });

    if(!xmlData) return null

    try {
        const jsonData = parser.xml2json(xmlData, {compact: true, spaces: 2});
        var originPostList = JSON.parse(jsonData).rss.channel.item;    
    }
    catch (error) {
        console.log('...Проблемы с xml данными от ' + source.url);
        return null;
    }

    if(!originPostList) return null

    const formattedPostList = originPostList.map(post => {
        return {
            pubDate: handle.extractPostPubDate(post),
            sourceName: source.name,
            title: handle.extractPostTitle(post),
            description: handle.extractPostDescription(post),
            link: handle.extractPostLink(post),
            img: handle.extractPostImgLink(post),
        }
    });

    const cleanPostList = handle.separateNullPosts(formattedPostList);

    //let readyPostList = source.isImg ? cleanPostList : parseImages(source, cleanPostList);

    return cleanPostList;
};
