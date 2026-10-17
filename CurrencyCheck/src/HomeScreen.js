import {Text, View, StyleSheet, Pressable } from 'react-native';
import { ScrollView, TextInput } from 'react-native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function HomeScreen() {
    const [currentDate, setCurrentDate] = useState('');
    const [list, setList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();

        return `${year}년 ${month}월 ${date}일`;
    };

    const getData = async (dataKey) => {
        try {
            const jsonValue = await AsyncStorage.getItem(dataKey);
            if (jsonValue != null) {
                setList(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.log('데이터 로드 부분 에러 발생', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const storeData = async (newList) => {
        if (!currentDate) return;
        try {
            const jsonValue = JSON.stringify(newList);
            await AsyncStorage.setItem(currentDate, jsonValue);
        } catch (e) {
            console.log('데이터 저장 부분 에러 발생', e);
        }
    };
    
    const updateItem = (id, field, text) => {
        setList(prevList =>
            prevList.map(item => item.id === id ? {...item, [field]: text} : item)
        );
    };

    const addNewList = () => {
        const newItem = {
            id: Date.now(),
            paid: '',
            value: '',
        };
        setList([...list, newItem]);
    };

    useEffect(() => {
        const todayStr = getTodayDateString();
        setCurrentDate(todayStr);
        getData(todayStr);
    }, []);
    useEffect(() => {
        if (isLoaded) {
            storeData(list);
        }
    }, [list, isLoaded]);
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>{currentDate}</Text>
            </View>
            <ScrollView>
                {list.map((item) => (
                    <View key={item.id} style={{flexDirection: 'column'}}>
                        <View style={styles.bodyView}>
                            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10,}}>
                                <TextInput style={styles.listText} value={item.paid} onChangeText={(text) => updateItem(item.id, 'paid', text)} placeholder='사용처' keyboardType='default'></TextInput>
                            </View>
                            <View style={{flex: 0.8, justifyContent: 'flex-end', paddingLeft: 60,}}>
                                <TextInput style={styles.listText} value={item.value} onChangeText={(text) => updateItem(item.id, 'value', text)} placeholder='금액 입력' keyboardType='number-pad'></TextInput>
                            </View>
                            <View style={{flex: 0.4, justifyContent: 'center', paddingLeft: 10,}}>
                                <Text style={styles.listTextMoney}>엔</Text>
                            </View>
                        </View>
                        <View>
                            <View style={styles.changedMoneyView}>
                                <Text style={styles.changeMoney}>환전가</Text>
                                <Text style={styles.changeMoney}>금액</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bottomButton}>
                <Pressable style={({pressed}) => pressed ? ([styles.buttonView, {opacity : 0.5}]) : (styles.buttonView)}>
                    <FontAwesome name="calendar" size={24} color="black" />
                </Pressable>
                <Pressable style={({pressed}) => pressed ? ([styles.buttonView, {opacity: 0.5}]) : (styles.buttonView)}>
                    <Text style={styles.button}>실시간 환전</Text>
                </Pressable>
                <Pressable onPress={addNewList} style={({pressed}) => pressed ? ([styles.buttonView, {opacity: 0.5}]) : (styles.buttonView)}>
                    <FontAwesome name="plus-square-o" size={24} color="black" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d4f1f1',
    },
    titleView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginTop: 100,
        marginVertical: 30,
        marginHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        color: 'black',
        fontSize: 28,
        fontWeight: '700',
    },
    bodyView: {
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginTop: 15,
        marginHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listText: {
        fontWeight: '600',
        fontSize: 18,
    },
    listTextMoney: {
        fontWeight: '500',
        fontSize: 16,
    },
    changedMoneyView: {
        flexDirection: 'row',
        backgroundColor: '#f0edede1',
        borderRadius: 20,
        paddingVertical: 6,
        marginHorizontal: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'space-around',
    },
    changeMoney: {
        fontWeight: '600',
        fontSize: 18,
        color: '#969595a8',
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    buttonView: {
        marginHorizontal: 10,
        marginVertical: 40,
        paddingHorizontal: 25,
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        fontWeight: '600',
        fontSize: 18,
    },
});