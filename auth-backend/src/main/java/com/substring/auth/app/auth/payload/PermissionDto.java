package com.substring.auth.app.auth.payload;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PermissionDto {
    private UUID id;
    private String name;
    private String resource;
    private String action;
    private String description;
}
