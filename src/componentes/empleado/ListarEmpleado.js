import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPenToSquare, faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
const ip = require('../ip/ip');

const Empleados = () => {
  const navigation = useNavigation();
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerEmpleados = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const respuesta = await axios.get(`http://${ip}:3001/api/empleado/listar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(respuesta.data);
      setCargando(false);
    } catch (error) {
      console.error('Error al obtener los empleados', error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      obtenerEmpleados();
    }, [])
  );

  const eliminarEmpleado = async (id) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(`http://${ip}:3001/api/empleado/eliminar?id_empleado=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados((prevEmpleados) => prevEmpleados.filter((empleado) => empleado.id_empleado !== id));
      Alert.alert('Notificación', 'Empleado eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el empleado', error);
      Alert.alert('Error', 'No se pudo eliminar el empleado, intenta de nuevo.');
    }
  };

  const confirmarEliminacion = (id) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este empleado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => eliminarEmpleado(id), style: 'destructive' },
      ]
    );
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.titulo}>
        <Text style={styles.texttitulo}>Listado de Empleados</Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('InsertarEditarEmpleado')}>
          <FontAwesomeIcon icon={faCirclePlus} size={30} color="#339ef0" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id_empleado.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Empleado ID: {item.id_empleado}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>Nombre: {item.nombre_empleado}</Text>
              <Text style={styles.cardText}>Teléfono: {item.telefono || 'No disponible'}</Text>
              <Text style={styles.cardText}>Correo: {item.correo}</Text>
              <Text style={styles.cardText}>Cargo: {item.cargo}</Text>
              <View style={styles.botonesContainer}>
                <TouchableOpacity onPress={() => confirmarEliminacion(item.id_empleado)}>
                  <FontAwesomeIcon icon={faTrash} size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('InsertarEditarEmpleado', { id: item.id_empleado })}>
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

export default Empleados;
