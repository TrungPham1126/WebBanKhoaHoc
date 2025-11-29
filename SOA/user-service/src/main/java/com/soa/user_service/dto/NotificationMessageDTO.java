// SOA/user-service/src/main/java/com/soa/user_service/dto/NotificationMessage.java
package com.soa.user_service.dto;

public class NotificationMessageDTO {
    private String recipientEmail;
    private String title;
    private String body;

    public NotificationMessageDTO(String recipientEmail, String title, String body) {
        this.recipientEmail = recipientEmail;
        this.title = title;
        this.body = body;
    }
    
    
}