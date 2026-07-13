package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.CuentaRequest;
import com.project.tecnologistik.model.Cuenta;
import com.project.tecnologistik.service.CuentaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cuentas")
public class CuentaController {

    private final CuentaService cuentaService;

    public CuentaController(CuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @GetMapping
    public ResponseEntity<List<Cuenta>> listarCuentas() {
        return ResponseEntity.ok(cuentaService.listarCuentas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuenta> obtenerCuenta(@PathVariable UUID id) {
        return ResponseEntity.ok(cuentaService.obtenerCuenta(id));
    }

    // Consulta JPQL: solo cuentas activas, ordenadas por saldo
    @GetMapping("/activas")
    public ResponseEntity<List<Cuenta>> listarCuentasActivas() {
        return ResponseEntity.ok(cuentaService.listarCuentasActivas());
    }

    @PostMapping
    public ResponseEntity<Cuenta> crearCuenta(@RequestBody CuentaRequest request) {
        return ResponseEntity.ok(cuentaService.crearCuenta(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cuenta> editarCuenta(
            @PathVariable UUID id,
            @RequestBody CuentaRequest request
    ) {
        return ResponseEntity.ok(cuentaService.editarCuenta(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Cuenta> cambiarEstado(@PathVariable UUID id) {
        return ResponseEntity.ok(cuentaService.cambiarEstado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable UUID id) {
        cuentaService.eliminarCuenta(id);
        return ResponseEntity.noContent().build();
    }
}