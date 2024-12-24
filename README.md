# Robotic Arm Controller - Wireless Control via Node.js Server

Este proyecto permite controlar un brazo robótico de manera inalámbrica a través de un servidor basado en Node.js que opera en el puerto 3000. La solución utiliza comunicación inalámbrica para enviar comandos al brazo robótico, proporcionando un control fluido y en tiempo real.

## Características

- **Control inalámbrico:** El brazo robótico recibe comandos en tiempo real a través de una red inalámbrica.
- **Interfaz basada en Node.js:** Un servidor web se ejecuta en Node.js en el puerto 3000 para gestionar las solicitudes.
- **Escalabilidad:** Fácil de extender para admitir más funcionalidades, como automatización o grabación de movimientos.

## Requisitos previos

Antes de comenzar, asegúrate de tener los siguientes elementos:

- **Hardware:**
  - Un brazo robótico compatible con control inalámbrico (por ejemplo, con un microcontrolador como ESP32 o Raspberry Pi).
  - Conexión WiFi estable.

- **Software:**
  - Node.js (v16 o superior).
  - npm (gestor de paquetes de Node.js).
  - Dependencias específicas del proyecto (ver más abajo).

## Instalación

Sigue estos pasos para configurar el proyecto:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/robotic-arm-controller.git
   cd robotic-arm-controller
   ```

2. **Instala las dependencias:**
   Ejecuta el siguiente comando para instalar las librerías necesarias:
   ```bash
   npm install
   ```

3. **Configura el entorno:**
   - Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
     ```env
     PORT=3000
     ROBOT_IP=192.168.x.x # Reemplaza con la IP de tu brazo robótico
     ```

4. **Ejecuta el servidor:**
   Inicia el servidor con el siguiente comando:
   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.

## Uso

1. **Conéctate a la red WiFi:** Asegúrate de que tanto tu computadora como el brazo robótico estén conectados a la misma red.
2. **Accede a la interfaz:**
   - Abre tu navegador y visita `http://localhost:3000`.
3. **Controla el brazo robótico:**
   - Utiliza la interfaz para enviar comandos al brazo robótico, como mover articulaciones o realizar acciones específicas.

## Dependencias

Las principales librerías utilizadas en este proyecto incluyen:

- [Express](https://expressjs.com/) - Para manejar las solicitudes HTTP.
- [Socket.IO](https://socket.io/) - Para la comunicación en tiempo real entre el servidor y el brazo robótico.
- [dotenv](https://www.npmjs.com/package/dotenv) - Para manejar variables de entorno.

Instalación de las dependencias principales:
```bash
npm install express socket.io dotenv
```

## Personalización

- **Ampliar funcionalidad:** Puedes modificar los comandos disponibles en el archivo `routes/controller.js`.
- **Adaptación a otros modelos:** Si utilizas un hardware diferente, actualiza el archivo `config/hardware.js` según las especificaciones del dispositivo.

## Contribuciones

Si deseas contribuir al proyecto, abre un issue o envía un pull request. Las contribuciones son bienvenidas.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

¡Gracias por usar el Robotic Arm Controller! Si tienes alguna pregunta, no dudes en contactarnos.

