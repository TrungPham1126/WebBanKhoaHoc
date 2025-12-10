package com.soa.payment_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RestResponse<T> {
    private int statusCode;
    private String error;
    private String message;
    private T data;

    // Hàm này bắt buộc phải có để Controller gọi được
    public static <T> RestResponse<T> success(T data, String message) {
        return RestResponse.<T>builder()
                .statusCode(200)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> RestResponse<T> error(String error, int statusCode) {
        return RestResponse.<T>builder()
                .statusCode(statusCode)
                .error(error)
                .message("Đã xảy ra lỗi")
                .build();
    }
}