const form = document.getElementById("control-row");
const input = document.getElementById("input");


(async function initPopupWindow() {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    input.focus();
})();

form.addEventListener("submit", p2pfunc);

function generatePostfx(operationId) {
    var allOperPrefix = []; 
    for (let i = 1; i <= 50; i++) {
        allOperPrefix.push(operationId + "_" + i);
    }
    return allOperPrefix.join(", ");
};


function p2pfunc() {
    var allIdWithPostFX = generatePostfx(input.value);
    saveToClipboard(allIdWithPostFX);
};


function saveToClipboard(data) {
    navigator.clipboard.writeText(data).then(function () {
    }, function () {
        alert("Error");
    }); 
};