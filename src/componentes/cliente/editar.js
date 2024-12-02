import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';

const EditarDatos = ({ route, navigation }) => {
  const { cliente } = route.params;
  const [clienteId, setClienteId] = useState(cliente.clienteId);
  const ip = require('../ip/ip');
  
  const [primernombre, setPrimerNombre] = useState(cliente.primernombre);
  const [segundonombre, setSegundoNombre] = useState(cliente.segundonombre);
  const [primerapellido, setPrimerApellido] = useState(cliente.primerapellido);
  const [segundoapellido, setSegundoApellido] = useState(cliente.segundoapellido);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    navigation.setOptions({
      actualizarLista: route.params.actualizarLista,
    });
  }, [navigation, route.params.actualizarLista]);

  const validarCampos = () => {
    const errores = {};

    if (primernombre.length < 2 || primernombre.length > 50) {
      errores.primernombre = 'El primer nombre debe tener entre 2 y 50 caracteres.';
    }
    if (segundonombre.length > 50) {
      errores.segundonombre = 'El segundo nombre no puede superar los 50 caracteres.';
    }
    if (primerapellido.length < 2 || primerapellido.length > 50) {
      errores.primerapellido = 'El primer apellido debe tener entre 2 y 50 caracteres.';
    }
    if (segundoapellido.length > 50) {
      errores.segundoapellido = 'El segundo apellido no puede superar los 50 caracteres.';
    }

    setErrores(errores);
    return Object.keys(errores).length === 0;
  };

  const editarCliente = async (id) => {
    if (!validarCampos()) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem('authToken');
      const respuesta = await axios.put(
        `http://${ip}:3001/api/cliente/editar?id=${id}`,
        {
          clienteId: id, 
          primernombre,
          segundonombre,
          primerapellido,
          segundoapellido,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Éxito', 'Los datos del cliente fueron actualizados correctamente');
      if (typeof route.params.actualizarLista === 'function') {
        route.params.actualizarLista(); 
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error al editar cliente:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar el cliente, intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Cliente {clienteId}</Text>

      <TextInput
        style={styles.input}
        placeholder="Primer Nombre"
        value={primernombre}
        onChangeText={setPrimerNombre}
        color="#ffff"
      />
      {errores.primernombre && <Text style={styles.error}>{errores.primernombre}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Segundo Nombre"
        value={segundonombre}
        onChangeText={setSegundoNombre}
        color="#ffff"
      />
      {errores.segundonombre && <Text style={styles.error}>{errores.segundonombre}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Primer Apellido"
        value={primerapellido}
        onChangeText={setPrimerApellido}
        color="#ffff"
      />
      {errores.primerapellido && <Text style={styles.error}>{errores.primerapellido}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Segundo Apellido"
        value={segundoapellido}
        onChangeText={setSegundoApellido}
        color="#ffff"
      />
      {errores.segundoapellido && <Text style={styles.error}>{errores.segundoapellido}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => editarCliente(clienteId)}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
  },
  title: {
    marginTop: 25,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    backgroundColor: '#2F2F3E',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#E94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarDatos;
