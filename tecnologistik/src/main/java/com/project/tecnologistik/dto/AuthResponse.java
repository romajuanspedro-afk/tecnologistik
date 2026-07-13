package com.project.tecnologistik.dto;

public class AuthResponse {

    private String token;
    private String tipo;
    private String rol;
    private String nombreCompleto;

    public AuthResponse() {
    }

    public AuthResponse(String token, String tipo, String rol, String nombreCompleto) {
        this.token = token;
        this.tipo = tipo;
        this.rol = rol;
        this.nombreCompleto = nombreCompleto;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }
}
