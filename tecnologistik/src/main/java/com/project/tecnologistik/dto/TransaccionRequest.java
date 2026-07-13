package com.project.tecnologistik.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class TransaccionRequest {

    private String tipo;
    private BigDecimal monto;
    private String descripcion;
    private UUID categoriaId;
    private UUID centroCostoId;
    private UUID proveedorId;
    private LocalDate fecha;
    private UUID cuentaId;

    // NUEVO
    private String estado;

    // NUEVO
    private String emailUsuario;

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public UUID getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(UUID categoriaId) {
        this.categoriaId = categoriaId;
    }

    public UUID getCentroCostoId() {
        return centroCostoId;
    }

    public void setCentroCostoId(UUID centroCostoId) {
        this.centroCostoId = centroCostoId;
    }

    public UUID getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(UUID proveedorId) {
        this.proveedorId = proveedorId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public UUID getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(UUID cuentaId) {
        this.cuentaId = cuentaId;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getEmailUsuario() {
        return emailUsuario;
    }

    public void setEmailUsuario(String emailUsuario) {
        this.emailUsuario = emailUsuario;
    }
}