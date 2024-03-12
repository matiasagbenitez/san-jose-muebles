'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {

  async up(queryInterface) {
    const list = [

      // EGGER
      {
        "id": 1, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "H1145 ST10",
        "name": "Melamina EGGER Roble Bardolino natural",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 52500, "id_currency": 1

      },
      {
        "id": 2, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "U999 ST19",
        "name": "Melamina EGGER Negro",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 35, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 53000, "id_currency": 1

      },
      {
        "id": 3, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "H3133 ST12",
        "name": "Melamina EGGER Roble Davos trufa marrón",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 29, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 55750, "id_currency": 1

      },
      {
        "id": 4, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "H3146 ST19",
        "name": "Melamina EGGER Roble Lorenzo arena",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 27, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 55800, "id_currency": 1

      },
      {
        "id": 5, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "H3158 ST19",
        "name": "Melamina EGGER Roble Vicenza gris",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 35, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 57500, "id_currency": 1

      },
      {
        "id": 6, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "H3332 ST10",
        "name": "Melamina EGGER Roble de Nebraska gris",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 36, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 54900, "id_currency": 1

      },
      {
        "id": 7, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "W954 ST14",
        "name": "Melamina EGGER Blanco",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 22, "inc_stock": 20, "min_stock": 30, "ideal_stock": 40,
        "last_price": 52000, "id_currency": 1

      },
      {
        "id": 8, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "U727 ST9",
        "name": "Melamina EGGER Gris arcilla",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 18, "inc_stock": 15, "min_stock": 20, "ideal_stock": 30,
        "last_price": 55400, "id_currency": 1

      },
      {
        "id": 9, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "U732 ST9",
        "name": "Melamina EGGER Gris macadán",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 15, "inc_stock": 15, "min_stock": 20, "ideal_stock": 30,
        "last_price": 55400, "id_currency": 1

      },
      {
        "id": 10, "id_brand": 1, "id_category": 2, "id_unit": 1,
        "code": "U767 ST9",
        "name": "Melamina EGGER Gris cubanita",
        "description": "Melamina base aglomerado. Marca EGGER. Espesor 18mm. Ancho 183cm. Largo 260cm. Diseño direccional. Resistente a la humedad. Rendimiento 4.76 m2.",
        "actual_stock": 32, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 54800, "id_currency": 1

      },



      // MASISA
      {
        "id": 11, "id_brand": 2, "id_category": 2, "id_unit": 1,
        "code": "",
        "name": "Melamina MASISA Ramio Café",
        "description": "Melamina base aglomerado. Marca MASISA. 18mm x 1830mm x 2600mm. Rendimiento 4.76 m2.",
        "actual_stock": 16, "inc_stock": 0, "min_stock": 10, "ideal_stock": 20,
        "last_price": 44750, "id_currency": 1

      },
      {
        "id": 12, "id_brand": 2, "id_category": 2, "id_unit": 1,
        "code": "",
        "name": "Melamina MASISA Roble miel",
        "description": "Melamina base aglomerado. Marca MASISA. 18mm x 1830mm x 2600mm. Rendimiento 4.76 m2.",
        "actual_stock": 14, "inc_stock": 0, "min_stock": 10, "ideal_stock": 20,
        "last_price": 44500, "id_currency": 1

      },
      {
        "id": 13, "id_brand": 2, "id_category": 2, "id_unit": 1,
        "code": "",
        "name": "Melamina MASISA Teca limo",
        "description": "Melamina base aglomerado. Marca MASISA. 18mm x 1830mm x 2600mm. Rendimiento 4.76 m2.",
        "actual_stock": 16, "inc_stock": 0, "min_stock": 10, "ideal_stock": 20,
        "last_price": 44750, "id_currency": 1

      },
      {
        "id": 14, "id_brand": 2, "id_category": 2, "id_unit": 1,
        "code": "",
        "name": "Melamina MASISA Nogal habano",
        "description": "Melamina base aglomerado. Marca MASISA. 18mm x 1830mm x 2600mm. Rendimiento 4.76 m2.",
        "actual_stock": 18, "inc_stock": 0, "min_stock": 10, "ideal_stock": 20,
        "last_price": 46000, "id_currency": 1

      },



      // RUEDAS GREENWAY
      {
        "id": 15, "id_brand": 3, "id_category": 4, "id_unit": 1,
        "code": "GWRUE08",
        "name": "Rueda GREENWAY modelo 08 sin freno",
        "description": "Rueda para muebles. Marca GREENWAY. Diámetro 50mm. Ancho 20mm. Capacidad de carga 30kg.",
        "actual_stock": 50, "inc_stock": 0, "min_stock": 30, "ideal_stock": 0,
        "last_price": 1700, "id_currency": 1
      },
      {
        "id": 17, "id_brand": 3, "id_category": 4, "id_unit": 1,
        "code": "GWRUE09",
        "name": "Rueda GREENWAY modelo 09 con freno",
        "description": "Rueda para muebles. Marca GREENWAY. Diámetro 50mm. Ancho 20mm. Capacidad de carga 30kg.",
        "actual_stock": 50, "inc_stock": 0, "min_stock": 30, "ideal_stock": 0,
        "last_price": 2500, "id_currency": 1
      },


      // PATAS GREENWAY
      {
        "id": 18, "id_brand": 3, "id_category": 5, "id_unit": 1,
        "code": "GWPP01",
        "name": "Pata GREENWAY modelo 01 regulable",
        "description": "Pata para muebles. Marca GREENWAY. Altura regulable 100-150mm. Capacidad de carga 100kg.",
        "actual_stock": 29, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 0, "id_currency": 1
      },
      {
        "id": 19, "id_brand": 3, "id_category": 5, "id_unit": 1,
        "code": "GWPP02",
        "name": "Pata GREENWAY modelo 02 regulable",
        "description": "Pata para muebles. Marca GREENWAY. Altura regulable 100-150mm. Capacidad de carga 100kg.",
        "actual_stock": 33, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 0, "id_currency": 1
      },
      {
        "id": 20, "id_brand": 3, "id_category": 5, "id_unit": 1,
        "code": "GWPP03",
        "name": "Pata GREENWAY modelo 03 regulable",
        "description": "Pata para muebles. Marca GREENWAY. Altura regulable 100-150mm. Capacidad de carga 100kg.",
        "actual_stock": 30, "inc_stock": 0, "min_stock": 20, "ideal_stock": 30,
        "last_price": 0, "id_currency": 1
      },


      // --- BISAGRAS ---

      // GREENWAY (7)
      {
        "id": 21, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35C18",
        "name": "Bisagra GREENWAY Doble acción base 4 agujeros",
        "description": "Bisagra cazoleta 35mm. Nueva base, Más resistente. Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 3000, "id_currency": 1
      },
      {
        "id": 22, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35C18L",
        "name": "Bisagra GREENWAY Doble acción light base 4 agujeros",
        "description": "Bisagra cazoleta 35mm versión Light. Nueva base, Más resistente. Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 2700, "id_currency": 1
      },
      {
        "id": 23, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35C183D",
        "name": "Bisagra GREENWAY Cierre suave Base 3D",
        "description": "Base 3D con regulación en 3 direcciones. Únicas doble acción.  Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 3150, "id_currency": 1
      },
      {
        "id": 24, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35C18CS2",
        "name": "Bisagra GREENWAY Cierre Suave Two ways",
        "description": "Cierre suave en dos direcciones. Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 3800, "id_currency": 1
      },
      {
        "id": 25, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35INT",
        "name": "Bisagra GREENWAY Rinconera 135°",
        "description": "Bisagra cazoleta 35mm. Apertura 135°. Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 3400, "id_currency": 1
      },
      {
        "id": 26, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35C175CS",
        "name": "Bisagra GREENWAY Rinconera 180° Cierre Suave",
        "description": "Bisagra rinconera 180°. Única con sistema cierre suave. Montaje Clip On. Base 4 agujeros.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 3700, "id_currency": 1
      },
      {
        "id": 27, "id_brand": 3, "id_category": 6, "id_unit": 1,
        "code": "GW35AC",
        "name": "Bisagra GREENWAY Pilastra Ángulo ciego",
        "description": "Bisagra pilastra para ángulo ciego. Apertura 95°. Codo 0, 9 y 18 mm.",
        "actual_stock": 135, "inc_stock": 0, "min_stock": 100, "ideal_stock": 200,
        "last_price": 4100, "id_currency": 1
      },

      // EUROHARD (3)
      {
        "id": 28, "id_brand": 6, "id_category": 6, "id_unit": 1,
        "code": "EHB35175",
        "name": "BISAGRA EUROHARD ESPECIAL CON BASE. APERTURA 175°",
        "description": "Acero niquelado y zamak niquelado",
        "actual_stock": 68, "inc_stock": 0, "min_stock": 50, "ideal_stock": 0,
        "last_price": 3050, "id_currency": 1
      },
      {
        "id": 29, "id_brand": 6, "id_category": 6, "id_unit": 1,
        "code": "EHB35C0AL",
        "name": "Bisagra EUROHARD para marco de aluminio con base. Codo 0",
        "description": "Acero niquelado y zamak niquelado",
        "actual_stock": 70, "inc_stock": 0, "min_stock": 50, "ideal_stock": 0,
        "last_price": 3000, "id_currency": 1
      },
      {
        "id": 30, "id_brand": 6, "id_category": 6, "id_unit": 1,
        "code": "EHB35C9AL",
        "name": "Bisagra EUROHARD para marco de aluminio con base. Codo 9",
        "description": "Acero niquelado y zamak niquelado",
        "actual_stock": 75, "inc_stock": 0, "min_stock": 50, "ideal_stock": 0,
        "last_price": 3140, "id_currency": 1
      },


      // EXPULSORES
      // EUROHARD (2)
      {
        "id": 31, "id_brand": 6, "id_category": 7, "id_unit": 1,
        "code": "EHSEXGG",
        "name": "Expulsor EUROHARD. Push open simple con cabeza magnética",
        "description": "",
        "actual_stock": 120, "inc_stock": 0, "min_stock": 80, "ideal_stock": 100,
        "last_price": 500, "id_currency": 1
      },
      {
        "id": 32, "id_brand": 6, "id_category": 7, "id_unit": 1,
        "code": "",
        "name": "Expulsor EUROHARD. Push Open simple con base integrada",
        "description": "Imán expulsor simple Push Open con base integrada",
        "actual_stock": 120, "inc_stock": 0, "min_stock": 80, "ideal_stock": 100,
        "last_price": 500, "id_currency": 1
      },



      // GUÍAS TIPO Z
      {
        "id": 33, "id_brand": 6, "id_category": 8, "id_unit": 2,
        "code": "EHE300B",
        "name": "Guías EUROHARD tipo Z 300mm",
        "description": "Capacidad de carga 20kg. Acero de 0,8 mm. de espesor antes de la pintura. Recubrimiento epoxi blanco.",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 20, "ideal_stock": 40,
        "last_price": 1990, "id_currency": 1
      },


      // --- BISAGRAS ---

      // GREENWAY (6)
      {
        "id": 34, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GW01",
        "name": "Guía telescópica GREENWAY 45mm",
        "description": "Apertura total de cajón. Espesor de metal 1.2 – 1.2 – 1.2 mm. 45kg. de capacidad de carga por par. Rodamiento de bolillas de acero",
        "actual_stock": 60, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 16500, "id_currency": 1
      },
      {
        "id": 35, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GW05",
        "name": "Guía telescópica GREENWAY 45mm CIERRE SUAVE",
        "description": "Apertura total de cajón. Espesor de metal 1.2 – 1.2 – 1.2 mm. 45kg. de capacidad de carga por par. Sistema Soft Closing de cierre de cajón amortiguado.",
        "actual_stock": 60, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 15500, "id_currency": 1
      },
      {
        "id": 36, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GW06",
        "name": "Guía telescópica GREENWAY 45mm PUSH OPEN",
        "description": "Apertura total de cajón. Espesor de metal 1.2 – 1.2 – 1.2 mm. 45kg. de capacidad de carga por par. Sistema Push Open de apertura de cajón sin tirador.",
        "actual_stock": 65, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 16720, "id_currency": 1
      },
      {
        "id": 37, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GWSB",
        "name": "Guía telescópica GREENWAY sistema lateral slim",
        "description": "Sistema lateral slim Con correderas Ocultas cierre suave. Nuevo sistema slim cierre suave sincronizado + mayor aprovechamiento de espacio del cajón​.",
        "actual_stock": 66, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 15800, "id_currency": 1
      },
      {
        "id": 38, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GW08",
        "name": "Guía telescópica GREENWAY oculta cierre suave",
        "description": "Apertura total de cajón. 30kg. de capacidad máxima de carga por par. Rodamiento de bolillas de acero. Desmontaje de cajón mediante soportes de zinc aleado. Espesor metal: 1.8 x 1.5 x 1.2 mm.",
        "actual_stock": 64, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 16900, "id_currency": 1
      },
      {
        "id": 39, "id_brand": 3, "id_category": 8, "id_unit": 2,
        "code": "GW07",
        "name": "Guía telescópica GREENWAY oculta. cierre suave + push open",
        "description": "Apertura total de cajón. 30kg. de capacidad máxima de carga por par. Rodamiento de bolillas de acero. Desmontaje de cajón mediante soportes de zinc aleado. Espesor metal: 1.8 x 1.5 x 1.2 mm",
        "actual_stock": 77, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 18500, "id_currency": 1
      },

      // HAFELE (4)
      {
        "id": 40, "id_brand": 4, "id_category": 8, "id_unit": 2,
        "code": "494.02.370",
        "name": "Guía telescópica HAFELE común 250 mm color negro",
        "description": "Acero galvanizado negro. Con autocierre y amortiguación integrado. Medidas: 250mm largo x 12,7mm espesor x 45,7mm altura",
        "actual_stock": 71, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 18000, "id_currency": 1
      },
      {
        "id": 41, "id_brand": 4, "id_category": 8, "id_unit": 2,
        "code": "494.02.061",
        "name": "Guía telescópica HAFELE común 300mm color negro",
        "description": "Acero galvanizado negro. Con autocierre y amortiguación integrado. Medidas: 300mm largo x 12,7mm espesor x 45,7mm altura",
        "actual_stock": 75, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 18750, "id_currency": 1
      },
      {
        "id": 42, "id_brand": 4, "id_category": 8, "id_unit": 2,
        "code": "494.02.366",
        "name": "Guía telescópica HAFELE común 550mm",
        "description": "Acero galvanizado. Con autocierre y amortiguación integrado. Medidas: 550mm largo x 12,7mm espesor x 45,7mm altura",
        "actual_stock": 61, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 19500, "id_currency": 1
      },
      {
        "id": 43, "id_brand": 4, "id_category": 8, "id_unit": 2,
        "code": "494.02.071",
        "name": "Guía telescópica HAFELE cierre suave 300mm color negro",
        "description": "Acero galvanizado negro. Con autocierre y amortiguación integrado (suave). Medidas: 300mm largo x 12,7mm espesor x 45,7mm altura",
        "actual_stock": 62, "inc_stock": 0, "min_stock": 30, "ideal_stock": 80,
        "last_price": 20100, "id_currency": 1
      },


      // --- MANIJAS ---
      // GREENWAY
      {
        "id": 44, "id_brand": 3, "id_category": 11, "id_unit": 1,
        "code": "GWM03128N",
        "name": "Tirador GREENWAY modelo 03 recto 128mm negro",
        "description": "",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 30, "ideal_stock": 70,
        "last_price": 0, "id_currency": 1
      },
      {
        "id": 45, "id_brand": 3, "id_category": 11, "id_unit": 1,
        "code": "GWM03128",
        "name": "Tirador GREENWAY modelo 03 recto 128mm",
        "description": "",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 30, "ideal_stock": 70,
        "last_price": 0, "id_currency": 1
      },

      // HAFELE
      {
        "id": 46, "id_brand": 4, "id_category": 11, "id_unit": 1,
        "code": "151.76.902",
        "name": "Tirador HAFELE de embutir 128mm",
        "description": "Acabado mate. Diferencia entre agujeros de montaje 128mm. Largo 143mm. Altura 34mm. Profundidad 12mm.",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 20, "ideal_stock": 0,
        "last_price": 0, "id_currency": 1
      },
      {
        "id": 47, "id_brand": 4, "id_category": 11, "id_unit": 1,
        "code": "110.71.902",
        "name": "Tirador HAFELE recto plata 64mm",
        "description": "Acabado mate. Diferencia entre agujeros de montaje 64mm. Largo 76mm. Altura 18mm. Profundidad 12mm.",
        "actual_stock": 40, "inc_stock": 0, "min_stock": 20, "ideal_stock": 0,
        "last_price": 0, "id_currency": 1
      },


      // --- ACCESORIOS DE COCINA ---
      // HAFELE
      {
        "id": 48, "id_brand": 4, "id_category": 12, "id_unit": 1,
        "code": "540.32.233",
        "name": "Canasto extraible bajomesada HAFELE modulo 600mm",
        "description": "Canasto Bajo Mesada Escurreplatos mod. 600mm hafele",
        "actual_stock": 8, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 75000, "id_currency": 1
      },
      {
        "id": 49, "id_brand": 4, "id_category": 12, "id_unit": 1,
        "code": "545.28.253",
        "name": "Canasto Extraible Bajomesada HAFELE 2 Niveles 245mm",
        "description": "",
        "actual_stock": 4, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 142000, "id_currency": 1
      },
      {
        "id": 50, "id_brand": 5, "id_category": 12, "id_unit": 1,
        "code": "556.62.624",
        "name": "Cubiertero HAFELE Cajon 390-350mm X 500",
        "description": "Cubiertero HAFELE Cajon 390-350mm X 500. Plástico blanco. 390*350*500mm",
        "actual_stock": 15, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 38000, "id_currency": 1
      },
      {
        "id": 51, "id_brand": 5, "id_category": 12, "id_unit": 1,
        "code": "556.62.624",
        "name": "Cubiertero Cajon 440-400mm X 500 Mm Hafele Cocina Mueble",
        "description": "Cubiertero Cajon 440-400mm X 500 Mm Hafele Cocina Mueble. Plástico blanco. 440*400*500mm",
        "actual_stock": 15, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 38500, "id_currency": 1
      },
      {
        "id": 52, "id_brand": 5, "id_category": 12, "id_unit": 1,
        "code": "UN-3N-200",
        "name": "UNIHOPPER CANASTO LATERAL 3 NIVELES CROMADO CON PISO ANTIDESLIZANTE",
        "description": "Canasto lateral 3 niveles con piso antideslizante. Con canasto lateral “izquierdo”.  Ancho 200mm, 152*490*585mm, Incluye correderas laterales con Cierre Suave.",
        "actual_stock": 7, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 57000, "id_currency": 1
      },
      {
        "id": 53, "id_brand": 5, "id_category": 12, "id_unit": 1,
        "code": "UN-2N-300",
        "name": "UNIHOPPER CANASTO FRONTAL EXTRAIBLE DE 2 NIVELES CON PISO ANTIDESLIZANTE",
        "description": "Incluye correderas ocultas inferiores con Cierre Suave, Ancho 300 mm, 240*460*500mm. Ancho x fondo x alto (mm): 355 x 300 x 380",
        "actual_stock": 7, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 59500, "id_currency": 1
      },
      {
        "id": 54, "id_brand": 7, "id_category": 12, "id_unit": 1,
        "code": "S-2253",
        "name": "PORTARESIDUOS STARAX CILíNDRICO ACERO INOXIDABLE TAPA AUTOMáTICA",
        "description": "Tapa Automática Volumen interno 10lt. Panel derecho o izquierdo. Cuerpo de acero inoxidable y negro.",
        "actual_stock": 16, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 22700, "id_currency": 1
      },
      {
        "id": 55, "id_brand": 7, "id_category": 12, "id_unit": 1,
        "code": "S-2392",
        "name": "PORTARESIDUOS DOBLE 12+12 LT",
        "description": "Papelera Cuerpo Plástico con Riel Telescópico 12 + 12 Lt.	Ancho x fondo x alto (mm): 260 x 440 x 400",
        "actual_stock": 16, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 30500, "id_currency": 1
      },

      // RINCONEROS
      {
        "id": 56, "id_brand": 4, "id_category": 14, "id_unit": 1,
        "code": "542.57.222",
        "name": "Canasto Giratorio HAFELE 3/4 Ø700mm Acero Cromado",
        "description": "Largo 700mm. Peso máximo soportado 40kg. Acero. Bandeja giratoria individual. Regulación en altura de cada bandeja. Fijación con tornillos.",
        "actual_stock": 12, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 97575, "id_currency": 1
      },
      {
        "id": 57, "id_brand": 4, "id_category": 14, "id_unit": 1,
        "code": "548.16.202",
        "name": "Rinconera Extraible HAFELE - Magic Corner",
        "description": "Aplicación: Para rincones de 900 a 1000 mm para ancho de puerta 450-500 mm. Estructura en acero, cestos de alambre. Carga útil 40kg",
        "actual_stock": 2, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 750000, "id_currency": 1
      },
      {
        "id": 58, "id_brand": 5, "id_category": 14, "id_unit": 1,
        "code": "U-731-02-D",
        "name": "Rinconero tipo lemans UNIHOPPER reforzado 2 niveles DERECHO",
        "description": "Bandeja 'S' reforzada cierre suave 2 niveles. Lado derecho. Antideslizante. Para módulo 900mm. Carga 15kg por bandeja.",
        "actual_stock": 6, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 145500, "id_currency": 1
      },
      {
        "id": 59, "id_brand": 5, "id_category": 14, "id_unit": 1,
        "code": "U-731-02-I",
        "name": "Rinconero tipo lemans UNIHOPPER reforzado 2 niveles IZQUIERDO",
        "description": "Bandeja 'S' reforzada cierre suave 2 niveles. Lado izquierdo. Antideslizante. Para módulo 900mm. Carga 15kg por bandeja.",
        "actual_stock": 6, "inc_stock": 0, "min_stock": 0, "ideal_stock": 0,
        "last_price": 145500, "id_currency": 1
      },
    ];


    const timestamp = new Date();
    const products = list.map(item => {
      return {
        id: item.id,
        id_brand: item.id_brand,
        id_category: item.id_category,
        id_unit: item.id_unit,
        code: item.code.toUpperCase(),
        name: item.name.toUpperCase(),
        description: item.description.toUpperCase(),
        actual_stock: item.actual_stock,
        inc_stock: item.inc_stock,
        min_stock: item.min_stock,
        ideal_stock: item.ideal_stock,
        last_price: item.last_price,
        id_currency: item.id_currency,

        // TIMESTAMPS
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    });

    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
