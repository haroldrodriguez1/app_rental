import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarServicio = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(true); 
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (id) {
      const obtenerServicio = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/servicio/buscarservicio?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const servicio = respuesta.data[0];
          setNombre(servicio.nombre);
          setDescripcion(servicio.descripcion);
          setDisponibilidad(servicio.disponibilidad);
          setPrecio(servicio.precio);
        } catch (error) {
          console.error('Error al cargar los datos del servicio', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del servicio.');
        }
      };
      obtenerServicio();
    }
  }, [id]);

  const manejarGuardar = async () => {
    if (!nombre || !descripcion || precio === '') {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const servicio = {
      nombre,
      descripcion,
      disponibilidad,
      precio: parseFloat(precio),
      estado: true,
    };
    console.log(servicio);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
       const respuesta= await axios.put(`http://${ip}:3001/api/servicio/editar?id=${id}`, servicio, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta= await axios.post(`http://${ip}:3001/api/servicio/guardar`, servicio, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificacion', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar el servicio', error);
      Alert.alert('Error', 'No se pudo guardar el servicio. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{id ? 'Editar Servicio' : 'Insertar Servicio'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor={"#339ef0"}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholderTextColor={"#339ef0"}
      />
      
      
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, disponibilidad && styles.radioSelected]}
          onPress={() => setDisponibilidad(true)}
        >
          <Text style={styles.radioText}>Disponible</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, !disponibilidad && styles.radioSelected]}
          onPress={() => setDisponibilidad(false)}
        >
          <Text style={styles.radioText}>No Disponible</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        keyboardType="numeric"
        onChangeText={setPrecio}
        placeholderTextColor={"#339ef0"}
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
    color :'#fff',
   
  }, 
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioSelected: {
    backgroundColor: '#339ef0',
  },
  radioText: {
    color: '#333',
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

export default InsertarEditarServicio;
