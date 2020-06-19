'use strict';
const got = require('got'),
    uRA = require('./uRA.js'),
    EventEmitter = require('./eventEmitter.js'),
    randomCache = {};
function formatResult(getRandomImage){
    const imageData = getRandomImage();
    if (!imageData){
        return;
    }
    return `https://imgur.com/${imageData.hash}${imageData.ext.replace(/\?.*/, '')}`;
}
function storeResults(images, subreddit){
    const getRandomImage = uRA(images);
    randomCache[subreddit] = getRandomImage;
    return getRandomImage;
}
function randomImage(subreddit){
    subreddit = (typeof subreddit === 'string' && subreddit.length !== 0) ? subreddit : 'all';
    if(randomCache[subreddit]){
        return Promise.resolve(formatResult(randomCache[subreddit]));
    }
    return got(`https://imgur.com/r/${subreddit}/new.json`, {json: true})
        .then(response => storeResults(response.body.data, subreddit))
        .then(getRandomImage => formatResult(getRandomImage));
}
function all(subreddit){
    const eventEmitter = new EventEmitter();
    function emitRandomImage(subreddit){
        randomImage(subreddit).then(imageUrl =>{
            eventEmitter.emit('data', `${imageUrl}#${subreddit}`);
            if(eventEmitter.listeners('data').length){
                setTimeout(() => emitRandomImage(subreddit), 200);
            }
        });
    }
    emitRandomImage(subreddit);
    return eventEmitter;
}
function callback(subreddit, cb){
    randomImage(subreddit)
        .then(url => cb(null, url))
        .catch(err => cb(err));
}
module.exports = (subreddit, cb) =>{
    if(typeof cb === 'function'){
        callback(subreddit, cb);
    }else if(typeof subreddit === 'function'){
        callback(null, subreddit);
    }else{
        return randomImage(subreddit);
    }
};
module.exports.all = all;