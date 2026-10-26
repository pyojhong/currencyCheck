import {Text, View, StyleSheet, Pressable, Modal, Button } from 'react-native';
import { ScrollView, TextInput } from 'react-native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';


export default function HomeScreen() {
    const API = 'https://api.frankfurter.app/latest?from=JPY&to=KRW';

    const [currentDate, setCurrentDate] = useState('');
    const [list, setList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rates, setRates] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [markedDates, setMarkedDates] = useState([]);

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

    const deleteItem = (id) => {
        const updatedList = list.filter(item => item.id !== id);
        setList(updatedList);
        storeData(updatedList);
    };

    const loadCurrency = async () => {
        try {
            const response = await fetch(API);
            const data = await response.json();
            const rate = data.rates.KRW;
            setRates(rate);
        } catch(e) {
            console.log('API 연동 에러', e);
            return 0;
        }
    };

    const loadMarkedDates = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            if (!keys) return;

            let newMarkedDates = {};

            for (let key of keys) {
                const jsonValue = await AsyncStorage.getItem(key);
                if (jsonValue != null) {
                    const parsedList = JSON.parse(jsonValue);
                    if (parsedList.length > 0) {
                        const match = key.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
                        if (match) {
                            const [, year, month, date] = match;
                            const formattedMonth = month.padStart(2, '0');
                            const formattedDate = date.padStart(2, '0');
                            const dateString = `${year}-${formattedMonth}-${formattedDate}`;

                            newMarkedDates[dateString] = {
                                marked: true,
                                dotColor: '#fb923c',
                            }
                        }
                    }
                }
            }
            setMarkedDates(newMarkedDates);
        } catch (e) {
            console.log('마크 로딩 에러', e);
        }
    };

    useEffect(() => {
        const todayStr = getTodayDateString();
        setCurrentDate(todayStr);
        getData(todayStr);
        loadCurrency();
        loadMarkedDates();
    }, []);
    useEffect(() => {
        if (isLoaded) {
            storeData(list);
        }
    }, [list, isLoaded]);


    const totalYen = list.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    const totalKrw = (totalYen * rates).toFixed(2);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>{currentDate}</Text>
            </View>
            <View style={styles.currencyView}>
                <Text style={styles.changeMoney}>환율: {rates.toFixed(2)}원</Text>
                <Text style={styles.changeMoney}>전체: {totalYen}엔 / {totalKrw}원</Text>
            </View>
            <ScrollView>
                {list.map((item) => {
                    const calculatedKrw = item.value ? (Number(item.value) * rates).toFixed(0) : 0;

                    return (
                        <View key={item.id} style={styles.itemRowWrapper}>
                            <View style={styles.bodyView}>
                                <View style={styles.inputContainerPaid}>
                                    <TextInput 
                                        style={styles.listText} 
                                        value={item.paid} 
                                        onChangeText={(text) => updateItem(item.id, 'paid', text)} 
                                        placeholder='사용처' 
                                        placeholderTextColor={styles.placeholderStyle.color} 
                                        keyboardType='default'
                                    />
                                </View>
                                <View style={styles.inputContainerValue}>
                                    <TextInput 
                                        style={styles.listText} 
                                        value={item.value} 
                                        onChangeText={(text) => updateItem(item.id, 'value', text)} 
                                        placeholder='금액 입력' 
                                        placeholderTextColor={styles.placeholderStyle.color} 
                                        keyboardType='number-pad'
                                    />
                                </View>
                                <View style={styles.unitContainer}>
                                    <Text style={styles.listTextMoney}>엔</Text>
                                </View>
                                <Pressable onPress={() => deleteItem(item.id)} style={styles.deletePressable}>
                                    <FontAwesome name='trash-o' size={styles.deleteIconStyle.fontSize} color={styles.deleteIconStyle.color}></FontAwesome>
                                </Pressable>
                            </View>
                            <View>
                                <View style={styles.changedMoneyView}>
                                    <Text style={styles.changeMoney}>{calculatedKrw} 원</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            <View style={styles.bottomButton}>
                <Pressable onPress={() => setShowModal(true)} style={({pressed}) => pressed ? ([styles.buttonView, styles.pressedOpacity]) : (styles.buttonView)}>
                    <FontAwesome name="calendar" size={styles.navIconStyle.size} color={styles.navIconStyle.color} />
                </Pressable>
                <Pressable style={({pressed}) => pressed ? ([styles.buttonView, styles.pressedOpacity]) : (styles.buttonView)}>
                    <Text onPress={() => {loadCurrency()}} style={styles.button}>환전 갱신</Text>
                </Pressable>
                <Pressable onPress={addNewList} style={({pressed}) => pressed ? ([styles.buttonView, styles.pressedOpacity]) : (styles.buttonView)}>
                    <FontAwesome name="plus-square-o" size={styles.navIconStyle.size} color={styles.navIconStyle.color} />
                </Pressable>
            </View>
            <Modal visible={showModal} animationType='slide' transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>캘린더</Text>
                        </View>
                        <View style={styles.calendarWrapper}>
                            <Calendar markedDates={markedDates} onDayPress={(day) => {
                                const [year, month, date] = day.dateString.split('-');
                                const selectedStr = `${year}년 ${Number(month)}월 ${Number(date)}일`;

                                setIsLoaded(false);
                                setList([]);

                                setCurrentDate(selectedStr);
                                getData(selectedStr);
                                setShowModal(false);
                            }}
                            theme={{
                                backgroundColor: '#111827',
                                calendarBackground: '#111827',
                                textSectionTitleColor: '#94a3b8',
                                dayTextColor: '#ffffff',
                                todayTextColor: '#fb923c',
                                selectedDayBackgroundColor: '#f97316',
                                selectedDayTextColor: '#ffffff',
                                monthTextColor: '#ffffff',
                                arrowColor: '#fb923c',
                            }}>
                            </Calendar>
                        </View>
                        <View style={{marginTop: 15}}>
                            <Pressable onPress={() => setShowModal(false)} style={({pressed}) => pressed ? ([styles.modalBackButton, styles.pressedOpacity, {width: '100%', marginHorizontal: 0, height: 50}]) : ([styles.modalBackButton, {width: '100%', marginHorizontal: 0, height: 50,}])}>
                                <Text style={styles.button}>뒤로가기</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0f19',
        paddingTop: 65,
    },
    titleView: {
        backgroundColor: '#111827',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.4)',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    currencyView: {
        backgroundColor: '#111827',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    itemRowWrapper: {
        flexDirection: 'column',
    },
    bodyView: {
        flexDirection: 'row',
        marginVertical: 6,
        backgroundColor: '#111827',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
        alignItems: 'center',
    },
    inputContainerPaid: {
        flex: 1, 
        justifyContent: 'center', 
        paddingLeft: 10,
    },
    inputContainerValue: {
        flex: 0.8, 
        justifyContent: 'flex-end', 
        paddingLeft: 60,
    },
    unitContainer: {
        flex: 0.4, 
        justifyContent: 'center', 
        paddingLeft: 10,
    },
    deletePressable: {
        justifyContent: 'center', 
        paddingRight: 5,
    },
    listText: {
        fontWeight: '700',
        fontSize: 17,
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    placeholderStyle: {
        color: '#ffffff',
    },
    listTextMoney: {
        fontWeight: '700',
        fontSize: 15,
        color: '#ffffff',
    },
    deleteIconStyle: {
        fontSize: 22.5,
        color: '#fb7185',
    },
    changedMoneyView: {
        flexDirection: 'row',
        backgroundColor: '#161e2e',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 32,
        marginBottom: 12,
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    changeMoney: {
        fontWeight: '800',
        fontSize: 16,
        color: '#fb923c',
        textShadowColor: 'rgba(251, 146, 60, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 4,
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#111827',
        borderTopWidth: 1,
        borderTopColor: 'rgba(249, 115, 22, 0.3)',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonView: {
        flex: 1,
        height: 60,
        marginHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161e2e',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.35)',
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    pressedOpacity: {
        opacity: 0.6,
    },
    button: {
        fontWeight: '700',
        fontSize: 16,
        color: '#ffffff',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    navIconStyle: {
        size: 22,
        color: '#ffffff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContentContainer: {
        width: '95%',
        backgroundColor: '#0b0f19',
        borderRadius: 24,
        padding: 24,
        paddingVertical: 30,
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.4)',
        maxHeight: '90%',
        justifyContent: 'space-between',
    },
    calendarWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1f2937',
        marginBottom: 10,
    },
    modalBackButton: {
        width: '100%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#161e2e',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.35)',
    },
});