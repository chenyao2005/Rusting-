function toContinue(){
    location.href = "../对话/dialogue.html";
}
function toStart(){
    localStorage.setItem("CD", 0);
    location.href = "../对话/dialogue.html";
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { toContinue, toStart };
}