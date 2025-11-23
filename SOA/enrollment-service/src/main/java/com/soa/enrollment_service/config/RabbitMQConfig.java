package com.soa.enrollment_service.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Tên hàng đợi: enrollment_queue
    public static final String QUEUE_NAME = "enrollment_queue";

    @Bean
    public Queue enrollmentQueue() {
        // true = Durable (Bền vững, không mất khi khởi động lại RabbitMQ)
        return new Queue(QUEUE_NAME, true);
    }

    // Cấu hình để gửi nhận dữ liệu dạng JSON (thay vì byte)
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}