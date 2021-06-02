const { getCommentsData } = require('./fetchHelper');


async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function getPageComments(page,postUrl,{all}={all:false}){
    const requests = [];
    page.on('request', async request => {
        if (request.resourceType() === 'xhr') {
            if (request._headers.authorization && request._url.includes('https://twitter.com/i/api/2/timeline/conversation/')) {
                requests.push({ dataUrl: request._url, headers: request._headers, postUrl });
            }
        }
    });
    await page.goto(postUrl, { waitUntil: 'networkidle2' });
    const links = await page.$$eval('article a[href]', (links) => {
        return links.map(link => ({ textContent: link.textContent }));
    });
    const userIdLink = links.find(link => {
        const text = link.textContent;
        return text.includes('@');
    });
    const userId = '@' + userIdLink.textContent.split('@')[1];
    if (all){
        await autoScroll(page);
    }
    const commentsLists = await Promise.all(requests.map(
        ({ dataUrl, headers, postUrl }) => getCommentsData(dataUrl, headers, postUrl, { userId })
    ))
    const comments = commentsLists.flatMap(arr => arr)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return comments;
}

module.exports = {
    getPageComments
}