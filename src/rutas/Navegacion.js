import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native'; // Importamos StatusBar y Platform
import Login from '../componentes/Login/Login';
import EnviarPin from '../componentes/Login/EnviarPin';
import RecuperarContrasena from '../componentes/Login/CambiarContrasena';
import Seguros from '../componentes/seguros/ListarSeguro';
import InsertarEditarSeguro from '../componentes/seguros/InsertarEditarSeguro';
import mainMenu from '../componentes/mainMenu/mainMenu';
import servicios from '../componentes/serviciosAdicionales/ListarServicios';
import InsertarEditarservicios from '../componentes/serviciosAdicionales/InsertarEditarServicio';
import Mantenimiento from '../componentes/mantenimiento/mantenimiento';
import InsertarMantenimiento from '../componentes/mantenimiento/insertarmantenimiento';
import EditarMantenimiento from '../componentes/mantenimiento/editarMantenimiento';
import Renta from '../componentes/renta/renta';
import MisRentas from '../componentes/renta/MisRentas';
import Vehiculo from '../componentes/vehiculo/ListarVehiculo';
import InsertarEditarVehiculo from '../componentes/vehiculo/InsertarEditarVehiculo';



const Stack = createStackNavigator();

const Navegacion = () => {
  useEffect(() => {
    // Para que la barra de estado sea translúcida o semitransparente
    StatusBar.setBarStyle('light-content'); // Cambiar el color del texto a negro
    StatusBar.setBackgroundColor('transparent'); // Fondo transparente
    StatusBar.setTranslucent(true); // Hacer que la barra sea translúcida
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
          <Stack.Screen name="EnviarPin" component={EnviarPin} options={{ headerShown: false }} />
          <Stack.Screen name="RecuperarContrasena" component={RecuperarContrasena} options={{ headerShown: false }} />
          <Stack.Screen name="Seguros" component={Seguros} options={{ headerShown: false }}/>
          <Stack.Screen name="InsertarEditarSeguros" component={InsertarEditarSeguro} options={{ headerShown: false }} />
          <Stack.Screen name="Menu Principal" component={mainMenu} options={{ headerShown: false }}/>
          <Stack.Screen name="Servicios Adicionales" component={servicios} options={{ headerShown: false }} />
          <Stack.Screen name="Insertar Editar Servicios" component={InsertarEditarservicios} options={{ headerShown: false }} />
          <Stack.Screen name="Mantenimiento" component={Mantenimiento} options={{ headerShown: false }}/>
          <Stack.Screen name="Insertar mantenimiento" component={InsertarMantenimiento} options={{ headerShown: false }} />
          <Stack.Screen name="Editar mantenimiento" component={EditarMantenimiento} options={{ headerShown: false }} />
          <Stack.Screen name="Renta" component={Renta} options={{ headerShown: false }} />
          <Stack.Screen name="Mis Rentas" component={MisRentas} options={{ headerShown: false }} />
          <Stack.Screen name="Vehiculos" component={Vehiculo} options={{ headerShown: false }}/>
          <Stack.Screen name="InsertarEditarVehiculos" component={InsertarEditarVehiculo} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navegacion;
