package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.ResumenResponse;
import com.project.tecnologistik.dto.TransaccionRequest;
import com.project.tecnologistik.model.Transaccion;
import com.project.tecnologistik.service.TransaccionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transacciones")
public class TransaccionController {

    private final TransaccionService transaccionService;

    public TransaccionController(TransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaccion>> listarTransacciones() {
        return ResponseEntity.ok(transaccionService.listarTransacciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaccion> obtenerTransaccion(@PathVariable UUID id) {
        return ResponseEntity.ok(transaccionService.obtenerTransaccion(id));
    }

    // CREAR SOLICITUD
    @PostMapping
    public ResponseEntity<Transaccion> crearTransaccion(
            @RequestBody TransaccionRequest request
    ) {
        return ResponseEntity.ok(transaccionService.crearTransaccion(request));
    }

    // EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Transaccion> editarTransaccion(
            @PathVariable UUID id,
            @RequestBody TransaccionRequest request
    ) {
        return ResponseEntity.ok(transaccionService.editarTransaccion(id, request));
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTransaccion(@PathVariable UUID id) {
        transaccionService.eliminarTransaccion(id);
        return ResponseEntity.noContent().build();
    }

    // RESUMEN KPI
    @GetMapping("/resumen")
    public ResponseEntity<ResumenResponse> obtenerResumen() {
        return ResponseEntity.ok(transaccionService.obtenerResumen());
    }

    // FILTRO POR ESTADO (usa consulta JPQL)
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Transaccion>> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(transaccionService.listarPorEstado(estado));
    }

    // "MIS SOLICITUDES" POR EMAIL (usa consulta JPQL)
    @GetMapping("/usuario/{email}")
    public ResponseEntity<List<Transaccion>> listarPorEmailUsuario(@PathVariable String email) {
        return ResponseEntity.ok(transaccionService.listarPorEmailUsuario(email));
    }

    // FILTRO POR RANGO DE FECHAS (usa consulta JPQL)
    @GetMapping("/rango")
    public ResponseEntity<List<Transaccion>> listarPorRangoFechas(
            @RequestParam("inicio") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam("fin") @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return ResponseEntity.ok(transaccionService.listarPorRangoFechas(inicio, fin));
    }

    // APROBAR
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<Transaccion> aprobarTransaccion(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                transaccionService.aprobarTransaccion(id)
        );
    }

    // RECHAZAR
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<Transaccion> rechazarTransaccion(
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
                transaccionService.rechazarTransaccion(id)
        );
    }
}