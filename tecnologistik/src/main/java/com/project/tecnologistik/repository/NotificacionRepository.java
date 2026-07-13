package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Notificacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface NotificacionRepository extends JpaRepository<Notificacion, UUID> {

    List<Notificacion> findByDestinatarioEmailOrderByFechaDesc(String destinatarioEmail);

    // Consulta JPQL explícita: contador de no leídas para el badge
    @Query("SELECT COUNT(n) FROM Notificacion n " +
           "WHERE n.destinatarioEmail = :email AND n.leida = false")
    long contarNoLeidas(@Param("email") String email);

    List<Notificacion> findByDestinatarioEmailAndLeidaFalse(String destinatarioEmail);
}
