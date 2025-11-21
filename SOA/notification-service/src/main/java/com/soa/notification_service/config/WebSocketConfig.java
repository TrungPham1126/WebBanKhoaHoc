package com.soa.notification_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Client (React) sẽ subscribe vào các đường dẫn bắt đầu bằng /topic để nhận tin
        config.enableSimpleBroker("/topic");
        // Client gửi tin lên server qua đường dẫn bắt đầu bằng /app (nếu cần chat)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Điểm kết nối WebSocket. React sẽ kết nối vào: http://localhost:8084/ws
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000") // Cho phép React gọi
                .withSockJS(); // Hỗ trợ fallback nếu trình duyệt không có WebSocket
    }
}