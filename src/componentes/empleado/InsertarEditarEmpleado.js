import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarEmpleado = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const [nombreEmpleado, setNombreEmpleado] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [cargo, setCargo] = useState('');

  useEffect(() => {
    if (id) {
      const obtenerEmpleado = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/empleado/buscaridempleado?id_empleado=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const empleado = respuesta.data[0];
          setNombreEmpleado(empleado.nombre_empleado);
          setTelefono(empleado.telefono);
          setCorreo(empleado.correo);
          setCargo(empleado.cargo);
        } catch (error) {
          console.error('Error al cargar los datos del empleado', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del empleado.');
        }
      };
      obtenerEmpleado();
    }
  }, [id]);

  const manejarGuardar = async () => {
    if (!nombreEmpleado || !correo || !cargo) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios (Nombre, Correo y Cargo).');
      return;
    }

    const empleado = {
      nombre_empleado: nombreEmpleado,
      telefono,
      correo,
      cargo,
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
        const respuesta = await axios.put(`http://${ip}:3001/api/empleado/editar?id_empleado=${id}`, empleado, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/empleado/guardar`, empleado, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar el empleado', error);
      Alert.alert('Error', 'No se pudo guardar el empleado. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{id ? 'Editar Empleado' : 'Insertar Empleado'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombreEmpleado}
        onChangeText={setNombreEmpleado}
        color='#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        color='#fff'
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        color='#fff'
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
        color='#fff'
      />
      <TouchableOpacity style={styles.boton} onPress={manejarGuardar}>
        <Text style={styles.textoBoton}>{id ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A1A2E',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#2F2F3E',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  boton: {
    backgroundColor: '#E94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InsertarEditarEmpleado;
