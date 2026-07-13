package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository
        extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    // Necesario para notificar a todos los administradores
    // cuando un usuario crea una nueva solicitud
    List<Usuario> findByRol_Nombre(String nombreRol);
}