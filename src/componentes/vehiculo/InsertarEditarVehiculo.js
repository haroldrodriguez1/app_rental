import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
const ip = require('../ip/ip');

const InsertarEditarVehiculo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehiculoid } = route.params || {}; 
  const [marca, setMarca] = useState('');
  const [modelo, setTModelo] = useState('');
  const [año, setaño] = useState('');
  const [precioPorDia, setPrecioPorDia] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [estado, setEstado] = useState('');
  const [placa, setPlaca] = useState('');

  useEffect(() => {
    if (vehiculoid) {
      const obtenerVehiculo = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const respuesta = await axios.get(`http://${ip}:3001/api/vehiculo/buscarvehiculo?id=${vehiculoid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const vehiculo = respuesta.data[0];
          setMarca(vehiculo.marca);
          setModelo(vehiculo.modelo);
          setAño(vehiculo.año);
          setPrecioPorDia(vehiculo.precioPorDia);
          setTipoVehiculo(vehiculo.tipoVehiculo);
          setEstado(vehiculo.estado);
          setPlaca(vehiculo.placa);
        } catch (error) {
          console.error('Error al cargar los datos del vehículo', error);
          Alert.alert('Error', 'No se pudieron cargar los datos del vehículo.');
        }
      };
      obtenerVehiculo();
    }
  }, [vehiculoid]);


  const manejarGuardar = async () => {
    if (!marca || !modelo || !año || !precioPorDia || !tipoVehiculo || !estado || !placa) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const vehiculo = {
      marca,
      modelo,
      año,
      precioPorDia: parseFloat(precioPorDia),
      tipoVehiculo,
      estado,
      placa,
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (id) {
        const respuesta = await axios.put(`http://${ip}:3001/api/vehiculo/editar?id=${id}`, vehiculo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
      } else {
        const respuesta = await axios.post(`http://${ip}:3001/api/vehiculo/guardar`, vehiculo, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert('Notificación', JSON.stringify(respuesta.data, null, 2));
      }
      navigation.goBack(); 
    } catch (error) {
      console.error('Error al guardar el vehículo', error);
      Alert.alert('Error', 'No se pudo guardar el vehículo. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{vehiculoid ? 'Editar Vehículo' : 'Insertar Vehículo'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={marca}
        onChangeText={setMarca}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={modelo}
        onChangeText={setModelo}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Año"
        value={año}
        onChangeText={setAño}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Precio por Día"
        value={precioPorDia}
        keyboardType="numeric"
        onChangeText={setPrecioPorDia}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Vehículo"
        value={tipoVehiculo}
        onChangeText={setTipoVehiculo}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
        color= '#fff'
      />
      <TextInput
        style={styles.input}
        placeholder="Placa"
        value={placa}
        onChangeText={setPlaca}
        color= '#fff'
      />
      <TouchableOpacity style={styles.boton} onPress={manejarGuardar}>
        <Text style={styles.textoBoton}>{vehiculoid ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1A1F33',
    },
    titulo: {
      fontSize: 26,
      fontWeight: 'bold',
      marginTop: 30,
      marginBottom: 25,
      color: '#64A6D9',
    },
    input: {
      backgroundColor: '#2C3E50',
      padding: 12,
      marginBottom: 18,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#D1D8E0',
      color: '#F4F4F9',
    },
    boton: {
      backgroundColor: '#4A90E2',
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
    },
    textoBoton: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default InsertarEditarVehiculo;
  