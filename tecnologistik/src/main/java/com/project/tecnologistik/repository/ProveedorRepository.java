package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Proveedor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProveedorRepository extends JpaRepository<Proveedor, UUID> {

    boolean existsByNombreIgnoreCase(String nombre);

    @Query("SELECT p FROM Proveedor p WHERE p.estado = true ORDER BY p.nombre ASC")
    List<Proveedor> findActivosOrdenados();
}
