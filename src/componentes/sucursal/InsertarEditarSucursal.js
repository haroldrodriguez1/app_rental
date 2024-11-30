import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarSucursal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');

  useEffect(() => {
    if (id) {
      const obtenerSucursal = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/sucursal/buscarsucursal?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const sucursal = respuesta.data[0];
          setNombre(sucursal.nombre);
          setTipo(sucursal.tipo);
          setDescripcion(sucursal.direccion);
          setCobertura(sucursal.telefono);
          setPrecio(sucursal.idEmpresa);
        } catch (error) {
          console.error('Error al cargar los datos de la sucursal', error);
          Alert.alert('Error', 'No se pudieron cargar los datos de la sucursal.');
        }
      };
      obtenerSucursal();
    }
  }, [id]);

  const manejarGuardar = async () => {
    if (!nombre || !tipo || !direccion || !telefono || !idEmpresa) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const sucursal = {
      nombre,
      tipo,
      direccion,
      telefono,
      estado: true,
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
       const respuesta = await axios.put(`http://${ip}:3001/api/sucursal/editar?id=${id}`, sucursal, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/sucursal/guardar`, sucursal, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar la sucursal', error);
      Alert.alert('Error', 'No se pudo guardar la sucursal. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{id ? 'Editar Sucursal' : 'Insertar Sucursal'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Direccion"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="IdEmpresa"
        value={idEmpresa}
        onChangeText={setIdEmpresa}

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

export default InsertarEditarSucursal;
