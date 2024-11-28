import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarSeguro = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cobertura, setCobertura] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (id) {
      const obtenerSeguro = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/seguro/buscarseguro?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const seguro = respuesta.data[0];
          setNombre(seguro.nombre);
          setTipo(seguro.tipo);
          setDescripcion(seguro.descripcion);
          setCobertura(seguro.cobertura);
          setPrecio(seguro.precio);
        } catch (error) {
          console.error('Error al cargar los datos del seguro', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del seguro.');
        }
      };
      obtenerSeguro();
    }
  }, [id]);

  const manejarGuardar = async () => {
    if (!nombre || !tipo || !descripcion || !cobertura || !precio) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const seguro = {
      nombre,
      tipo,
      descripcion,
      cobertura,
      precio: parseFloat(precio),
      estado: true,
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
       const respuesta = await axios.put(`http://${ip}:3001/api/seguro/editar?id=${id}`, seguro, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/seguro/guardar`, seguro, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar el seguro', error);
      Alert.alert('Error', 'No se pudo guardar el seguro. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{id ? 'Editar Seguro' : 'Insertar Seguro'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Cobertura"
        value={cobertura}
        onChangeText={setCobertura}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        keyboardType="numeric"
        onChangeText={setPrecio}
        color= '#fff'
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

export default InsertarEditarSeguro;
