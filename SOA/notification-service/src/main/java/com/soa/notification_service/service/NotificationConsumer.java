package com.soa.notification_service.service;

import com.soa.notification_service.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;

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
    }
}