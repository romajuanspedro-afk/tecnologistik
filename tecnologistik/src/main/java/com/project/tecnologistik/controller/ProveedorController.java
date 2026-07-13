package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.ProveedorRequest;
import com.project.tecnologistik.model.Proveedor;
import com.project.tecnologistik.service.ProveedorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @GetMapping
    public ResponseEntity<List<Proveedor>> listar() {
        return ResponseEntity.ok(proveedorService.listar());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Proveedor>> listarActivos() {
        return ResponseEntity.ok(proveedorService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> obtener(@PathVariable UUID id) {
        return ResponseEntity.ok(proveedorService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<Proveedor> crear(@RequestBody ProveedorRequest request) {
        return ResponseEntity.ok(proveedorService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> editar(
            @PathVariable UUID id,
            @RequestBody ProveedorRequest request
    ) {
        return ResponseEntity.ok(proveedorService.editar(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Proveedor> cambiarEstado(@PathVariable UUID id) {
        return ResponseEntity.ok(proveedorService.cambiarEstado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        proveedorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
