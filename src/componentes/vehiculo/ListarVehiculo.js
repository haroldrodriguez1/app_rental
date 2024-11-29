import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
const ip = require('../ip/ip');

const Vehiculos = () => {
  const navigation = useNavigation();
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerVehiculos = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const respuesta = await axios.get(`http://${ip}:3001/api/vehiculo/listar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVehiculos(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener los vehículos", error);
    }
  };

  useEffect(() => {
    obtenerVehiculos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      obtenerVehiculos();
    }, [])
  );

  const eliminarVehiculo = async (Id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const respuesta = await axios.delete(`http://${ip}:3001/api/vehiculo/eliminar?id=${Id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setVehiculos((prevVehiculos) =>
        prevVehiculos.filter((vehiculo) => vehiculo.id !== Id)
      );
      Alert.alert('Notificación', 'Vehículo eliminado correctamente.');
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo eliminar el vehículo, intenta de nuevo.");
    }
  };

  const confirmarEliminacion = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este vehículo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => eliminarVehiculo(id), style: "destructive" }
      ]
    );
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.titulo}>
        <Text style={styles.texttitulo}>Listado de Vehículos</Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InsertarEditarVehiculo')}>
          <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vehículo ID: {item.id}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Marca: {item.marca}</Text>
              <Text style={styles.cardText}>Modelo: {item.modelo}</Text>
              <Text style={styles.cardText}>Año: {item.anio}</Text>
              <Text style={styles.cardText}>Precio por Día: L {item.precio}</Text>
              <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
              <Text style={styles.cardText}>Estado: {item.estado}</Text>
              <Text style={styles.cardText}>Placa: {item.placa}</Text>
              <View style={styles.botonesContainer}>
                <TouchableOpacity onPress={() => confirmarEliminacion(item.id)}>
                  <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('InsertarEditarVehiculo', { id: item.id })}>
                  <FontAwesomeIcon icon={faPenToSquare} size={24} color="#339ef0" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 13,
    backgroundColor: '#0F3460',
  },
  titulo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  texttitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  boton: {
    marginLeft: 10,
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  cardContent: {
    marginTop: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 22,
  },
});

export default Vehiculos;
