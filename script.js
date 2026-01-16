// 這裡之後要換成你的外網 IP 或 Cloudflare Tunnel 網址
const API_BASE = "http://192.168.31.239:5000";

// 網頁載入後立即抓取留言
window.onload = fetchMessages;

async function fetchMessages() {
    const board = document.getElementById('messageBoard');
    const loader = document.getElementById('loader');
    
    try {
        const response = await fetch(`${API_BASE}/get_msgs`);
        const data = await response.json();
        
        loader.style.display = 'none';
        board.innerHTML = data.map(msg => `
            <div class="message-card">
                <strong>${msg.name}</strong>
                <p>${msg.content}</p>
            </div>
        `).join('');
    } catch (error) {
        loader.innerText = "連線失敗，請確認伺服器狀態";
        console.error("Error:", error);
    }
}

async function sendMessage() {
    const name = document.getElementById('name').value;
    const content = document.getElementById('content').value;
    const btn = document.getElementById('sendBtn');

    if (!name || !content) return alert("請填寫姓名與內容");

    btn.disabled = true;
    btn.innerText = "發送中...";

    try {
        await fetch(`${API_BASE}/post_msg`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, content })
        });
        
        document.getElementById('content').value = ''; // 清空輸入框
        fetchMessages(); // 重新整理清單
    } catch (error) {
        alert("發送失敗，伺服器可能不在線上");
    } finally {
        btn.disabled = false;
        btn.innerText = "發佈留言";
    }
}