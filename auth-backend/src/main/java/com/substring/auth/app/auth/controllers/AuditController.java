package com.substring.auth.app.auth.controllers;

import com.substring.auth.app.auth.config.AppConstants;
import com.substring.auth.app.auth.entities.AuditLog;
import com.substring.auth.app.auth.payload.AuditLogDto;
import com.substring.auth.app.auth.services.AuditService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit-logs")
@AllArgsConstructor
public class AuditController {

    private final AuditService auditService;
    private final ModelMapper modelMapper;

    @GetMapping
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_AUDIT_VIEW + "')")
    public ResponseEntity<Page<AuditLogDto>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AuditLogDto> logs = auditService.getAllLogs(page, size)
                .map(log -> modelMapper.map(log, AuditLogDto.class));
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('" + AppConstants.PERM_AUDIT_VIEW + "')")
    public ResponseEntity<Page<AuditLogDto>> getLogsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AuditLogDto> logs = auditService.getLogsByUser(userId, page, size)
                .map(log -> modelMapper.map(log, AuditLogDto.class));
        return ResponseEntity.ok(logs);
    }
}
