package com.substring.auth.app.auth.services;

import com.substring.auth.app.auth.entities.AuditLog;
import com.substring.auth.app.auth.repositories.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log an audit event. Runs async to avoid blocking the request thread.
     */
    @Async
    public void log(UUID userId, String action, String resource, String ipAddress, String status, String details) {
        AuditLog entry = AuditLog.builder()
                .userId(userId)
                .action(action)
                .resource(resource)
                .ipAddress(ipAddress)
                .status(status)
                .details(details)
                .timestamp(Instant.now())
                .build();
        auditLogRepository.save(entry);
    }

    public void log(UUID userId, String action, String resource, String ipAddress, String status) {
        log(userId, action, resource, ipAddress, status, null);
    }

    public Page<AuditLog> getAllLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
    }

    public Page<AuditLog> getLogsByUser(UUID userId, int page, int size) {
        return auditLogRepository.findByUserIdOrderByTimestampDesc(userId, PageRequest.of(page, size));
    }
}
