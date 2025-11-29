package com.soa.notification_service.service;

import com.soa.notification_service.dto.NotificationMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationConsumer.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService; // Inject EmailService

    public NotificationConsumer(SimpMessagingTemplate messagingTemplate, EmailService emailService) {
        this.messagingTemplate = messagingTemplate;
        this.emailService = emailService;
    }

    // Lắng nghe hàng đợi có tên "notification_queue"
    @RabbitListener(queues = "notification_queue")
    public void receiveMessage(NotificationMessage message) {
        log.info("Nhận thông báo từ RabbitMQ: {}", message);

        // Gửi thông báo tới Frontend qua WebSocket
        // React sẽ subscribe ở: /topic/notifications
        messagingTemplate.convertAndSend("/topic/notifications", message);

        // Nâng cao: Nếu muốn gửi riêng cho từng user thì dùng convertAndSendToUser
        // messagingTemplate.convertAndSendToUser(message.getRecipientEmail(),
        // "/queue/messages", message);

        // Gửi email thật
        try {
            emailService.sendSimpleEmail(
                    message.getRecipientEmail(),
                    message.getTitle(),
                    message.getBody());
        } catch (Exception e) {
            log.error("Lỗi khi gửi email: {}", e.getMessage());
        }
    }

}