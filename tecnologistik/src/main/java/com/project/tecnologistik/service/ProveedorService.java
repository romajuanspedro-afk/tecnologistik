package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.ProveedorRequest;
import com.project.tecnologistik.model.Proveedor;
import com.project.tecnologistik.repository.ProveedorRepository;
import com.project.tecnologistik.repository.TransaccionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;
    private final TransaccionRepository transaccionRepository;

    public ProveedorService(
            ProveedorRepository proveedorRepository,
            TransaccionRepository transaccionRepository
    ) {
        this.proveedorRepository = proveedorRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public List<Proveedor> listar() {
        return proveedorRepository.findAll();
    }

    public List<Proveedor> listarActivos() {
        return proveedorRepository.findActivosOrdenados();
    }

    public Proveedor obtener(UUID id) {
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    @Transactional
    public Proveedor crear(ProveedorRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (proveedorRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe un proveedor con ese nombre");
        }

        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(request.getNombre().trim());
        proveedor.setDocumento(request.getDocumento());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setEmail(request.getEmail());
        proveedor.setEstado(true);

        return proveedorRepository.save(proveedor);
    }

    @Transactional
    public Proveedor editar(UUID id, ProveedorRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        Proveedor proveedor = obtener(id);

        boolean cambioNombre = !proveedor.getNombre().equalsIgnoreCase(request.getNombre().trim());

        if (cambioNombre && proveedorRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe un proveedor con ese nombre");
        }

        proveedor.setNombre(request.getNombre().trim());
        proveedor.setDocumento(request.getDocumento());
        proveedor.setTelefono(request.getTelefono());
        proveedor.setEmail(request.getEmail());

        return proveedorRepository.save(proveedor);
    }

    @Transactional
    public Proveedor cambiarEstado(UUID id) {
        Proveedor proveedor = obtener(id);
        proveedor.setEstado(!proveedor.getEstado());
        return proveedorRepository.save(proveedor);
    }

    @Transactional
    public void eliminar(UUID id) {
        Proveedor proveedor = obtener(id);

        if (transaccionRepository.existsByProveedor(proveedor)) {
            throw new RuntimeException(
                    "No se puede eliminar: ya existen transacciones con este proveedor. Desactívalo en su lugar."
            );
        }

        proveedorRepository.delete(proveedor);
    }
}
