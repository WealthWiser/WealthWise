import React, { useState, useRef, useEffect} from 'react';
import { InteractionManager } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '👋 Hi there! How can I assist you today?', anim: new Animated.Value(1) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typing effect animation
  const dotAnim = [useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const sendAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef();

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input.trim(),
      anim: new Animated.Value(0),
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        type: 'bot',
        text: "🤖 I'm still learning. Soon I'll fetch insights from Gemini!",
        anim: new Animated.Value(0),
      };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.anim) {
        Animated.timing(lastMsg.anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [messages]);

  useEffect(() => {
    let loop;
    if (isTyping) {
      dotAnim.forEach(anim => anim.setValue(0));
      loop = Animated.loop(
        Animated.stagger(160, dotAnim.map(anim =>
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true, easing: Easing.linear }),
            Animated.timing(anim, { toValue: 0.25, duration: 320, useNativeDriver: true, easing: Easing.linear }),
          ])
        )),
      );
      loop.start();
    }
    return () => {
      if (loop) loop.stop();
      dotAnim.forEach(anim => anim.setValue(0));
    };
  }, [isTyping]);

  const handleSendPressIn = () => {
    Animated.spring(sendAnim, { toValue: 1.15, useNativeDriver: true }).start();
  };
  const handleSendPressOut = () => {
    Animated.spring(sendAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
        InteractionManager.runAfterInteractions(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      }}
      >
        {messages.map(msg => (
          <Animated.View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.type === 'user' ? styles.userBubble : styles.botBubble,
              msg.anim && {
                opacity: msg.anim,
                transform: [{ translateY: msg.anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
              }
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.type === 'user' ? styles.userText : styles.botText
            ]}>
              {msg.text}
            </Text>
          </Animated.View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
            <View style={styles.typingDots}>
              {dotAnim.map((anim, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      opacity: anim,
                      transform: [{ scale: anim }],
                    }
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#adb5bd"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <Animated.View style={{ transform: [{ scale: sendAnim }] }}>
          <TouchableOpacity
            style={[styles.sendButton, input.trim() && styles.sendButtonActive]}
            onPress={sendMessage}
            onPressIn={handleSendPressIn}
            onPressOut={handleSendPressOut}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fc',
  },
  chatContainer: {
    flexGrow: 1,
    padding: 22,
    paddingBottom: 90,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 14,
    shadowColor: '#446be666',
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderRadius: 22,
    padding: 0,
  },
  userBubble: {
    backgroundColor: '#3164ec',
    alignSelf: 'flex-end',
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 22,
    padding: 14,
  },
  botBubble: {
    backgroundColor: '#e2eafb',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 9,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderColor: '#d0dbfb',
    padding: 14,
  },
  messageText: {
    fontSize: 17,
    color: '#1e293b',
    lineHeight: 24,
    letterSpacing: 0.08,
  },
  userText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  botText: {
    color: '#375376',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    shadowColor: '#3164ec33',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 7,
  },
  input: {
    flex: 1,
    backgroundColor: '#eef2f6',
    borderRadius: 19,
    paddingHorizontal: 17,
    paddingVertical: 10,
    fontSize: 17,
    maxHeight: 110,
    marginRight: 7,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#e2e6ec',
  },
  sendButton: {
    backgroundColor: '#cddcfa',
    borderRadius: 50,
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3164ec55',
    shadowOpacity: 0.11,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  sendButtonActive: {
    backgroundColor: '#3164ec',
    shadowOpacity: 0.24,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  typingBubble: {
    minHeight: 32,
    borderRadius: 22,
    backgroundColor: '#dce7fd',
    shadowColor: '#d0dbfb',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    height: 18,
    minWidth: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3164ec',
    marginHorizontal: 1.5,
  },
}); 