package com.project.tecnologistik.dto;

import java.math.BigDecimal;

public class CuentaRequest {

    private String nombre;
    private String tipo;
    private BigDecimal saldo;

    public CuentaRequest() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }
}