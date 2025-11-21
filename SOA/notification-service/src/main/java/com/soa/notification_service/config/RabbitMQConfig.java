package com.soa.notification_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Tạo Queue tên là "notification_queue" nếu chưa có
    @Bean
    public Queue notificationQueue() {
        return new Queue("notification_queue", true);
    }

    // Cấu hình để gửi nhận object JSON thay vì byte array
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}