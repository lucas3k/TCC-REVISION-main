import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import { setStringLocalStorage, getStringLocalStorage } from '../../services/localstorage';

const MonthlyExpensesChart = ({ valorTotalMesAtual }) => {
  const [valorAtual, setValorAtual] = useState(0);
  const [mesAtual, setMesAtual] = useState(moment().format('MM/YYYY'));
  const [dadosGrafico, setDadosGrafico] = useState({ labels: [], data: [] });

  //Aqui se verifica se o valor total do mês mudou. Ele limpa o valor (tirando símbolos como "R$") e atualiza valorAtual.
  useEffect(() => {
    const filtrarValor = (value) => {
      // se o valor for menor que mil não tirar o ponto dos centavos
      if (value.indexOf(",") === -1) {
        return Number(value.replace("R$", "").replace(",", "."))
      }

      return Number(value.replace("R$", "").replace(".", "").replace(",", "."))
    };

    const valor = filtrarValor(valorTotalMesAtual);

    if (!isNaN(valor)) {
      setValorAtual(valor);
    }
  }, [valorTotalMesAtual]);


//Aqui eu guardo quanto foi gasto no mês atual. Se o mês já existe, será atualizado. Se não, será criado um novo mês.

  useEffect(() => {
    const salvar = async () => {
      const totalMesesJSON = await getStringLocalStorage('totalMeses');
      const totalMeses = totalMesesJSON ? JSON.parse(totalMesesJSON) : [];

      const mesAtualFormatado = moment().format('MM/YYYY');

      const indexMesAtual = totalMeses.findIndex((mes) => mes.mes === mesAtualFormatado);

      if (indexMesAtual !== -1) {
        totalMeses[indexMesAtual].total = valorAtual;
      } else {
        totalMeses.push({ mes: mesAtualFormatado, total: valorAtual });
      }

      await setStringLocalStorage('totalMeses', JSON.stringify(totalMeses));
      atualizarDadosGrafico(totalMeses);
    };

    salvar();
  }, [valorAtual, mesAtual]);

//Aqui se verifica se o mês atual já existe na lista. Se não, será criado um novo mês com gasto zero

  useEffect(() => {
    const verificarMes = async () => {
      const mesAtualFormatado = moment().format('MM/YYYY');
      setMesAtual(mesAtualFormatado);

      const totalMesesJSON = await getStringLocalStorage('totalMeses');
      const totalMeses = totalMesesJSON ? JSON.parse(totalMesesJSON) : [];

      const indexMesAtual = totalMeses.findIndex((mes) => mes.mes === mesAtualFormatado);

      if (indexMesAtual === -1) {
        totalMeses.push({ mes: mesAtualFormatado, total: 0 });
        await setStringLocalStorage('totalMeses', JSON.stringify(totalMeses));
        setValorAtual(0);
      } else {
        setValorAtual(totalMeses[indexMesAtual].total);
      }

      atualizarDadosGrafico(totalMeses);
    };

    verificarMes();
  }, []);

  //Esta função pega todos os meses e seus gastos e atualiza o gráfico.
  const atualizarDadosGrafico = (totalMeses) => {
    const labels = totalMeses.map((mes) => mes.mes);
    const data = totalMeses.map((mes) => mes.total);
    setDadosGrafico({ labels, data });
  };

  //aqui eu "desenho" o grafico
  return (
    <View style={styles.container}>
      <BarChart
        data={{
          labels: dadosGrafico.labels,
          datasets: [
            {
              data: dadosGrafico.data,
            },
          ],
        }}
        width={300}
        height={200}
        yAxisLabel="R$"
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
});

export default MonthlyExpensesChart;

//aqui fazemos a criação da logica do grafico de barras
//valorAtual : quanto dinheiro gastei este mês -  mesAtual: mês atual mês atual que estamos (exemplo 06/2024)