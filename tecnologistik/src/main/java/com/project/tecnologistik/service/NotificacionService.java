package com.project.tecnologistik.service;

import com.project.tecnologistik.model.Notificacion;
import com.project.tecnologistik.model.Usuario;
import com.project.tecnologistik.repository.NotificacionRepository;
import com.project.tecnologistik.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacionService(
            NotificacionRepository notificacionRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Notificacion> listarMias(String email) {
        return notificacionRepository.findByDestinatarioEmailOrderByFechaDesc(email);
    }

    public long contarNoLeidas(String email) {
        return notificacionRepository.contarNoLeidas(email);
    }

    @Transactional
    public Notificacion marcarLeida(UUID id, String email) {

        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));

        // Un usuario solo puede marcar como leídas sus propias notificaciones
        if (!notificacion.getDestinatarioEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("No tienes permiso sobre esta notificación");
        }

        notificacion.setLeida(true);

        return notificacionRepository.save(notificacion);
    }

    @Transactional
    public void marcarTodasLeidas(String email) {

        List<Notificacion> pendientes =
                notificacionRepository.findByDestinatarioEmailAndLeidaFalse(email);

        for (Notificacion notificacion : pendientes) {
            notificacion.setLeida(true);
        }

        notificacionRepository.saveAll(pendientes);
    }

    // Notifica a un usuario puntual (usado cuando ADMIN aprueba/rechaza)
    @Transactional
    public void notificarUsuario(String email, String mensaje, String tipo, UUID transaccionId) {

        if (email == null || email.isBlank()) {
            return;
        }

        Notificacion notificacion = new Notificacion();
        notificacion.setDestinatarioEmail(email);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setTransaccionId(transaccionId);

        notificacionRepository.save(notificacion);
    }

    // Notifica a todos los administradores (usado cuando un USUARIO crea una solicitud)
    @Transactional
    public void notificarAdmins(String mensaje, String tipo, UUID transaccionId) {

        List<Usuario> admins = usuarioRepository.findByRol_Nombre("ADMIN");

        for (Usuario admin : admins) {

            Notificacion notificacion = new Notificacion();
            notificacion.setDestinatarioEmail(admin.getEmail());
            notificacion.setMensaje(mensaje);
            notificacion.setTipo(tipo);
            notificacion.setTransaccionId(transaccionId);

            notificacionRepository.save(notificacion);
        }
    }
}
