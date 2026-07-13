package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    boolean existsByNombreIgnoreCase(String nombre);

    Optional<Categoria> findByNombreIgnoreCase(String nombre);

    // Consulta JPQL explícita: solo categorías activas, ordenadas alfabéticamente
    // (usada para poblar el <select> al crear una transacción)
    @Query("SELECT c FROM Categoria c WHERE c.estado = true ORDER BY c.nombre ASC")
    List<Categoria> findCategoriasActivasOrdenadas();
}
