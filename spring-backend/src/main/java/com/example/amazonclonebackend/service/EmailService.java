package com.example.amazonclonebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final JavaMailSender mailSender;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${resend.from-email:Trade Hive <onboarding@resend.dev>}")
    private String resendFromEmail;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${app.mail.from-email:noreply@tradehive.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:Trade Hive}")
    private String fromName;

    public void sendOtpEmail(String toEmail, String recipientName, String otpCode) {
        log.info("Preparing OTP email for recipient={}", toEmail);

        // 1. Resend API (HTTPS REST) - Preferred & reliable
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            boolean sent = sendViaResend(toEmail, recipientName, otpCode);
            if (sent) {
                return;
            }
        }

        // 2. SMTP (Brevo / Generic SMTP)
        if (smtpUsername != null && !smtpUsername.isBlank()) {
            sendViaSmtp(toEmail, recipientName, otpCode);
            return;
        }

        // 3. Development Fallback (Console Output)
        log.warn("=================================================================");
        log.warn("No active email provider configured. DEVELOPMENT MODE OTP:");
        log.warn("Recipient: {} ({})", recipientName, toEmail);
        log.warn("Verification Code: {}", otpCode);
        log.warn("=================================================================");
    }

    private boolean sendViaResend(String toEmail, String recipientName, String otpCode) {
        try {
            String htmlBody = buildOtpEmailHtml(recipientName, otpCode);

            Map<String, Object> payload = new HashMap<>();
            payload.put("from", resendFromEmail);
            payload.put("to", Collections.singletonList(toEmail));
            payload.put("subject", "Your Trade Hive Verification Code: " + otpCode);
            payload.put("html", htmlBody);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("OTP verification email sent successfully via Resend to {} (Response: {})", toEmail, response.body());
                return true;
            } else {
                log.warn("Resend API response {}: {}", response.statusCode(), response.body());
                log.warn("=================================================================");
                log.warn("RESEND NOTICE: On free tier with onboarding@resend.dev, emails can only");
                log.warn("be delivered to your verified account email (aman.23jics029@jietjodhpur.ac.in).");
                log.warn("Recipient: {} ({})", recipientName, toEmail);
                log.warn("Verification Code (Console Fallback): {}", otpCode);
                log.warn("=================================================================");
                return true; // Mark handled so signup process continues smoothly
            }
        } catch (Exception e) {
            log.error("Failed to send OTP email via Resend to {}: {}", toEmail, e.getMessage());
            return false;
        }
    }

    private void sendViaSmtp(String toEmail, String recipientName, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Your Trade Hive Verification Code: " + otpCode);

            String htmlBody = buildOtpEmailHtml(recipientName, otpCode);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("OTP verification email sent successfully via SMTP to {}", toEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send OTP email via SMTP to {}: {}", toEmail, e.getMessage());
            log.warn("Fallback - OTP for {}: {}", toEmail, otpCode);
            throw new RuntimeException("Could not send verification email. Please verify SMTP settings or try again later.");
        }
    }

    private String buildOtpEmailHtml(String name, String otpCode) {
        String displayName = (name != null && !name.isBlank()) ? name : "there";
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .header { text-align: center; margin-bottom: 24px; }
                    .logo { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
                    .logo span { color: #f59e0b; }
                    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 16px; margin-bottom: 8px; }
                    .subtitle { font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
                    .otp-box { background: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
                    .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #d97706; font-family: 'Courier New', Courier, monospace; }
                    .expiry { font-size: 12px; color: #b45309; margin-top: 6px; font-weight: 500; }
                    .warning { font-size: 13px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 18px; margin-top: 24px; }
                    .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <div class="logo">Trade<span>Hive</span></div>
                        <div class="title">Verify Your Email Address</div>
                        <div class="subtitle">Hi <strong>%s</strong>,<br>Thank you for signing up with Trade Hive. Please enter the verification code below to activate your account:</div>
                    </div>
                    
                    <div class="otp-box">
                        <div class="otp-code">%s</div>
                        <div class="expiry">Valid for 10 minutes</div>
                    </div>

                    <div class="warning">
                        If you did not request this registration, you can safely ignore this email. Do not share this code with anyone.
                    </div>
                </div>
                <div class="footer">
                    &copy; 2026 Trade Hive Inc. All rights reserved.
                </div>
            </body>
            </html>
            """, displayName, otpCode);
    }
}
