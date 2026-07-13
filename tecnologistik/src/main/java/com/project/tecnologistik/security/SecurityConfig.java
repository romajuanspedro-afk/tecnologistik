package com.project.tecnologistik.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Público: solo login/registro, documentación y manejo de errores.
                        // OJO: antes esto era "/auth/**" completo, lo que dejaría sin
                        // protección cualquier endpoint nuevo bajo /auth (como el perfil
                        // propio). Se restringe a las dos rutas que sí deben ser públicas;
                        // el resto de /auth/** cae en la regla general de abajo y exige
                        // estar autenticado.
                        .requestMatchers(
                                "/auth/login",
                                "/auth/register",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/webjars/**",
                                "/error"
                        ).permitAll()

                        // Todo lo de usuarios es solo ADMIN (gestión de cuentas de acceso)
                        .requestMatchers("/usuarios/**").hasRole("ADMIN")

                        // Cuentas: cualquier usuario autenticado puede listarlas
                        // (las necesita para crear una transacción/solicitud),
                        // pero solo ADMIN puede crear/editar/eliminar/activar-desactivar
                        .requestMatchers(HttpMethod.GET, "/cuentas/**").authenticated()
                        .requestMatchers("/cuentas/**").hasRole("ADMIN")

                        // Categorías: mismo criterio que cuentas (catálogo administrado
                        // por ADMIN, pero de lectura libre para armar el <select> del formulario)
                        .requestMatchers(HttpMethod.GET, "/categorias/**").authenticated()
                        .requestMatchers("/categorias/**").hasRole("ADMIN")

                        // Centros de costo y proveedores: mismo criterio (catálogos de negocio)
                        .requestMatchers(HttpMethod.GET, "/centros-costo/**").authenticated()
                        .requestMatchers("/centros-costo/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/proveedores/**").authenticated()
                        .requestMatchers("/proveedores/**").hasRole("ADMIN")

                        // Transacciones: aprobar/rechazar es una acción exclusiva de ADMIN
                        .requestMatchers(HttpMethod.PATCH, "/transacciones/*/aprobar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/transacciones/*/rechazar").hasRole("ADMIN")
                        // El resto de operaciones sobre transacciones: cualquier usuario autenticado
                        // (un USUARIO registra sus propias solicitudes, un ADMIN sus movimientos)
                        .requestMatchers("/transacciones/**").authenticated()

                        // Notificaciones: cada usuario ve solo las suyas (filtrado en el
                        // controller/service según el email del token), basta con estar autenticado
                        .requestMatchers("/notificaciones/**").authenticated()

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of("*"));

        config.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
