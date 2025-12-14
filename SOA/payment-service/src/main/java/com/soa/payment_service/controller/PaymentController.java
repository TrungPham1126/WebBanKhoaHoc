package com.soa.payment_service.controller;

import com.soa.payment_service.config.VNPayConfig;
import com.soa.payment_service.dto.ChartDataDTO;
import com.soa.payment_service.dto.PaymentDTO;
import com.soa.payment_service.dto.RestResponse;
import com.soa.payment_service.entity.TransactionHistory;
import com.soa.payment_service.repository.TransactionRepository;
import com.soa.payment_service.service.WalletService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final VNPayConfig vnPayConfig;
    private final RestTemplate restTemplate;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private WalletService walletService;

    public PaymentController(VNPayConfig vnPayConfig, RestTemplate restTemplate) {
        this.vnPayConfig = vnPayConfig;
        this.restTemplate = restTemplate;
    }

    // --- API TẠO THANH TOÁN VNPAY ---
    @GetMapping("/create_payment")
    public ResponseEntity<PaymentDTO> createPayment(
            HttpServletRequest req,
            @RequestParam("amount") long amount,
            @RequestParam("courseId") Long courseId,
            @RequestParam("courseTitle") String courseTitle,
            @RequestParam("email") String studentEmail,
            @RequestParam("teacherEmail") String teacherEmail,
            @RequestParam("teacherId") Long teacherId) // ID CẦN KIỂM TRA
            throws UnsupportedEncodingException {

        // 🔥 LOG KIỂM TRA: XÁC ĐỊNH ID GIÁO VIÊN NHẬN ĐƯỢC TỪ FRONTEND
        logger.info(">>> [PAYMENT START] Course ID: {}, Teacher ID NHẬN TỪ FRONTEND: {}", courseId, teacherId);

        String vnp_TxnRef = vnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = vnPayConfig.getIpAddress(req);
        long amountVal = amount * 100;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnPayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", vnPayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amountVal));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan khoa hoc " + courseId);
        vnp_Params.put("vnp_OrderType", vnPayConfig.orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // Gắn teacherId vào URL trả về
        String returnUrlWithData = vnPayConfig.vnp_ReturnUrl
                + "?courseId=" + courseId
                + "&studentEmail=" + URLEncoder.encode(studentEmail, StandardCharsets.US_ASCII.toString())
                + "&teacherEmail=" + URLEncoder.encode(teacherEmail, StandardCharsets.US_ASCII.toString())
                + "&courseTitle=" + URLEncoder.encode(courseTitle, StandardCharsets.US_ASCII.toString())
                + "&teacherId=" + teacherId;

        vnp_Params.put("vnp_ReturnUrl", returnUrlWithData);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = vnPayConfig.hmacSHA512(vnPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.vnp_PayUrl + "?" + queryUrl;

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setStatus("OK");
        paymentDTO.setMessage("Successfully");
        paymentDTO.setURL(paymentUrl);

        return ResponseEntity.ok(paymentDTO);
    }

    // --- XỬ LÝ KẾT QUẢ TRẢ VỀ ---
    @GetMapping("/vnpay-return")
    public void vnpayReturn(
            @RequestParam(value = "vnp_ResponseCode") String responseCode,
            @RequestParam(value = "vnp_Amount") String vnpAmount,
            @RequestParam(value = "vnp_TxnRef") String txnRef,
            @RequestParam(value = "courseId") Long courseId,
            @RequestParam(value = "courseTitle") String courseTitle,
            @RequestParam(value = "studentEmail") String studentEmail,
            @RequestParam(value = "teacherEmail") String teacherEmail,
            @RequestParam(value = "teacherId") Long teacherId, // ID SAI VẪN ĐƯỢC NHẬN
            HttpServletResponse response) throws IOException {

        if ("00".equals(responseCode)) {
            // 1. Tính toán tiền
            BigDecimal totalAmount = new BigDecimal(vnpAmount).divide(new BigDecimal(100));
            BigDecimal adminShare = totalAmount.multiply(new BigDecimal("0.40"));
            BigDecimal teacherShare = totalAmount.subtract(adminShare);

            // 2. Lưu lịch sử
            TransactionHistory history = new TransactionHistory();
            history.setTransactionId(txnRef);
            history.setCourseId(courseId);
            history.setCourseTitle(courseTitle);
            history.setStudentEmail(studentEmail);
            history.setTeacherEmail(teacherEmail);
            history.setTeacherId(teacherId);
            history.setTotalAmount(totalAmount);
            history.setAdminCommission(adminShare);
            history.setTeacherReceived(teacherShare);

            transactionRepository.save(history);

            // 3. CỘNG TIỀN VÀO VÍ GIÁO VIÊN
            try {
                // 🔥 LOG KIỂM TRA: ID ĐƯỢC DÙNG ĐỂ CỘNG VÍ
                logger.info(">>> [PAYMENT SUCCESS] Đang cộng ví cho Teacher ID: {} số tiền: {}", teacherId,
                        teacherShare);
                walletService.processRevenueShare(teacherId, totalAmount, courseTitle);
            } catch (Exception e) {
                logger.error("!!! [ERROR] Lỗi cộng ví: ", e);
            }

            // 4. Kích hoạt khóa học (Enrollment)
            try {
                callEnrollmentService(courseId, courseTitle, studentEmail, teacherId);
                response.sendRedirect("http://localhost:5173/payment-success?courseId=" + courseId);
            } catch (Exception e) {
                logger.error("!!! [ERROR] Lỗi Enrollment: ", e);
                response.sendRedirect("http://localhost:5173/payment-failed?code=enrollment_failed");
            }
        } else {
            response.sendRedirect("http://localhost:5173/payment-failed?code=vnpay_failed");
        }
    }

    // Hàm gọi Enrollment Service
    private void callEnrollmentService(Long courseId, String courseTitle, String email, Long teacherId) {
        String enrollmentUrl = "http://localhost:8084/api/v1/enrollments/internal/enroll";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("courseId", courseId);
        requestBody.put("courseTitle", courseTitle);
        requestBody.put("studentEmail", email);
        requestBody.put("imageUrl", "default.png");
        requestBody.put("teacherId", teacherId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Internal-Secret", "Ba0MatN0iBo_123456");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        restTemplate.postForObject(enrollmentUrl, entity, String.class);
    }

    // --- Các API thống kê ---
    @GetMapping("/history")
    public ResponseEntity<List<TransactionHistory>> getAllTransactions() {
        List<TransactionHistory> list = transactionRepository.findAll();
        list.sort((a, b) -> b.getId().compareTo(a.getId()));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/stats/monthly-revenue")
    public ResponseEntity<RestResponse<List<ChartDataDTO>>> getMonthlyRevenue() {
        List<ChartDataDTO> stats = transactionRepository.getMonthlyRevenue();
        return ResponseEntity.ok(RestResponse.success(stats, "Lấy doanh thu tháng thành công"));
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<RestResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> data = new HashMap<>();

        List<ChartDataDTO> dailyRevenue = transactionRepository.getDailyRevenue();
        List<ChartDataDTO> topCourses = transactionRepository.getTopSellingCourses()
                .stream().limit(5).collect(Collectors.toList());
        List<TransactionHistory> recentTransactions = transactionRepository.findTop5ByOrderByCreatedAtDesc();

        BigDecimal totalRevenue = dailyRevenue.stream()
                .map(ChartDataDTO::getValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        data.put("revenueChart", dailyRevenue);
        data.put("topCourses", topCourses);
        data.put("recentTransactions", recentTransactions);
        data.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(RestResponse.success(data, "Lấy Dashboard thành công"));
    }
}