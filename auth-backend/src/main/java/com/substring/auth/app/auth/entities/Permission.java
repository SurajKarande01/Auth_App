package com.substring.auth.app.auth.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "permissions")
public class Permission {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(unique = true, nullable = false, length = 100)
    private String name;       // e.g. USER_READ

    @Column(nullable = false, length = 100)
    private String resource;   // e.g. USER

    @Column(nullable = false, length = 50)
    private String action;     // e.g. READ

    @Column(length = 300)
    private String description;
}
