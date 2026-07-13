package com.project.tecnologistik.controller;

import com.project.tecnologistik.dto.UsuarioRequest;
import com.project.tecnologistik.model.Usuario;
import com.project.tecnologistik.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.obtenerUsuario(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editarUsuario(
            @PathVariable UUID id,
            @RequestBody UsuarioRequest request
    ) {
        return ResponseEntity.ok(usuarioService.editarUsuario(id, request));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Usuario> cambiarEstado(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.cambiarEstado(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable UUID id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}