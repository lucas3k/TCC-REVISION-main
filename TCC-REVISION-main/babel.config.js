module.exports = function (api) { //função que será exportada como um módulo
  api.cache(true); //Esta linha ativa o cache de Babel
  return {
    presets: ['babel-preset-expo'],
  };
};
//ompila o código para garantir a compatibilidade em diferentes plataformas