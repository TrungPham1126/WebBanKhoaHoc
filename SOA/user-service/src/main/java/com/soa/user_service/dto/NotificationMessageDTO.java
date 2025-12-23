// SOA/user-service/src/main/java/com/soa/user_service/dto/NotificationMessage.java
package com.soa.user_service.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.io.Serializable;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationMessageDTO implements Serializable{
    private String recipientEmail;
    private String title;
    private String body;
}