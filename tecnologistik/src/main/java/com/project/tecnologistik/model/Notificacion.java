package com.project.tecnologistik.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Email del usuario que debe ver esta notificación
    @Column(nullable = false)
    private String destinatarioEmail;

    @Column(nullable = false)
    private String mensaje;

    // NUEVA_SOLICITUD / APROBADA / RECHAZADA
    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Boolean leida = false;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    // Referencia opcional a la transacción relacionada,
    // útil para que el frontend pueda enlazar directo a ella
    private UUID transaccionId;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDestinatarioEmail() {
        return destinatarioEmail;
    }

    public void setDestinatarioEmail(String destinatarioEmail) {
        this.destinatarioEmail = destinatarioEmail;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getLeida() {
        return leida;
    }

    public void setLeida(Boolean leida) {
        this.leida = leida;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public UUID getTransaccionId() {
        return transaccionId;
    }

    public void setTransaccionId(UUID transaccionId) {
        this.transaccionId = transaccionId;
    }
}
