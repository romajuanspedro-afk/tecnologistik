package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Cuenta;
import com.project.tecnologistik.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CuentaRepository extends JpaRepository<Cuenta, UUID> {

    List<Cuenta> findByUsuario(Usuario usuario);

    // Consulta JPQL explícita (requisito de la rúbrica)
    @Query("SELECT c FROM Cuenta c WHERE c.estado = true ORDER BY c.saldo DESC")
    List<Cuenta> findCuentasActivasOrdenadasPorSaldo();
}
