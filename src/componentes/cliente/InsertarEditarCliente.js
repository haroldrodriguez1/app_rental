import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clienteId } = route.params || {}; 
  const [primernombre, setPrimerNombre] = useState('');
  const [segundonombre, setSegundoNombre] = useState('');
  const [primerapellido, setPrimerApellido] = useState('');
  const [segundoapellido, setSegundoApellido] = useState('');
  const [tipo, setTipo] = useState('');


  useEffect(() => {
    if (clienteId) {
      const obtenerSucursal = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/cliente/buscarcliente?id=${clienteId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cliente = respuesta.data[0];
          setPrimerNombre(cliente.primernombre);
          setSegundoNombre(ciente.segundonombre);
          setPrimerApellido(cliente.primerapellido);
          setSegundoApellido(cliente.segundoapellido);
          setTipo(cliente.tipo);
        } catch (error) {
          console.error('Error al cargar los datos del cliente', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del cliente.');
        }
      };
      obtenerSucursal();
    }
  }, [clienteId]);

  const manejarGuardar = async () => {
    if (!primernombre || !segundonombre || !primernombre || !segundoapellido ) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const cliente = {
      primernombre,
      segundonombre,
      primerapellido,
      segundoapellido,

    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (clienteId) {
       const respuesta = await axios.put(`http://${ip}:3001/api/cliente/editar?id=${clienteId}`, cliente, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/cliente/guardar`, cliente, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar la cliente', error);
      Alert.alert('Error', 'No se pudo guardar la cliente. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{clienteId ? 'Editar Cliente' : 'Insertar Cliente'}</Text>
      <TextInput
        style={styles.input}
        placeholder="PrimerNombre"
        value={primernombre}
        onChangeText={setPrimerNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="SegundoNombre"
        value={tipo}
        onChangeText={setSegundoNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="PrimerApellido"
        value={primerapellido}
        onChangeText={setPrimerApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="SegundoApellido"
        value={segundoapellido}
        onChangeText={setSegundoApellido}
      />
      <TouchableOpacity style={styles.boton} onPress={manejarGuardar}>
        <Text style={styles.textoBoton}>{clienteId ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  boton: {
    backgroundColor: '#339ef0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InsertarEditarCliente;
