import AsyncStorage from '@react-native-async-storage/async-storage';


//Função para Guardar uma String (Texto)
export const setStringLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Erro ao salvar usuário logado:', e);
  }
};
//Função para Pegar uma String (Texto)
export const getStringLocalStorage = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Erro ao buscar usuário logado:', e);
  }
}
//Função para Remover Algo do BD
export const removeLocalStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Erro ao remover do storage:', e);
  }
}

//Função para Guardar um Objeto
export const setObjectLocalStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  }
  catch (e) {
    console.error('Erro ao salvar objeto:', e);
  }
}

//Função para Pegar um Objeto
export const getObjectLocalStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Erro ao buscar objeto:', e);
  }
}

//Função para Limpar Tudo bd
export const clearLocalStorage = async () => {
  console.info('Limpando storage...');
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Erro ao limpar storage:', e);
  }
}
