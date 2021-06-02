const fetch = require('node-fetch');


function getPostData(url, headers, referrer) {
  return fetch(url, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,he;q=0.8",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": "b3029e1fbebf6f75049db943b21ec28e",
      "x-guest-token": "1398707619729182722",
      "x-twitter-active-user": "yes",
      "x-twitter-client-language": "en",
      "cookie": "_ga=GA1.2.191600450.1573488802; personalization_id=\"v1_feLizI4fkad0e7dzwH3QUA==\"; guest_id=v1%3A161124044759740283; ct0=b3029e1fbebf6f75049db943b21ec28e; at_check=true; _gid=GA1.2.2022919173.1622312814; mbox=session#43e056052cf84464bba5154977797e0d#1622314674|PC#43e056052cf84464bba5154977797e0d.37_0#1685557614; des_opt_in=Y; _sl=1; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCKywYbl5AToMY3NyZl9p%250AZCIlMWE1NjRkMDA5ZGQzZDMyZmQwZDJkNmU0MDNiNzg0NTk6B2lkIiUwOGYw%250ANDY1YTI1ZDAyZGU2NmZiNzBhOTZiMzk1YWE1YQ%253D%253D--e637d2cd5e5b8cb2bc9bd789cbb32a50b5848b3d; gt=1398707619729182722; external_referer=padhuUp37zjgzgv1mFWxJ12Ozwit7owX|0|8e8t2xd8A2w%3D",
      ...headers,
    },
    "referrer": referrer,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }).then(res => {
    return res.json();
  });
}

function mapTweetEntry(users, userId) { 
  return ([postId, data]) => {//  if data.conversation_id  == postId then this is a post, else this is a comment.
    const [postUserId, user] = users.find(([userIdStr, userData]) => userIdStr === data.user_id_str)
    let text = data.full_text
    if (data.full_text.indexOf(userId) == 0)
      text = text.slice(userId.length);
    return {
      postId,
      converstionId:data.conversation_id_str,
      text,
      createdAt: new Date(data.created_at),
      likes:data.favorite_count,
      quotes:data.quote_count,
      replies:data.reply_count,
      retweets:data.retweet_count,
      user: {
        website:user.entities?.url?.urls?.[0]?.expanded_url || null,
        image:user.profile_image_url_https,
        description:user.description,
        userId: postUserId,
        name: user.name,
        screenName: user.screen_name,
      },
    };
  }
}
async function getCommentsData(dataUrl, headers, postUrl, { userId }) {
  const twittersAjaxRes = await getPostData(dataUrl, headers, postUrl);
  console.log(twittersAjaxRes);
  const posts = Object.entries(twittersAjaxRes.globalObjects.tweets);
  const users = Object.entries(twittersAjaxRes.globalObjects.users);
  return posts.map(mapTweetEntry(users, userId));
}
module.exports = {
  getPostData,
  getCommentsData,
}