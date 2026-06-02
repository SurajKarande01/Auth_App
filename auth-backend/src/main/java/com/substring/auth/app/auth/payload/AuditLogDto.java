package com.substring.auth.app.auth.payload;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogDto {
    private UUID id;
    private UUID userId;
    private String action;
    private String resource;
    private String ipAddress;
    private String status;
    private String details;
    private Instant timestamp;
}
