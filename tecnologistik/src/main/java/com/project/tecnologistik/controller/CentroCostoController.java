package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.CentroCostoRequest;
import com.project.tecnologistik.model.CentroCosto;
import com.project.tecnologistik.service.CentroCostoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/centros-costo")
public class CentroCostoController {

    private final CentroCostoService centroCostoService;

    public CentroCostoController(CentroCostoService centroCostoService) {
        this.centroCostoService = centroCostoService;
    }

    @GetMapping
    public ResponseEntity<List<CentroCosto>> listar() {
        return ResponseEntity.ok(centroCostoService.listar());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<CentroCosto>> listarActivos() {
        return ResponseEntity.ok(centroCostoService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CentroCosto> obtener(@PathVariable UUID id) {
        return ResponseEntity.ok(centroCostoService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<CentroCosto> crear(@RequestBody CentroCostoRequest request) {
        return ResponseEntity.ok(centroCostoService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CentroCosto> editar(
            @PathVariable UUID id,
            @RequestBody CentroCostoRequest request
    ) {
        return ResponseEntity.ok(centroCostoService.editar(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CentroCosto> cambiarEstado(@PathVariable UUID id) {
        return ResponseEntity.ok(centroCostoService.cambiarEstado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable UUID id) {
        centroCostoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
