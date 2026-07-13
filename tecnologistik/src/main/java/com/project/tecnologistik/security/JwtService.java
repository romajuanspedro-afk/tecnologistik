package com.project.tecnologistik.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;

import java.util.Date;

@Service
public class JwtService {

    // El secreto ya NO vive hardcodeado en el código fuente: se lee de la
    // variable de entorno JWT_SECRET (o de application.properties). Se deja
    // un valor por defecto solo para no romper el arranque en desarrollo
    // local; en producción SIEMPRE se debe definir JWT_SECRET propio.
    private final Key key;

    // Expiración configurable por entorno (en milisegundos). Por defecto 1 hora.
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret:tecnologistik_dev_secret_cambiar_en_produccion_2026}") String secret,
            @Value("${jwt.expiration-ms:3600000}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expiration = expirationMs;
    }

    public String generateToken(String email, String rol) {

        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis() + expiration
                        )
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRol(String token) {
        return extractClaims(token)
                .get("rol", String.class);
    }

    public boolean isTokenValid(String token) {

        Date expiration =
                extractClaims(token).getExpiration();

        return expiration.after(new Date());
    }
}
