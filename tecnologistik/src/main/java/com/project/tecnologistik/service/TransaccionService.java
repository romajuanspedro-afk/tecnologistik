package com.project.tecnologistik.service;

import com.project.tecnologistik.dto.ResumenResponse;
import com.project.tecnologistik.dto.TransaccionRequest;
import com.project.tecnologistik.model.Categoria;
import com.project.tecnologistik.model.CentroCosto;
import com.project.tecnologistik.model.Cuenta;
import com.project.tecnologistik.model.Proveedor;
import com.project.tecnologistik.model.Transaccion;
import com.project.tecnologistik.repository.CategoriaRepository;
import com.project.tecnologistik.repository.CentroCostoRepository;
import com.project.tecnologistik.repository.CuentaRepository;
import com.project.tecnologistik.repository.ProveedorRepository;
import com.project.tecnologistik.repository.TransaccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final CuentaRepository cuentaRepository;
    private final CategoriaRepository categoriaRepository;
    private final CentroCostoRepository centroCostoRepository;
    private final ProveedorRepository proveedorRepository;
    private final NotificacionService notificacionService;

    public TransaccionService(
            TransaccionRepository transaccionRepository,
            CuentaRepository cuentaRepository,
            CategoriaRepository categoriaRepository,
            CentroCostoRepository centroCostoRepository,
            ProveedorRepository proveedorRepository,
            NotificacionService notificacionService
    ) {
        this.transaccionRepository = transaccionRepository;
        this.cuentaRepository = cuentaRepository;
        this.categoriaRepository = categoriaRepository;
        this.centroCostoRepository = centroCostoRepository;
        this.proveedorRepository = proveedorRepository;
        this.notificacionService = notificacionService;
    }

    // request.getCentroCostoId()/getProveedorId() son opcionales: si no
    // vienen (null), la transacción simplemente queda sin ese dato, no falla.
    private CentroCosto resolverCentroCosto(UUID id) {
        if (id == null) return null;
        return centroCostoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Centro de costo no encontrado"));
    }

    private Proveedor resolverProveedor(UUID id) {
        if (id == null) return null;
        return proveedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    public List<Transaccion> listarTransacciones() {
        return transaccionRepository.findAll();
    }

    public Transaccion obtenerTransaccion(UUID id) {
        return transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));
    }

    @Transactional
    public Transaccion crearTransaccion(TransaccionRequest request) {

        Cuenta cuenta = cuentaRepository.findById(request.getCuentaId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Transaccion transaccion = new Transaccion();

        transaccion.setTipo(request.getTipo());
        transaccion.setMonto(request.getMonto());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setCategoria(categoria);
        transaccion.setCentroCosto(resolverCentroCosto(request.getCentroCostoId()));
        transaccion.setProveedor(resolverProveedor(request.getProveedorId()));
        transaccion.setFecha(request.getFecha());
        transaccion.setCuenta(cuenta);
        transaccion.setEmailUsuario(request.getEmailUsuario());

        String estado = request.getEstado() != null
                ? request.getEstado()
                : "PENDIENTE";

        transaccion.setEstado(estado);

        Transaccion guardada = transaccionRepository.save(transaccion);

        if ("APROBADO".equalsIgnoreCase(estado)) {
            aplicarMovimiento(
                    cuenta,
                    request.getTipo(),
                    request.getMonto()
            );

            cuentaRepository.save(cuenta);
        }

        // Si un USUARIO crea una solicitud (queda PENDIENTE), se avisa
        // a todos los ADMIN para que la revisen.
        if ("PENDIENTE".equalsIgnoreCase(estado)) {
            String mensaje = String.format(
                    "%s solicitó un %s de S/. %.2f (%s)",
                    request.getEmailUsuario() != null ? request.getEmailUsuario() : "Un usuario",
                    request.getTipo(),
                    request.getMonto(),
                    request.getDescripcion()
            );

            notificacionService.notificarAdmins(mensaje, "NUEVA_SOLICITUD", guardada.getId());
        }

        return guardada;
    }

    @Transactional
    public Transaccion aprobarTransaccion(UUID id) {

        Transaccion transaccion = obtenerTransaccion(id);

        if ("APROBADO".equals(transaccion.getEstado())) {
            return transaccion;
        }

        Cuenta cuenta = transaccion.getCuenta();

        aplicarMovimiento(
                cuenta,
                transaccion.getTipo(),
                transaccion.getMonto()
        );

        cuentaRepository.save(cuenta);

        transaccion.setEstado("APROBADO");

        Transaccion guardada = transaccionRepository.save(transaccion);

        String mensaje = String.format(
                "Tu solicitud de %s por S/. %.2f fue APROBADA",
                transaccion.getTipo(),
                transaccion.getMonto()
        );

        notificacionService.notificarUsuario(
                transaccion.getEmailUsuario(),
                mensaje,
                "APROBADA",
                guardada.getId()
        );

        return guardada;
    }

    @Transactional
    public Transaccion rechazarTransaccion(UUID id) {

        Transaccion transaccion = obtenerTransaccion(id);

        transaccion.setEstado("RECHAZADO");

        Transaccion guardada = transaccionRepository.save(transaccion);

        String mensaje = String.format(
                "Tu solicitud de %s por S/. %.2f fue RECHAZADA",
                transaccion.getTipo(),
                transaccion.getMonto()
        );

        notificacionService.notificarUsuario(
                transaccion.getEmailUsuario(),
                mensaje,
                "RECHAZADA",
                guardada.getId()
        );

        return guardada;
    }

    @Transactional
    public Transaccion editarTransaccion(UUID id, TransaccionRequest request) {

        Transaccion transaccion = obtenerTransaccion(id);

        if ("APROBADO".equals(transaccion.getEstado())) {
            Cuenta cuentaAnterior = transaccion.getCuenta();

            revertirMovimiento(
                    cuentaAnterior,
                    transaccion.getTipo(),
                    transaccion.getMonto()
            );

            cuentaRepository.save(cuentaAnterior);
        }

        Cuenta nuevaCuenta = cuentaRepository.findById(request.getCuentaId())
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

        Categoria nuevaCategoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        transaccion.setTipo(request.getTipo());
        transaccion.setMonto(request.getMonto());
        transaccion.setDescripcion(request.getDescripcion());
        transaccion.setCategoria(nuevaCategoria);
        transaccion.setCentroCosto(resolverCentroCosto(request.getCentroCostoId()));
        transaccion.setProveedor(resolverProveedor(request.getProveedorId()));
        transaccion.setFecha(request.getFecha());
        transaccion.setCuenta(nuevaCuenta);
        transaccion.setEmailUsuario(request.getEmailUsuario());

        if ("APROBADO".equals(transaccion.getEstado())) {
            aplicarMovimiento(
                    nuevaCuenta,
                    request.getTipo(),
                    request.getMonto()
            );

            cuentaRepository.save(nuevaCuenta);
        }

        return transaccionRepository.save(transaccion);
    }

    @Transactional
    public void eliminarTransaccion(UUID id) {

        Transaccion transaccion = obtenerTransaccion(id);

        if ("APROBADO".equals(transaccion.getEstado())) {
            Cuenta cuenta = transaccion.getCuenta();

            revertirMovimiento(
                    cuenta,
                    transaccion.getTipo(),
                    transaccion.getMonto()
            );

            cuentaRepository.save(cuenta);
        }

        transaccionRepository.delete(transaccion);
    }

    public ResumenResponse obtenerResumen() {

        // Antes se calculaba iterando todas las transacciones en Java.
        // Ahora se delega el cálculo a consultas JPQL agregadas (SUM),
        // que es más eficiente y cumple con el requisito de usar JPQL.
        BigDecimal ingresos = transaccionRepository.sumMontoAprobadoPorTipo("INGRESO");
        BigDecimal gastos = transaccionRepository.sumMontoAprobadoPorTipo("GASTO");

        BigDecimal saldoNeto = ingresos.subtract(gastos);

        return new ResumenResponse(ingresos, gastos, saldoNeto);
    }

    // Listado por estado (PENDIENTE / APROBADO / RECHAZADO) usando JPQL
    public List<Transaccion> listarPorEstado(String estado) {
        return transaccionRepository.findByEstado(estado.toUpperCase());
    }

    // Listado de "mis solicitudes" para un usuario (por email) usando JPQL
    public List<Transaccion> listarPorEmailUsuario(String email) {
        return transaccionRepository.findByEmailUsuario(email);
    }

    // Listado por rango de fechas usando JPQL
    public List<Transaccion> listarPorRangoFechas(LocalDate inicio, LocalDate fin) {
        return transaccionRepository.findByFechaBetween(inicio, fin);
    }

    private void aplicarMovimiento(Cuenta cuenta, String tipo, BigDecimal monto) {

        BigDecimal saldoActual = cuenta.getSaldo() == null
                ? BigDecimal.ZERO
                : cuenta.getSaldo();

        if ("INGRESO".equalsIgnoreCase(tipo)) {
            cuenta.setSaldo(saldoActual.add(monto));
        }

        if ("GASTO".equalsIgnoreCase(tipo)) {
            cuenta.setSaldo(saldoActual.subtract(monto));
        }
    }

    private void revertirMovimiento(Cuenta cuenta, String tipo, BigDecimal monto) {

        BigDecimal saldoActual = cuenta.getSaldo() == null
                ? BigDecimal.ZERO
                : cuenta.getSaldo();

        if ("INGRESO".equalsIgnoreCase(tipo)) {
            cuenta.setSaldo(saldoActual.subtract(monto));
        }

        if ("GASTO".equalsIgnoreCase(tipo)) {
            cuenta.setSaldo(saldoActual.add(monto));
        }
    }
}