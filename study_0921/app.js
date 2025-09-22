const userMsg = prompt();
const userNumber = parseInt(userMsg);
const result = userNumber % 2;
document.querySelector('h1').textContent = result ? "홀수입니다." : "짝수입니다.";