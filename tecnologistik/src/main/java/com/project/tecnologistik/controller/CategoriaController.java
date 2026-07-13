package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.CategoriaRequest;
import com.project.tecnologistik.model.Categoria;
import com.project.tecnologistik.service.CategoriaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(categoriaService.listarCategorias());
    }

    // Solo categorías activas, para poblar el <select> al registrar una transacción
    @GetMapping("/activas")
    public ResponseEntity<List<Categoria>> listarCategoriasActivas() {
        return ResponseEntity.ok(categoriaService.listarCategoriasActivas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoria(@PathVariable UUID id) {
        return ResponseEntity.ok(categoriaService.obtenerCategoria(id));
    }

    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@RequestBody CategoriaRequest request) {
        return ResponseEntity.ok(categoriaService.crearCategoria(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> editarCategoria(
            @PathVariable UUID id,
            @RequestBody CategoriaRequest request
    ) {
        return ResponseEntity.ok(categoriaService.editarCategoria(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Categoria> cambiarEstado(@PathVariable UUID id) {
        return ResponseEntity.ok(categoriaService.cambiarEstado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable UUID id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
