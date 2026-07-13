package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.ActualizarPerfilRequest;
import com.project.tecnologistik.dto.AuthResponse;
import com.project.tecnologistik.dto.CambiarPasswordRequest;
import com.project.tecnologistik.dto.LoginRequest;
import com.project.tecnologistik.dto.PerfilResponse;
import com.project.tecnologistik.dto.RegisterRequest;
import com.project.tecnologistik.model.Rol;
import com.project.tecnologistik.model.Usuario;
import com.project.tecnologistik.repository.RolRepository;
import com.project.tecnologistik.repository.UsuarioRepository;
import com.project.tecnologistik.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request, boolean quienRegistraEsAdmin) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        // Si quien hace la petición no es un ADMIN autenticado, no se confía
        // en el rol que venga en el body: se fuerza USUARIO.
        String nombreRol = quienRegistraEsAdmin && request.getRol() != null
                ? request.getRol()
                : "USUARIO";

        Rol rol = rolRepository
                .findByNombre(nombreRol)
                .orElseGet(() -> {
                    Rol nuevoRol = new Rol();
                    nuevoRol.setNombre(nombreRol);
                    return rolRepository.save(nuevoRol);
                });

        Usuario usuario = new Usuario();

        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );

        return new AuthResponse(
                token,
                "Bearer",
                usuario.getRol().getNombre(),
                usuario.getNombreCompleto()
        );
    }

    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(usuario.getEstado())) {
            throw new RuntimeException("Tu cuenta está deshabilitada. Contacta al administrador.");
        }

        boolean passwordCorrecto = passwordEncoder.matches(
                request.getPassword(),
                usuario.getPasswordHash()
        );

        if (!passwordCorrecto) {
            throw new RuntimeException("Password incorrecto");
        }

        String token = jwtService.generateToken(
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );

        return new AuthResponse(
                token,
                "Bearer",
                usuario.getRol().getNombre(),
                usuario.getNombreCompleto()
        );
    }

    // ===== Módulo de perfil (self-service, cualquier usuario autenticado) =====
    // El email siempre se toma del token (Authentication.getName()), nunca de
    // un parámetro que el cliente pudiera manipular para leer/editar otra cuenta.

    public PerfilResponse obtenerPerfil(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new PerfilResponse(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );
    }

    @Transactional
    public PerfilResponse actualizarPerfil(String email, ActualizarPerfilRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getNombreCompleto() == null || request.getNombreCompleto().isBlank()) {
            throw new RuntimeException("El nombre no puede estar vacío");
        }

        usuario.setNombreCompleto(request.getNombreCompleto().trim());
        usuarioRepository.save(usuario);

        return new PerfilResponse(
                usuario.getId(),
                usuario.getNombreCompleto(),
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );
    }

    @Transactional
    public void cambiarPassword(String email, CambiarPasswordRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getPasswordNuevo() == null || request.getPasswordNuevo().length() < 6) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");
        }

        boolean actualCorrecto = passwordEncoder.matches(
                request.getPasswordActual(),
                usuario.getPasswordHash()
        );

        if (!actualCorrecto) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.getPasswordNuevo()));
        usuarioRepository.save(usuario);
    }
}
