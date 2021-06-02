const express = require('express');
const router = express.Router();
const { getPageComments } = require('./puppeteerHelper');
const puppeteer = require('puppeteer');
const twitterUrl = postId => 'https://twitter.com/Twitter/status/' + postId;
const User = require('./models/user');
const Comment = require('./models/comment');

async function addDataToDatabase(comments){
    for (const comment of comments) {
        let user = await User.findOne({ userId: comment.user.userId });
        if (!user) {
            user = new User(comment.user);
            user = await user.save();
        }
        comment.user = user._id;
        const commentIsntace = new Comment(comment);
        try {
            await commentIsntace.save();
        } catch (e) {
            console.warn(e);
        }
    }
}
router.get('/:postId/comments', async (req, res) => {
    const browser = await puppeteer.launch({ headless: false });
    try {
        let { postId } = req.params;
        postId = postId || '1355775802307190786';
        const postUrl = twitterUrl(postId);
        const page = await browser.newPage();
        const comments = await getPageComments(page,postUrl,{all:true})
        const mainPost = comments.find(comment => comment.postId === postId)
        await addDataToDatabase(comments);
        const responceObject = { mainPost, length: comments.length, comments }
        console.log(responceObject);
        res.json(responceObject);
    } catch (e) {
        console.error(e);
        res.send('there was error: ' + e.message);
    }
    finally {
        await browser.close();
    }
});

router.get('/:postId',async (req,res)=>{
    const browser = await puppeteer.launch({ headless: false });
    try {
        let { postId } = req.params;
        postId = postId || '1355775802307190786';
        const postUrl = twitterUrl(postId);
        const page = await browser.newPage();
        const comments = await getPageComments(page,postUrl)
        const mainPost = comments.find(comment => comment.postId === postId)
        await addDataToDatabase([mainPost]);
        const responceObject = { mainPost, length: comments.length, comments }
        console.log(responceObject);
        res.json(mainPost);
    } catch (e) {
        console.error(e);
        res.send('there was error: ' + e.message);
    }
    finally {
        await browser.close();
    }
});

module.exports = router;