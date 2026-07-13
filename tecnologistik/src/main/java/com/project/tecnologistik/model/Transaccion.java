package com.project.tecnologistik.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // INGRESO / GASTO
    private String tipo;

    // MONTO
    private BigDecimal monto;

    // DESCRIPCIÓN
    private String descripcion;

    // CATEGORÍA (antes era texto libre; ahora referencia al catálogo
    // gestionado en /categorias, para evitar duplicados por typos como
    // "Ventas" / "ventas" / "Venta")
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // CENTRO DE COSTO (opcional): a qué área/proyecto del negocio pertenece
    // el movimiento, útil para reportes por departamento
    @ManyToOne
    @JoinColumn(name = "centro_costo_id")
    private CentroCosto centroCosto;

    // PROVEEDOR (opcional, normalmente usado en GASTO): a quién se le pagó
    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    // FECHA
    private LocalDate fecha;

    // PENDIENTE / APROBADO / RECHAZADO
    private String estado = "PENDIENTE";

    // NUEVO
    // PARA SABER QUIÉN REGISTRÓ
    private String emailUsuario;

    // RELACIÓN CON CUENTA
    @ManyToOne
    @JoinColumn(name = "cuenta_id")
    private Cuenta cuenta;

    // RELACIÓN CON USUARIO
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public CentroCosto getCentroCosto() {
        return centroCosto;
    }

    public void setCentroCosto(CentroCosto centroCosto) {
        this.centroCosto = centroCosto;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
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

    public Cuenta getCuenta() {
        return cuenta;
    }

    public void setCuenta(Cuenta cuenta) {
        this.cuenta = cuenta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}