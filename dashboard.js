/*
 * Màn hình hiển thị trực tiếp.
 *
 * Đọc đúng dữ liệu mà script.js (trang đăng ký EAKIET.html)
 * đã lưu vào localStorage, key "commitments".
 *
 * LƯU Ý: localStorage chỉ dùng chung được khi trang đăng ký
 * và trang này mở TRÊN CÙNG MỘT TRÌNH DUYỆT (khác tab/cửa sổ
 * vẫn đồng bộ được qua sự kiện "storage"). Nếu sau này cần
 * nhiều người quét QR bằng điện thoại riêng và hiện lên 1 màn
 * hình TV chung, phần lưu dữ liệu cần chuyển sang một backend
 * dùng chung (ví dụ Firebase) thay cho localStorage.
 */

const STORAGE_KEY = "commitments";

// Đổi thành đường dẫn công khai thật của trang đăng ký khi deploy,
// ví dụ: "https://ten-mien-cua-ban.vn/EAKIET.html"
const FORM_URL = "https://tuananh2803.github.io/camket.hoilhpndaklak";


function loadCommitments() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

    } catch (error) {

        console.error("Không đọc được dữ liệu cam kết:", error);

        return [];

    }

}


function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;

}


/* ---------- counter ---------- */

let displayedCount = 0;

function renderCounter(target) {

    const el = document.getElementById("counterNumber");

    if (target === displayedCount) {
        return;
    }


    const from = displayedCount;

    const duration = 600;

    const start = performance.now();


    function step(now) {

        const progress = Math.min((now - start) / duration, 1);

        const value = Math.round(
            from + (target - from) * progress
        );

        el.textContent = value;


        if (progress < 1) {

            requestAnimationFrame(step);

        } else {

            displayedCount = target;

        }

    }


    requestAnimationFrame(step);

}


/* ---------- signer list ---------- */

function renderList(data) {

    const grid = document.getElementById("signerGrid");


    if (!data.length) {

        grid.innerHTML =
            '<div class="empty-state" id="emptyState">Đang chờ những cam kết đầu tiên...</div>';

        return;

    }


    const sorted =
        [...data].sort((a, b) => (b.id || 0) - (a.id || 0));


    grid.innerHTML = sorted.map(item => `
        <div class="signer-card">
            <div class="signer-check">✓</div>
            <div class="signer-info">
                <div class="signer-name">${escapeHtml(item.name)}</div>
                <div class="signer-status">Đã ký cam kết</div>
                ${
                    item.organization
                        ? `<div class="signer-org">${escapeHtml(item.organization)}</div>`
                        : ""
                }
            </div>
        </div>
    `).join("");

}


/* ---------- QR code ---------- */

function initQRCode() {

    const target = document.getElementById("qrcode");

    if (!target || typeof QRCode === "undefined") {
        return;
    }


    new QRCode(target, {

        text: FORM_URL,

        width: 180,
        height: 180,

        colorDark: "#1c2960",
        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.M

    });

}


/* ---------- refresh ---------- */

function refresh() {

    const data = loadCommitments();

    renderCounter(data.length);

    renderList(data);

}


// Tab/cửa sổ khác trên cùng trình duyệt ghi localStorage
// sẽ tự bắn sự kiện "storage" ở đây.
window.addEventListener("storage", function (event) {

    if (event.key === STORAGE_KEY) {

        refresh();

    }

});


// Dự phòng: vẫn kiểm tra định kỳ để bắt các thay đổi
// xảy ra ngay trong cùng tab (ví dụ test qua devtools).
setInterval(refresh, 3000);


initQRCode();

refresh();
