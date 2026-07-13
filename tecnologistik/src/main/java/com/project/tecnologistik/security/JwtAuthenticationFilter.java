package com.project.tecnologistik.security;

import com.project.tecnologistik.repository.UsuarioRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Filtro que se ejecuta en cada petición HTTP.
 * Lee el header "Authorization: Bearer <token>", valida el JWT
 * y, si es válido, autentica al usuario en el SecurityContext
 * con su rol (ROLE_ADMIN / ROLE_USUARIO) como autoridad.
 *
 * Sin este filtro, SecurityConfig no tiene forma de saber quién
 * hace la petición ni qué rol tiene, aunque el token exista.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            if (jwtService.isTokenValid(token)) {

                String email = jwtService.extractEmail(token);
                String rol = jwtService.extractRol(token);

                // Se valida en BD que el usuario siga activo. Sin esto, un usuario
                // deshabilitado por el admin seguiría teniendo acceso completo hasta
                // que su token expire (hasta 1 hora), aunque ya no debería poder entrar.
                boolean usuarioActivo = usuarioRepository.findByEmail(email)
                        .map(usuario -> Boolean.TRUE.equals(usuario.getEstado()))
                        .orElse(false);

                if (usuarioActivo && SecurityContextHolder.getContext().getAuthentication() == null) {

                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + rol));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            // Token inválido, expirado o corrupto: no se autentica.
            // La petición sigue su curso y será rechazada más adelante
            // por SecurityConfig si el endpoint requiere autenticación.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
