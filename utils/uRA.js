'use strict';
function uR(min, max){
    let prev;
    return function rand(){
        const num = ~~(Math.random() * (max - min + 1) + min);
        prev = (num === prev && min !== max) ? rand() : num;
        return prev;
    }
}
module.exports = function(arr){
    var rand = uR(0, arr.length - 1);
    return function(){
        return arr[rand()];
    }
}