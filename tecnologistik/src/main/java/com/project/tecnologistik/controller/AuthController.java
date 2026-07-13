package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.ActualizarPerfilRequest;
import com.project.tecnologistik.dto.AuthResponse;
import com.project.tecnologistik.dto.CambiarPasswordRequest;
import com.project.tecnologistik.dto.LoginRequest;
import com.project.tecnologistik.dto.PerfilResponse;
import com.project.tecnologistik.dto.RegisterRequest;
import com.project.tecnologistik.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request,
            Authentication authentication
    ) {
        // /auth/register es público (para que cualquiera pueda crear su cuenta),
        // pero SOLO un ADMIN ya autenticado puede asignar un rol distinto de
        // USUARIO. Si no hay un ADMIN detrás de la petición, se ignora el rol
        // que venga en el body y se fuerza USUARIO, para evitar que cualquiera
        // se autoasigne el rol de administrador llamando directo a la API.
        boolean quienRegistraEsAdmin = authentication != null
                && authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch("ROLE_ADMIN"::equals);

        return ResponseEntity.ok(
                authService.register(request, quienRegistraEsAdmin)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // ===== Perfil propio (cualquier usuario autenticado, ADMIN o USUARIO) =====
    // Estos 3 endpoints requieren estar autenticado: al no estar en la lista
    // de rutas públicas de SecurityConfig, quedan cubiertas por la regla
    // general "anyRequest().authenticated()".

    @GetMapping("/me")
    public ResponseEntity<PerfilResponse> obtenerMiPerfil(Authentication authentication) {
        return ResponseEntity.ok(
                authService.obtenerPerfil(authentication.getName())
        );
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> actualizarMiPerfil(
            @RequestBody ActualizarPerfilRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                authService.actualizarPerfil(authentication.getName(), request)
        );
    }

    @PutMapping("/password")
    public ResponseEntity<Void> cambiarMiPassword(
            @RequestBody CambiarPasswordRequest request,
            Authentication authentication
    ) {
        authService.cambiarPassword(authentication.getName(), request);
        return ResponseEntity.noContent().build();
    }
}
