import {Text, View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.title}>2026년 10월 9일</Text>
            </View>
            <ScrollView>
                <View style={styles.bodyView}>
                    <View>
                        <Text style={styles.listText}>식당</Text>
                    </View>
                    <View>
                        <Text style={styles.listText}>500엔</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomButton}>
                <View style={styles.buttonView}>
                    <Text style={styles.button}>날짜</Text>
                </View>
                <View style={styles.buttonView}>
                    <Text style={styles.button}>실시간 환전</Text>
                </View>
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
        marginHorizontal: 15,
        marginVertical: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginVertical: 15,
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
        justifyContent: 'space-around',
    },
    listText: {
        fontWeight: '600',
        fontSize: 18,
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    buttonView: {
        marginHorizontal: 15,
        marginVertical: 40,
        paddingHorizontal: 30,
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