const { Board, Servo } = require('johnny-five');
const { EtherPortClient } = require('etherport-client');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Dirección IP del ESP8266
const esp8266Ip = "192.168.156.200"; // Cambia por la IP de tu ESP8266

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de la conexión con ESP8266
const board = new Board({
  port: new EtherPortClient({
    host: esp8266Ip,
    port: 3030, // Puerto Firmata
  }),
  repl: true,
});

let servos = {};
let movements = []; // Lista donde se guardan todas las secuencias de movimientos

// Función para guardar los movimientos de un servo
const saveServoMovement = (servoName, newValue) => {
  const movement = {
    servoName: servoName,
    value: newValue,
    timestamp: new Date().toISOString(),
  };
  movements.push(movement);
  console.log(`Movimiento guardado para ${servoName}:`, newValue);
};

// Función para reproducir los movimientos guardados
const replayMovements = () => {
  if (movements.length === 0) return;

  let index = 0;
  const interval = setInterval(() => {
    if (index >= movements.length) {
      clearInterval(interval);
      console.log("Reproducción finalizada");
      return;
    }

    const movement = movements[index];
    switch (movement.servoName) {
      case 'baseHorizontal':
        servos.base.to(movement.value);
        break;
      case 'baseVertical':
        servos.baseVertical.to(movement.value);
        break;
      case 'brazo':
        servos.brazo.to(movement.value);
        break;
      case 'garraHorizontal':
        servos.garraIzquierdaDerecha.to(movement.value);
        break;
    }
    console.log("Reproduciendo movimiento:", movement);
    index++;
  }, 1000); // Intervalo de 1 segundo entre cada movimiento
};

// Función para mapear los valores del joystick (ejemplo)
const mapJoystickValue = (value) => {
  return Math.round(value * 90 + 90); // Mapeo de -1 a 1 a 0-180
};

// Inicialización de la placa
board.on('ready', () => {
  console.log("Conectado al ESP8266 con Firmata");

  // Inicialización de servos (4 en total)
  servos = {
    base: new Servo({ pin: 5, range: [-45, 180], startAt: 45 }), // Base rotatoria D1
    baseVertical: new Servo({ pin: 4, range: [-45, 180], startAt: -45 }), // Movimiento vertical D2
    brazo: new Servo({ pin: 0, range: [0, 180], startAt: 0 }), // Brazo cerca de la pinza D3
    garraIzquierdaDerecha: new Servo({ pin: 2, range: [0, 180], startAt: 0 }), // Movimiento horizontal de la garra D4
  };

  // Configuración de Socket.IO
  io.on('connection', (socket) => {
    console.log("Cliente conectado");

    // Variables para controlar los valores actuales de cada servo
    let baseHorizontalValue = 45;
    let baseVerticalValue = -45;
    let brazoValue = 0;
    let garraHorizontalValue = 0;

    // Función para mapear los valores del joystick a un rango adecuado
    const mapJoystickValue = (value) => {
      const minJoystickValue = -100;
      const maxJoystickValue = 100;
      const minServoValue = 0;
      const maxServoValue = 180;
      let mappedValue = ((value - minJoystickValue) / (maxJoystickValue - minJoystickValue)) * (maxServoValue - minServoValue) + minServoValue;
      return restrictRange(mappedValue, 0, 180);
    };

    // Función para restringir valores dentro de un rango
    const restrictRange = (value, min, max) => {
      return Math.min(Math.max(value, min), max);
    };

    // Joystick 1: Base horizontal y vertical
    socket.on('joystick1Move', ({ x, y }) => {
      console.log("Joystick 1 - X:", x, "Y:", y);
      baseHorizontalValue = mapJoystickValue(x);
      servos.base.to(baseHorizontalValue);
      saveServoMovement('baseHorizontal', baseHorizontalValue);

      baseVerticalValue = mapJoystickValue(y);
      servos.baseVertical.to(baseVerticalValue);
      saveServoMovement('baseVertical', baseVerticalValue);
    });

    // Joystick 2: Brazo y garra izquierda-derecha
    socket.on('joystick2Move', ({ x, y }) => {
      console.log("Joystick 2 - X:", x, "Y:", y);
      garraHorizontalValue = mapJoystickValue(x);
      servos.garraIzquierdaDerecha.to(garraHorizontalValue);
      saveServoMovement('garraHorizontal', garraHorizontalValue);

      brazoValue = mapJoystickValue(y);
      servos.brazo.to(brazoValue);
      saveServoMovement('brazo', brazoValue);
    });

    // Reproducir los movimientos guardados
    socket.on('replayMovements', () => {
      replayMovements();
    });
  });
});

// Servir la interfaz web
app.use(express.static('public2'));

// Inicializar el servidor
server.listen(3000, () => {
  console.log('Servidor corriendo en http://192.168.156.82:3000');
});
