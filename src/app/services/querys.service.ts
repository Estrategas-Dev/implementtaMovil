import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class QuerysService {
  constructor() {}
  getTables() {
    let tableImplementta = `CREATE TABLE IF NOT EXISTS implementta (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT,adeudo TEXT, SupTerrenoH TEXT, SupConstruccionH TEXT, ValorTerrenoH TEXT, ValorConstruccionH TEXT, ValorCatastralH TEXT,
  SupTerrenoValuado TEXT, ValorCatastralValuado TEXT, SupConstruccionValuado TEXT, ValorTerrenoValuado TEXT, ValorConstruccionValuado TEXT, tareaAsignada TEXT, ultimo_pago TEXT,
  nombre_propietario TEXT, telefono_propietario TEXT, celular_propietario TEXT, correo_electronico_propietario TEXT, fecha_localizacion_propietario TEXT, nombre_usuario TEXT,
  telefono_usuario TEXT, celular_usuario TEXT, correo_electronico_usuario TEXT, id_relacion_propietario INTEGER, motivo_no_pago TEXT, fecha_promesa_pago TEXT, cantidad_pago TEXT,
  id_tipo_deudor INTEGER, id_motivonopago INTEGER, id_servicios INTEGER, id_expectativas INTEGER, id_caracteristicas INTEGER, JSON_quejas_reclamaciones INTEGER, otra_queja_reclamacion TEXT,
  JSON_expectativas_contribuyente TEXT, otra_expectativa_contribuyente TEXT, JSON_caracteristicas_predio TEXT, otra_caracteristica_predio TEXT, id_accion_sugerida TEXT,
  id_uso_suelo_predio TEXT, id_tipo_predio_predio TEXT, calle_predio TEXT, num_interior_predio TEXT, num_exterior_predio TEXT, cp_predio TEXT, colonia_predio TEXT,
  entre_calle1_predio TEXT, entre_calle2_predio TEXT, manzana_predio TEXT, lote_predio TEXT, poblacion_predio TEXT, calle_notificacion TEXT, num_interior_notificacion TEXT,
  num_exterior_notificacion TEXT, cp_notificacion TEXT, colonia_notificacion TEXT, entre_calle1_notificacion TEXT, entre_calle2_notificacion TEXT, manzana_notificacion TEXT,
  lote_notificacion TEXT, referencia_predio TEXT, referencia_notificacion TEXT, direccion_predio TEXT, direccion_notificacion TEXT, solucion_planteada TEXT,
  forma_pago TEXT, observaciones TEXT, id_tarea INTEGER, latitud TEXT, longitud TEXT, tipoServicio TEXT, clave_catastral TEXT, rutaArcgis TEXT, numMedidor TEXT, gestionada INTEGER  NOT NULL DEFAULT 0)`;
    let tableAbogado = `CREATE TABLE IF NOT EXISTS gestionAbogado (id INTEGER PRIMARY KEY AUTOINCREMENT,account TEXT, idResultado INTEGER,idPersona INTEGER,observaciones TEXT, fechaPromesaPago TEXT,latitud TEXT, longitud TEXT,fechaCaptura TEXT,idAspuser TEXT,idTarea INTEGER,fechaAsignacion TEXT, fechaVencimiento TEXT, idTipoServicio INTEGER, idEstatusToma INTEGER, idTipoToma INTEGER, cargado INTEGER NOT NULL DEFAULT 0)`;
    let tableGestor = `CREATE TABLE IF NOT EXISTS gestionGestor (id INTEGER PRIMARY KEY AUTOINCREMENT,account TEXT, idEstatus INTEGER,observaciones TEXT, fechaPromesaPago TEXT,latitud TEXT, longitud TEXT,fechaCaptura TEXT,idAspuser TEXT,idTarea INTEGER,fechaAsignacion TEXT, fechaVencimiento TEXT,idMotivoNoPago INTEGER, motivoNoPago TEXT, idSolucionPlanteada INTEGER,idExpectativasContribuyente INTEGER,otraExpectativaContribuyente TEXT,idCaracteristicaPredio INTEGER,otraCaracteristicaPredio TEXT, idServiciosNoPago INTEGER, idTipoServicio INTEGER, idEstatusToma INTEGER, idTipoToma INTEGER, numeroMedidor TEXT, cargado INTEGER NOT NULL DEFAULT 0)`;
    let tableRecorrido = `CREATE TABLE IF NOT EXISTS recorrido (id INTEGER PRIMARY KEY AUTOINCREMENT, latitud TEXT, longitud TEXT,idAspuser TEXT, fechaCaptura TEXT,cargado INTEGER NOT NULL DEFAULT 0)`;
    let tableFotos = `CREATE TABLE IF NOT EXISTS capturaFotos (id INTEGER PRIMARY KEY AUTOINCREMENT, imagenLocal TEXT, cuenta TEXT,fecha TEXT,rutaBase64 TEXT,idAspUser TEXT,idTarea INTEGER,tipo TEXT,urlImagen TEXT,isSelected INTEGER NOT NULL DEFAULT 0,cargado INTEGER NOT NULL DEFAULT 0)`;
    let tablePropietario = `CREATE TABLE IF NOT EXISTS  propietario (id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT, nombre TEXT, telefono TEXT, celular TEXT , correo TEXT, fecha TEXT, fechaCaptura text, idaspUser text, idRol text, type INTEGER NOT NULL DEFAULT 0, cargado INTEGER NOT NULL DEFAULT 0 )`;
    let tableReductor = `CREATE TABLE IF NOT EXISTS gestionReductor (id INTEGER PRIMARY KEY AUTOINCREMENT,account TEXT,idTarea INTEGER,idDescripcion INTEGER, idObservaciones INTEGER,idaspuser TEXT,lectura TEXT,conclusiones TEXT, personaContacto TEXT, telefonoContacto TEXT,fechaPromesa TEXT, fechaCaptura TEXT, fechaProximaRev TEXT, latitud TEXT, longitud TEXT, niple INTEGER, horaIni TEXT, horaFin TEXT, idTipoServicio INTEGER, idEstatusToma INTEGER, idTipoToma INTEGER, descripcionTomaDirecta TEXT, idDescripcionMulta INTEGER, idDetalle INTEGER, idMedidorTapado INTEGER, idTipoReductor INTEGER, noCincho TEXT, idEstatusRequerimiento INTEGER, cargado INTEGER NOT NULL DEFAULT 0  )`;
    let tableCarta = `CREATE TABLE IF NOT EXISTS gestionCartaInvitacion (id INTEGER PRIMARY KEY AUTOINCREMENT,account TEXT,idTarea INTEGER,idaspuser TEXT,fechaCaptura TEXT,latitud TEXT, longitud TEXT,idTipoServicio INTEGER, numeroMedidor TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`;
    let tableValores = `CREATE TABLE IF NOT EXISTS gestionValoresCatastrales (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, supConstruccion TEXT, supTerreno TEXT, valConstruccion TEXT, valTerreno TEXT, valCatastral TEXT, idTipoSuelo INTEGER, observacion TEXT, idAspUser TEXT, fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0 )` ;
    let tableInspeccion = `CREATE TABLE IF NOT EXISTS gestionInspeccion (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, clave TEXT, serieMedidor TEXT, idTipoClandestino INTEGER, idContratada INTEGER, descripcionClandestino TEXT, idTipoServicioDetectado INTEGER, idCondicionPredio INTEGER, descripcionCondicionPredio TEXT, idInstalacionesEncontradas INTEGER, idTomaMaterial INTEGER, diametroToma TEXT, serieMedidorDetectado TEXT, lecturaMedidor TEXT, idMarcaMedidor INTEGER, diametroMedidor TEXT, idEstadoDescarga INTEGER, observacion TEXT, idTarea INTEGER, idaspuser TEXT, fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`
    let tableDomicilios = `CREATE TABLE IF NOT EXISTS domicilios(id INTEGER PRIMARY KEY AUTOINCREMENT, cuenta TEXT,calle TEXT, manzana TEXT, lote TEXT, numExt  TEXT, numInterior TEXT, colonia TEXT, poblacion TEXT, cp TEXT, entreCalle1 TEXT, entreCalle2 TEXT,referencia TEXT, fechaCaptura text, idaspUser text, idRol text, type INTEGER NOT NULL DEFAULT 0, cargado INTEGER NOT NULL DEFAULT 0)`;
    let tableInspeccionAgua = `CREATE TABLE IF NOT EXISTS gestionInspeccionAgua (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, cuenta TEXT, clave TEXT, ordenInspeccion TEXT, numeroMedidor TEXT, pozoConagua TEXT, idTipoServicio INTEGER, idHallazgo INTEGER, otroHallazgo TEXT, idAspUser TEXT, inspector2 TEXT, inspector3 TEXT, inspector4 TEXT, idTarea INTEGER,  fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`;
    let tableInspeccionPredio = `CREATE TABLE IF NOT EXISTS gestionInspeccionPredio (id INTEGER PRIMARY KEY AUTOINCREMENT, account TEXT, claveCatastral TEXT, nombreContribuyente TEXT, direccion TEXT, orden TEXT, usoSuelo TEXT, observaciones TEXT, avaluo TEXT, idAspUser TEXT, inspector2 TEXT, inspector3 TEXT, inspector4 TEXT, idTarea INTEGER,  fechaCaptura TEXT, latitud TEXT, longitud TEXT, cargado INTEGER NOT NULL DEFAULT 0  )`
    let tables = {
      tableImplementta,
      tableAbogado,
      tableGestor,
      tableRecorrido,
      tableFotos,
      tablePropietario,
      tableReductor,
      tableCarta,
      tableValores,
      tableInspeccion,
      tableDomicilios,
      tableInspeccionAgua,
      tableInspeccionPredio
    };
    return tables;
  }
}
