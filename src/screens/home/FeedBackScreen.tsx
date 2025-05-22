import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { getFeedbacks, createFeedback,getPatientByUserId } from '../../api/doctorApi';
import { Feedback, Patient } from '../../types/doctor';
import { colors } from '../../constants/colors';
import { formatDateNoWeek } from '../../utils/helpers';

const FeedbackScreen = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  const user = useSelector((state: RootState) => state.auth.userId);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks();
      setFeedbacks(data.reverse());
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
      try {
        const [patientData] = await Promise.all([
          getPatientByUserId(user as number),
        ]);
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load patient.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadFeedbacks();
    fetchData();
  }, [user]);

  const handleAddFeedback = async () => {
    if (!comment.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nhận xét.');
      return;
    }

    try {
      await createFeedback( patient?.id as number, rating, comment);
      setModalVisible(false);
      setComment('');
      setRating(5);
      loadFeedbacks(); // reload
    } catch (error) {
      console.error('Error creating feedback:', error);
      Alert.alert('Lỗi', 'Không thể gửi phản hồi.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < rating ? 'star' : 'star-border'}
            size={20}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Feedback }) => (
    <View style={styles.card}>
      {renderStars(item.rating)}
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>{formatDateNoWeek(item.createdAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phản hồi của bệnh nhân</Text>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadFeedbacks}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Gửi phản hồi</Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Icon
                    name={star <= rating ? 'star' : 'star-border'}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Nhận xét của bạn"
              value={comment}
              onChangeText={setComment}
              multiline
              style={styles.textInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddFeedback} style={styles.submitBtn}>
                <Text style={{ color: '#fff' }}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#66CCFF',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
    marginBottom: 16,
    alignSelf: 'center',
    color: '#fff',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  comment: {
    fontSize: 14,
    marginVertical: 8,
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    marginRight: 10,
    padding: 10,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
