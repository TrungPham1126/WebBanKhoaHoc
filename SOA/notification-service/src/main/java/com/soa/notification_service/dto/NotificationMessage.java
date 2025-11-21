package com.soa.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessage {
    private String recipientEmail; // Gửi cho ai
    private String title; // Tiêu đề
    private String body; // Nội dung
}