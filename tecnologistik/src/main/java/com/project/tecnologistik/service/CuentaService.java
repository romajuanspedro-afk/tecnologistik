package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.CuentaRequest;
import com.project.tecnologistik.model.Cuenta;
import com.project.tecnologistik.repository.CuentaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    public CuentaService(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    public List<Cuenta> listarCuentas() {
        return cuentaRepository.findAll();
    }

    public Cuenta obtenerCuenta(UUID id) {
        return cuentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
    }

    public List<Cuenta> listarCuentasActivas() {
        return cuentaRepository.findCuentasActivasOrdenadasPorSaldo();
    }

    @Transactional
    public Cuenta crearCuenta(CuentaRequest request) {
        Cuenta cuenta = new Cuenta();

        cuenta.setNombre(request.getNombre());
        cuenta.setTipo(request.getTipo());
        cuenta.setSaldo(request.getSaldo());
        cuenta.setEstado(true);

        return cuentaRepository.save(cuenta);
    }

    @Transactional
    public Cuenta editarCuenta(UUID id, CuentaRequest request) {
        Cuenta cuenta = obtenerCuenta(id);

        cuenta.setNombre(request.getNombre());
        cuenta.setTipo(request.getTipo());
        cuenta.setSaldo(request.getSaldo());

        return cuentaRepository.save(cuenta);
    }

    @Transactional
    public Cuenta cambiarEstado(UUID id) {
        Cuenta cuenta = obtenerCuenta(id);

        cuenta.setEstado(!cuenta.getEstado());

        return cuentaRepository.save(cuenta);
    }

    @Transactional
    public void eliminarCuenta(UUID id) {
        Cuenta cuenta = obtenerCuenta(id);

        cuentaRepository.delete(cuenta);
    }
}