package com.project.tecnologistik.dto;

import java.math.BigDecimal;

public class ResumenResponse {

    private BigDecimal ingresos;
    private BigDecimal gastos;
    private BigDecimal saldoNeto;

    public ResumenResponse(BigDecimal ingresos, BigDecimal gastos, BigDecimal saldoNeto) {
        this.ingresos = ingresos;
        this.gastos = gastos;
        this.saldoNeto = saldoNeto;
    }

    public BigDecimal getIngresos() {
        return ingresos;
    }

    public void setIngresos(BigDecimal ingresos) {
        this.ingresos = ingresos;
    }

    public BigDecimal getGastos() {
        return gastos;
    }

    public void setGastos(BigDecimal gastos) {
        this.gastos = gastos;
    }

    public BigDecimal getSaldoNeto() {
        return saldoNeto;
    }

    public void setSaldoNeto(BigDecimal saldoNeto) {
        this.saldoNeto = saldoNeto;
    }
}