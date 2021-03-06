import * as React from "react";
import { Text, View } from "../components/Themed";

import * as SQLite from "expo-sqlite";
import { Image, StyleSheet } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import {host} from '../config/host';

const db = SQLite.openDatabase("dbloja.banco");
const StackPagamento = createStackNavigator();

export default function Carrinho({ navigation }) {
  const [dados, setDados] = React.useState([]);
  const [quantidade, setQuantidade] = React.useState("1");

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from itens", [], (_, { rows: { _array } }) => {
        setDados(_array);
      });
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Veja o que tem no carrinho</Text>
      {dados.map(({ id, idproduto, nomeproduto, preco, foto }) => (
        <View style={{ flex: 1 }} key={idproduto}>
          <Image
            source={{ uri: `${host}Pedro_Noga/logo/img/${foto}` }}
            style={tela.img}
          />
          <Text>Produto:{nomeproduto}</Text>
          <Text>Preço:{preco}</Text>
          <Text>Quantidade:</Text>
          <TextInput
            placeholder="1"
            value={quantidade}
            onChangeText={(value) => setQuantidade(value)}
          />
          <TouchableOpacity
            onPress={() => {
              db.transaction((tx) => {
                tx.executeSql("delete from itens where id=?", [id]);
              });
            }}
          >
            <Text>Retirar do Carrinho</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Pagamento");
        }}
      >
        <Text>Comprar</Text>
      </TouchableOpacity>
    </View>
  );
}
const tela = StyleSheet.create({
  img: {
    width: 200,
    height: 180,
    flex: 1,
  },
  link: {
    padding: 10,
  },
});

