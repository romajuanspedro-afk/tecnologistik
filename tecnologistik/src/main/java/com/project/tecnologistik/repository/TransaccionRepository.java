package com.project.tecnologistik.repository;

import com.project.tecnologistik.model.Categoria;
import com.project.tecnologistik.model.CentroCosto;
import com.project.tecnologistik.model.Proveedor;
import com.project.tecnologistik.model.Transaccion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TransaccionRepository extends JpaRepository<Transaccion, UUID> {

    // Consultas JPQL explícitas (requisito de la rúbrica)

    @Query("SELECT t FROM Transaccion t WHERE t.estado = :estado ORDER BY t.fecha DESC")
    List<Transaccion> findByEstado(@Param("estado") String estado);

    @Query("SELECT t FROM Transaccion t WHERE t.emailUsuario = :email ORDER BY t.fecha DESC")
    List<Transaccion> findByEmailUsuario(@Param("email") String email);

    @Query("SELECT t FROM Transaccion t WHERE t.fecha BETWEEN :inicio AND :fin ORDER BY t.fecha DESC")
    List<Transaccion> findByFechaBetween(
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t " +
           "WHERE t.tipo = :tipo AND t.estado = 'APROBADO'")
    BigDecimal sumMontoAprobadoPorTipo(@Param("tipo") String tipo);

    // Usado por CategoriaService para impedir borrar una categoría que ya
    // tiene movimientos registrados (evitaría dejar transacciones huérfanas)
    boolean existsByCategoria(Categoria categoria);

    // Mismo criterio para centros de costo y proveedores
    boolean existsByCentroCosto(CentroCosto centroCosto);

    boolean existsByProveedor(Proveedor proveedor);
}

