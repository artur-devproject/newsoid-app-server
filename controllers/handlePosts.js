exports.separateNullPosts = (postArray) => {
    let cleanPostArray = postArray.filter(post => post.title && post.link);
    return cleanPostArray;
};

exports.extractPostPubDate = (originPost) => {
    if(originPost.pubDate) {
        let date = originPost.pubDate._text || originPost.pubDate._cdata;
        return Date.parse(date);
    } else {
        return Date.now();
    }
};

exports.extractPostTitle = (originPost) => {
    if(originPost.title) {
        let title = originPost.title._text || originPost.title._cdata;
        return title;
    } else {
        return null;
    }
};

exports.extractPostLink = (originPost) => {
    let linkBox = originPost.link || originPost.guid;
    if(linkBox) {
        let link = linkBox._text || linkBox._cdata;
        return link;
    } else {
        return null;
    }
};

exports.extractPostImgLink = (originPost) => {
    let imgLinkBox = originPost['media:thumbnail'] ? originPost['media:thumbnail']
    : originPost['media:content'] ? originPost['media:content']
    : originPost.enclosure && Array.isArray(originPost.enclosure) ? originPost.enclosure[0]
    : originPost.enclosure && !Array.isArray(originPost.enclosure) ? originPost.enclosure
    : '';

    let imgLink = imgLinkBox=='' ? '' 
    : Array.isArray(imgLinkBox) ? imgLinkBox[0]._attributes.url 
    : imgLinkBox._attributes.url;

    return imgLink;
};

exports.parseImages = async (source, postList) => {
    console.log('... загрузка фото из ' + source.url);
    let posts = [...postList];
    for (let post of posts) {
        post.img = await axios({
            method: 'get',
            url: post.link,
            timeout: 5000
        })
        .then(response => {
            let $ = cheerio.load(response.data);
            let link = source.prefix + $(source.selector).find('img').attr('src');
            console.log('... Фото успешно загружено ' + post.link);         
            return link;
        })
        .catch((error) => {
            console.log('... Проблемы с загрузкой фото ' + post.link);
            console.error(error.message);
            return '';
        });
    };
    console.log('... Завершена загрузка фото от ' + source.url);
    return posts;
};

exports.extractPostDescription = (originPost) => {
    if(originPost.description) {
        let description = originPost.description._text || originPost.description._cdata;
        return description;
    } else {
        return extractPostTitle(originPost);
    }
};

exports.extractPostCategory = (originPost, sourceCategory) => {
    if(originPost.category && sourceCategory==='mix') {
        let originCategory = originPost.category._text || originPost.category._cdata;
        let category = detectRegularCategory(originCategory);
        return category;
    } else {
        let category = sourceCategory;
        return category;
    }
};

exports.detectRegularCategory = (originCategory) => {
    let regularCategory = Object.keys(categoryMap).find(key => categoryMap[key].includes(originCategory));
    return regularCategory ? regularCategory : categoryMap["default_value"];
};