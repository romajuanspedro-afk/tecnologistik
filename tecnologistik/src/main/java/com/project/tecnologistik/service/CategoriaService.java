package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.CategoriaRequest;
import com.project.tecnologistik.model.Categoria;
import com.project.tecnologistik.repository.CategoriaRepository;
import com.project.tecnologistik.repository.TransaccionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final TransaccionRepository transaccionRepository;

    public CategoriaService(
            CategoriaRepository categoriaRepository,
            TransaccionRepository transaccionRepository
    ) {
        this.categoriaRepository = categoriaRepository;
        this.transaccionRepository = transaccionRepository;
    }

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public List<Categoria> listarCategoriasActivas() {
        return categoriaRepository.findCategoriasActivasOrdenadas();
    }

    public Categoria obtenerCategoria(UUID id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    @Transactional
    public Categoria crearCategoria(CategoriaRequest request) {

        validarRequest(request);

        if (categoriaRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre().trim());
        categoria.setTipo(request.getTipo());
        categoria.setEstado(true);

        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria editarCategoria(UUID id, CategoriaRequest request) {

        validarRequest(request);

        Categoria categoria = obtenerCategoria(id);

        // Si cambia el nombre, verifica que el nuevo nombre no choque con otra categoría
        boolean cambioNombre = !categoria.getNombre().equalsIgnoreCase(request.getNombre().trim());

        if (cambioNombre && categoriaRepository.existsByNombreIgnoreCase(request.getNombre().trim())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        categoria.setNombre(request.getNombre().trim());
        categoria.setTipo(request.getTipo());

        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria cambiarEstado(UUID id) {
        Categoria categoria = obtenerCategoria(id);
        categoria.setEstado(!categoria.getEstado());
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public void eliminarCategoria(UUID id) {
        Categoria categoria = obtenerCategoria(id);

        // A diferencia de otros catálogos del sistema, aquí sí se valida que la
        // categoría no tenga transacciones asociadas antes de borrarla: borrarla
        // de todas formas dejaría movimientos históricos sin categoría válida.
        // Si está en uso, lo correcto es desactivarla (cambiarEstado) en vez de
        // eliminarla, para no perder trazabilidad de reportes pasados.
        if (transaccionRepository.existsByCategoria(categoria)) {
            throw new RuntimeException(
                    "No se puede eliminar: ya existen transacciones con esta categoría. Desactívala en su lugar."
            );
        }

        categoriaRepository.delete(categoria);
    }

    private void validarRequest(CategoriaRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }

        if (request.getTipo() == null || request.getTipo().trim().isEmpty()) {
            throw new RuntimeException("El tipo de la categoría es obligatorio");
        }
    }
}
