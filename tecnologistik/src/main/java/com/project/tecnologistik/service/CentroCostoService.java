package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.CentroCostoRequest;
import com.project.tecnologistik.model.CentroCosto;
import com.project.tecnologistik.repository.CentroCostoRepository;
import com.project.tecnologistik.repository.TransaccionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CentroCostoService {

    private final CentroCostoRepository centroCostoRepository;
    private final TransaccionRepository transaccionRepository;

    public CentroCostoService(
            CentroCostoRepository centroCostoRepository,
            TransaccionRepository transaccionRepository
    ) {
        this.centroCostoRepository = centroCostoRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public List<CentroCosto> listar() {
        return centroCostoRepository.findAll();
    }

    public List<CentroCosto> listarActivos() {
        return centroCostoRepository.findActivosOrdenados();
    }

    public CentroCosto obtener(UUID id) {
        return centroCostoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro de costo no encontrado"));
    }

    @Transactional
    public CentroCosto crear(CentroCostoRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        if (centroCostoRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe un centro de costo con ese nombre");
        }

        CentroCosto centroCosto = new CentroCosto();
        centroCosto.setNombre(request.getNombre().trim());
        centroCosto.setCodigo(request.getCodigo());
        centroCosto.setEstado(true);

        return centroCostoRepository.save(centroCosto);
    }

    @Transactional
    public CentroCosto editar(UUID id, CentroCostoRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es obligatorio");
        }

        CentroCosto centroCosto = obtener(id);

        boolean cambioNombre = !centroCosto.getNombre().equalsIgnoreCase(request.getNombre().trim());

        if (cambioNombre && centroCostoRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe un centro de costo con ese nombre");
        }

        centroCosto.setNombre(request.getNombre().trim());
        centroCosto.setCodigo(request.getCodigo());

        return centroCostoRepository.save(centroCosto);
    }

    @Transactional
    public CentroCosto cambiarEstado(UUID id) {
        CentroCosto centroCosto = obtener(id);
        centroCosto.setEstado(!centroCosto.getEstado());
        return centroCostoRepository.save(centroCosto);
    }

    @Transactional
    public void eliminar(UUID id) {
        CentroCosto centroCosto = obtener(id);

        if (transaccionRepository.existsByCentroCosto(centroCosto)) {
            throw new RuntimeException(
                    "No se puede eliminar: ya existen transacciones con este centro de costo. Desactívalo en su lugar."
            );
        }

        centroCostoRepository.delete(centroCosto);
    }
}
