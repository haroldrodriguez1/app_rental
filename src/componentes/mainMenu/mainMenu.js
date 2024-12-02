import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const BotonesGrid = () => {
    const navigation = useNavigation();

  const botones = [
    { id: '1', titulo: 'Seguros', icono: 'shield', ruta:'Seguros'},
    { id: '2', titulo: 'Servicios Adicionales', icono: 'category',ruta:'Servicios Adicionales' },
    { id: '3', titulo: 'Mantenimiento', icono: 'car-repair',ruta:'Mantenimiento' },
    { id: '4', titulo: 'Renta', icono: 'car-rental',ruta:'Renta' },
    { id: '5', titulo: 'Lista de Rentas', icono: 'list-alt',ruta:'Mis Rentas' },
    { id: '6', titulo: 'Vehículos', icono: 'directions-car', ruta: 'Vehiculos' },
    { id: '7', titulo: 'Sucursal', icono: 'factory', ruta: 'Sucursal'},
    { id: '8', titulo: 'Cliente', icono: 'person', ruta: 'Cliente'},
    { id: '9', titulo: 'Usuario', icono: 'face', ruta: 'Usuario'},
    { id: '10', titulo: 'Empleado', icono: 'badge', ruta: 'Empleado'}
  ];

  const cerrarSesion = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
    } catch (error) {
        Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
    }
};

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate(item.ruta)}>
      <Icon name={item.icono} size={40} color="#339ef0" />
      <Text style={styles.textoBoton}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.botonCerrarSesion} onPress={cerrarSesion}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.textoCerrarSesion}>Salir</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={botones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}

      />
    </View>
  );
  
};
const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#0F3460',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop:25
  },
  lista: {
    alignItems: 'center',
    marginTop:40,
    paddingBottom: 20,
  },
  fila: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  boton: {
  backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth / 2.4, 
    height: 120,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  
  textoBoton: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  botonCerrarSesion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E94560',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textoCerrarSesion: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
  },
});

export default BotonesGrid;
