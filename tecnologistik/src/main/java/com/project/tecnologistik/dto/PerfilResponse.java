package com.project.tecnologistik.dto;

import java.util.UUID;

public class PerfilResponse {

    private UUID id;
    private String nombreCompleto;
    private String email;
    private String rol;

    public PerfilResponse() {
    }

    public PerfilResponse(UUID id, String nombreCompleto, String email, String rol) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.rol = rol;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
