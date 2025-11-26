function BackToGame(){
    localStorage.setItem('volume', document.getElementById('volume').value);
    localStorage.setItem('textSpeed', document.getElementById('text-speed').value);
    location.href = "../对话/dialogue.html";
    currentDialogue = localStorage.getItem("CD");
    showMessage();
}