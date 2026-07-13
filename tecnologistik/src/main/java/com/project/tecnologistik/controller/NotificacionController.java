package com.project.tecnologistik.controller;

import com.project.tecnologistik.model.Notificacion;
import com.project.tecnologistik.service.NotificacionService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    // El email del usuario se toma del token JWT ya validado
    // (ver JwtAuthenticationFilter), nunca de un parámetro que
    // el cliente pudiera manipular para ver notificaciones ajenas.

    @GetMapping
    public ResponseEntity<List<Notificacion>> listarMias(Authentication authentication) {
        return ResponseEntity.ok(
                notificacionService.listarMias(authentication.getName())
        );
    }

    @GetMapping("/no-leidas/contador")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(Authentication authentication) {
        long total = notificacionService.contarNoLeidas(authentication.getName());
        return ResponseEntity.ok(Map.of("total", total));
    }

    @PatchMapping("/{id}/leer")
    public ResponseEntity<Notificacion> marcarLeida(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                notificacionService.marcarLeida(id, authentication.getName())
        );
    }

    @PatchMapping("/leer-todas")
    public ResponseEntity<Void> marcarTodasLeidas(Authentication authentication) {
        notificacionService.marcarTodasLeidas(authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
