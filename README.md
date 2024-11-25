
# **Challenge DFL**

Este proyecto consiste en una arquitectura de microservicios utilizando **NestJS**, **Docker**, **MongoDB**, y **Redis**. La finalidad del proyecto es realizar operaciones relacionadas con tipos de transacciones y conversión de tasas de cambio, con servicios que se comunican entre sí mediante mensajes.

---

## **Tabla de Contenidos**

1. [Descripción del Proyecto](#descripción-del-proyecto)  
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)  
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)  
4. [Estructura del Repositorio](#estructura-del-repositorio)  
5. [Configuración y Ejecución](#configuración-y-ejecución)  
6. [Microservicios Implementados](#microservicios-implementados)  
7. [Integración de Jobs y Tareas](#integración-de-jobs-y-tareas)

---

## **Descripción del Proyecto**

El proyecto es un sistema de microservicios desarrollado en **NestJS** con el objetivo de gestionar transacciones y tasas de cambio. La arquitectura fue diseñada para ser escalable y modular, separando responsabilidades específicas en diferentes servicios que interactúan mediante colas y mensajes.

---

## **Arquitectura del Proyecto**

El sistema está compuesto por los siguientes servicios y herramientas:

- **Microservicios:**
  - **client-gateway**: Puerta de entrada para gestionar solicitudes desde el cliente.
  - **transaction-ms**: Microservicio para la gestión de tipos de transacciones.
  - **currency-ms**: Microservicio encargado de gestionar tasas de cambio entre divisas.

- **Bases de datos:**
  - **MongoDB**: Base de datos principal para almacenar información de transacciones y tipos.
  - **Redis**: Cache utilizado para optimizar respuestas y almacenar tasas de cambio temporalmente.

- **Mensajería entre servicios:**
  - Implementación basada en eventos para la comunicación entre microservicios.

---

## **Tecnologías Utilizadas**

- **Node.js** (NestJS): Framework principal para la construcción de los microservicios.
- **Docker**: Contenedores para orquestar la infraestructura de los servicios y bases de datos.
- **MongoDB**: Almacenamiento persistente de datos.
- **Redis**: Almacenamiento en caché y persistencia de datos temporal.
- **RxJS**: Manejo reactivo de flujos de datos.
- **TypeScript**: Lenguaje principal del proyecto.

---

## **Estructura del Repositorio**

```
challenge-dfl/
│
├── apps/
│   ├── client-gateway/     # Gateway para gestionar solicitudes
│   ├── currency-ms/        # Microservicio de tasas de cambio
│   └── transaction-ms/     # Microservicio de transacciones
│
├── mongo_data/             # Datos de MongoDB
├── redis/                  # Datos de Redis
├── .env                    # Variables de entorno
├── docker-compose.yml      # Configuración de Docker Compose
├── Dockerfile              # Archivo Docker para la aplicación
├── start.sh                # Script de inicio
└── README.md               # Archivo de descripción del proyecto
```

---

## **Configuración y Ejecución**

### **Requisitos Previos**
- Node.js y npm instalados.
- Docker y Docker Compose configurados en tu máquina.
- Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd challenge-dfl
```

### **Configuración**
1. Configura las variables de entorno en un archivo `.env` basado en `.env.template`. Ejemplo:
   ```
   NEST_BASE_CURRENCY=USD
   NEST_LIST_CURRENCY=USD,EUR,GBP
   NEST_BASE_URL_EXCHANGE_API=https://api.exchangerate.host/latest
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

### **Ejecución**
1. Levanta los servicios con Docker:
   ```bash
   docker-compose up --build
   ```

2. Accede al gateway:
   - URL: `http://localhost:3000`

---

## **Microservicios Implementados**

### **Client Gateway**
El **gateway** es la entrada principal al sistema y expone las rutas REST para el usuario. Encaminan las solicitudes a los microservicios correspondientes utilizando el patrón de comunicación basado en comandos (`cmd`).

Ejemplo de ruta implementada:
```typescript
@Get()
getAllTransactionType(@Query() queryReq: QueryRequestDto) {
  return this.clientTransactionType.send(
    { cmd: 'findAllTransactionType' },
    { queryReq },
  );
}
```

### **Transaction MS**
Este microservicio maneja las operaciones relacionadas con los **tipos de transacciones**. Expone funcionalidades para consultar y gestionar la base de datos de transacciones.

### **Currency MS**
El servicio gestiona las **tasas de cambio** entre divisas. Incluye:
- Integración con una API externa para obtener tasas actualizadas.
- Implementación de un sistema de **Jobs** con `@nestjs/schedule` para actualizar periódicamente la información.

Código relevante:
```typescript
@Cron('0 0 */2 * * *', { name: 'JobExchangeCurrency' })
async updateCurrency() {
  const baseUrl = `${this.configService.get('NEST_BASE_URL_EXCHANGE_API')}/?base=${this.configService.get('NEST_BASE_CURRENCY')}`;
  const response = await firstValueFrom(this.httpService.get(baseUrl));
  this.exchangeRate.updateRates(response.data.base, response.data.rates);
}
```

---

## **Integración de Jobs y Tareas**

El sistema cuenta con un **Job Scheduler** configurado para actualizar cada 2 horas las tasas de cambio almacenadas en la caché de Redis. Esto permite:
1. Optimizar las respuestas del sistema.
2. Evitar llamadas excesivas a la API externa.

---

