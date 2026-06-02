package com.substring.auth.app.auth.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
        @Index(name = "audit_logs_user_id_idx", columnList = "user_id"),
        @Index(name = "audit_logs_action_idx", columnList = "action"),
        @Index(name = "audit_logs_timestamp_idx", columnList = "timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;       // nullable for anonymous requests

    @Column(nullable = false, length = 100)
    private String action;     // LOGIN, LOGOUT, ACCESS_DENIED, ROLE_CHANGE, PASSWORD_CHANGE

    @Column(length = 500)
    private String resource;   // request URI or resource description

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(length = 20)
    private String status;     // SUCCESS / FAILURE

    @Column(length = 500)
    private String details;    // additional context

    @Builder.Default
    @Column(nullable = false)
    private Instant timestamp = Instant.now();
}
