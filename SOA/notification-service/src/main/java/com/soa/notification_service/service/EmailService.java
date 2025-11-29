package com.soa.notification_service.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // BỎ: private JavaMailSender mailSender;
    // Chúng ta không cần JavaMailSender nữa để tránh lỗi Bean Creation

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        // Thay vì gửi mail thật, chúng ta chỉ in ra Log để kiểm tra
        System.out.println("==================================================");
        System.out.println(">>> [GIA LẬP EMAIL] Đang gửi email tới: " + toEmail);
        System.out.println(">>> Tiêu đề: " + subject);
        System.out.println(">>> Nội dung: " + body);
        System.out.println("==================================================");

        // Không gọi mailSender.send(message) nữa -> Không bao giờ lỗi kết nối!
    }
}