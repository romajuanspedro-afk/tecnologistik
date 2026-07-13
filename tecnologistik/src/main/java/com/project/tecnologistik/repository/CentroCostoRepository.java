package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.CentroCosto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CentroCostoRepository extends JpaRepository<CentroCosto, UUID> {

    boolean existsByNombreIgnoreCase(String nombre);

    @Query("SELECT c FROM CentroCosto c WHERE c.estado = true ORDER BY c.nombre ASC")
    List<CentroCosto> findActivosOrdenados();
}
