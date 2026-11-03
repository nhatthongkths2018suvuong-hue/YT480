# Xem 480p (WebView YouTube nhẹ cho máy yếu)

App bọc trang m.youtube.com trong WebView, có ô tìm kiếm riêng ở trên cùng.
- Khai báo với trang là máy KHÔNG hỗ trợ VP9/AV1/WebM, để YouTube gửi H.264 (mp4) mà chip cũ giải mã bằng phần cứng được.
- Đặt sẵn chất lượng 480p (có thử lại vài lần cho mỗi video).
- Quảng cáo vẫn hiện (đây là trang YouTube). Không đăng nhập Google được trong WebView.
- Nút Back: thoát toàn màn hình, rồi lùi trang, cuối cùng thoát app.

## Build ra APK (giống VTV Grid)
1. Tạo repo GitHub MỚI (ví dụ yt480), tải toàn bộ nội dung thư mục này lên (nhớ thư mục .github).
2. Tab Actions > Build APK > đợi tick xanh > cuối trang tải artifact YT480-apk > giải nén lấy app-debug.apk.
3. Cài lên tablet (bật cài từ nguồn không xác định).

## Nếu vẫn lag hoặc không ép được 480p
- Chọn tay: bấm biểu tượng bánh răng trên trình phát, chọn 480p hoặc 360p.
- Cập nhật "Android System WebView" nếu ROM cho phép.
