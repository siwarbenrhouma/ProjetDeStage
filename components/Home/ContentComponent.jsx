import React, { useState, useEffect, useRef } from 'react';
import { View,
  TextInput, 
  Text, 
  TouchableOpacity,
  ScrollView, 
  StyleSheet, 
  ImageBackground, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function ContentComponent() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [apiResponse, setApiResponse] = useState("");
  const [numdays, setNumdays] = useState(null);
  const [test, setTest] = useState(false);
  const [apiTest, setApiTest] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [symptoms, setSymptoms] = useState([]);
  const [previousMessage, setPreviousMessage] = useState("");
  const scrollViewRef = useRef();
  useEffect(() => {
    console.log("Nouvelle valeur de test :", test);
    console.log("Nouvelle valeur de numdays :", numdays);
    console.log("Nouveaux symptômes :", symptoms);
    console.log("Nouveaux questions :", questions);
    console.log("Nouveaux indices :", currentQuestionIndex);
    console.log("api testé = :", apiTest);
  }, [test, numdays, symptoms, questions, currentQuestionIndex, apiTest]);
  useEffect(() => {
    // Défile automatiquement jusqu'à la fin dès que les messages changent
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const sendMessage = async () => {
    try {
      const lastMessage = messages.slice(-1);
      console.log("Dernier message :", lastMessage[0]?.text);
      const newMessage = message;
      if(test){
        console.log("eeeeeee", message);
          const daysresponse = await axios.get(`https://b140-197-26-141-66.ngrok-free.app/getDays`, {
            params: { message }
          });
          setMessages([...messages, { text: newMessage, isUser: true },{ text: "I want to ask you some question please enter yes or no", isUser: false }]);
          console.log(daysresponse.data);
          console.log(daysresponse.data.symptoms);
          if (daysresponse.data.numdays !== null && daysresponse.data.symptoms !== null) {
            setSymptoms(daysresponse.data.symptoms);
            setNumdays(daysresponse.data.numdays);
          } else {
            console.log("Les données reçues sont null ou undefined.");
          }
      
          console.log("les symptômes", symptoms);
          console.log(numdays, " days");
          setTest(false);
      }
      else if (numdays === null) {
        const response = await axios.get(`https://b140-197-26-141-66.ngrok-free.app/getData`, {
          params: { message }
        });

        const apiResponseMessage = response.data.response;
        setMessages([...messages, { text: newMessage, isUser: true }, { text: apiResponseMessage, isUser: false }]);
        console.log(messages);
        if (response.data.response.includes("How many days")) {
          setTest(true);
          console.log(test);
        }
      } 
      else if( numdays!==null) {
        if(!apiTest){
          console.log(numdays);
          const apipost = await axios.post('https://b140-197-26-141-66.ngrok-free.app/diagnose', {
            num_days: numdays,
            user_symptoms: symptoms
          });
  
          const apiResponseMessage = apipost.data;
        
          if (apiResponseMessage.primary_disease) {
            setMessages(prevMessages => [...prevMessages, { text: `Primary Disease: ${apiResponseMessage.primary_disease}`, isUser: false }]);
          }
          if (apiResponseMessage.secondary_disease) {
            setMessages(prevMessages => [...prevMessages, { text: `Secondary Disease: ${apiResponseMessage.secondary_disease}`, isUser: false }]);
          }
          if (apiResponseMessage.description_primary) {
            setMessages(prevMessages => [...prevMessages, { text: `Description (Primary Disease): ${apiResponseMessage.description_primary}`, isUser: false }]);
          }
          if (apiResponseMessage.description_secondary) {
            setMessages(prevMessages => [...prevMessages, { text: `Description (Secondary Disease): ${apiResponseMessage.description_secondary}`, isUser: false }]);
          }
          if (apiResponseMessage.precautions) {
            setMessages(prevMessages => [...prevMessages, { text: `Precautions: ${apiResponseMessage.precautions.join('\n* ')}`, isUser: false }]);
          }
          if (apiResponseMessage.calculated_condition) {
            setMessages(prevMessages => [...prevMessages, { text: `Condition: ${apiResponseMessage.calculated_condition}`, isUser: false }]);
          }
          if (apiResponseMessage.questions) {
            setQuestions(apiResponseMessage.questions);
            setCurrentQuestionIndex(0);
            setApiTest(true);
          }
        }
        if(questions.length!==0){
          if (currentQuestionIndex < questions.length) {
            // Handle user responses to questions
            if (newMessage==='yes'){
              setSymptoms(prevSymptoms => [
                ...prevSymptoms,
                questions[currentQuestionIndex-1]]);
            }
            setMessages(prevMessages => [
              ...prevMessages,
              { text: newMessage, isUser: true },
              { text: "do you have "+questions[currentQuestionIndex]+" ?", isUser: false }
            ]);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            console.log("zzzzz",symptoms);
          }else {
            setMessages(prevMessages => [
              ...prevMessages,
              { text: newMessage, isUser: true }]);
              setApiTest(false);
          }
        }
      }

      setMessage("");
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
      setMessages([
        ...messages,
        { text: message, isUser: true },
        { text: "Sorry, something went wrong.", isUser: false }
      ]);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <View style={styles.container}>
      <View style={styles.menuView}>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="menu" size={30} color="gray" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} ref={scrollViewRef} >
        {messages.map((msg, index) => (
          <View key={index} style={msg.isUser ? styles.chatViewUser : styles.chatViewbot}>
            <Text style={msg.isUser ? styles.userMessage : styles.botMessage}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputView}>
        <ImageBackground source={require('./../../assets/images/logoApp.png')} style={styles.backImage}>
        </ImageBackground>
        <TextInput
          style={styles.input}
          placeholder="Chat with me"
          keyboardType="default"
          autoCapitalize="none"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Chat 1</Text>
            <Text style={styles.modalText}>Chat 2</Text>
            <Text style={styles.modalText}>Chat 3</Text>
          </View>
        </View>
      </Modal>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 5,
    padding: 10,
  },
  icon: {
    paddingBottom: 20,
  },
  chatViewUser: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'flex-end', // Aligner à droite
  },
  chatViewbot: {
    backgroundColor: '#FFF',
    padding: 10,
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 50,
    borderColor: '#40B7B4',
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    borderColor: 'gray',
    borderWidth: 1
  },
  menuView: {
    position: 'absolute',
    top: 10,
    left: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  backImage: {
    width: 60,
    height: 60,
    padding: 30,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
  },
  apiResponse: {
    fontSize: 16,
    marginTop: 5,
    color: 'black', // Couleur de la réponse de l'API
    textAlign: 'center',
  },
  responseView: {
    marginVertical: 5,
    alignItems: 'center',
  },
  userMessage: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    marginVertical: 5,
  },
  botMessage: {
    fontSize: 16,
    color: '#40B7B4',
    textAlign: 'left',
    marginVertical: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
});
