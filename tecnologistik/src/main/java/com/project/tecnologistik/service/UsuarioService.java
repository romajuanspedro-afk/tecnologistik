package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.UsuarioRequest;
import com.project.tecnologistik.model.Rol;
import com.project.tecnologistik.model.Usuario;
import com.project.tecnologistik.repository.RolRepository;
import com.project.tecnologistik.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuario(UUID id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public Usuario crearUsuario(UsuarioRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        Rol rol = rolRepository
                .findByNombre(request.getRol())
                .orElseGet(() -> rolRepository.save(new Rol(request.getRol())));

        Usuario usuario = new Usuario();

        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(true);

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario editarUsuario(UUID id, UsuarioRequest request) {

        Usuario usuario = obtenerUsuario(id);

        if (!usuario.getEmail().equals(request.getEmail())
                && usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        Rol rol = rolRepository
                .findByNombre(request.getRol())
                .orElseGet(() -> rolRepository.save(new Rol(request.getRol())));

        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setRol(rol);

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario cambiarEstado(UUID id) {

        Usuario usuario = obtenerUsuario(id);

        usuario.setEstado(!Boolean.TRUE.equals(usuario.getEstado()));

        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void eliminarUsuario(UUID id) {

        Usuario usuario = obtenerUsuario(id);

        usuarioRepository.delete(usuario);
    }
}