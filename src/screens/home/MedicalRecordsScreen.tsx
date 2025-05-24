import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';
import { RootState } from '../../store/store';
import { getMedicalRecordsByPatientId, getPrescriptionByRecordId, getPatientByUserId } from '../../api/doctorApi';
import { MedicalRecordResponse, PrescriptionResponse, PrescriptionDetailResponse } from '../../types/doctor';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/type';

type MedicalRecordsNavigationProp = StackNavigationProp<RootStackParamList>;

const MedicalRecordsScreen = () => {
  const navigation = useNavigation<MedicalRecordsNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.userId);
  const [records, setRecords] = useState<MedicalRecordResponse[]>([]);
  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        setLoading(false);
        return;
      }
      try {
        const userData = await getPatientByUserId(user as number);
        const recordsData = await getMedicalRecordsByPatientId(userData.id);
        const sortedRecords = recordsData.sort((a, b) =>
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        );
        setRecords(sortedRecords);
      } catch (error) {
        Alert.alert('Error', 'Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user]);

  const fetchPrescription = async (recordId: number) => {
    setPrescriptionLoading(true);
    try {
      const prescriptionData = await getPrescriptionByRecordId(recordId);
      setPrescription(prescriptionData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load prescription');
      setPrescription(null);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const toggleRecord = (recordId: number) => {
    if (selectedRecordId === recordId) {
      setSelectedRecordId(null);
      setPrescription(null);
    } else {
      setSelectedRecordId(recordId);
      fetchPrescription(recordId);
    }
  };

  const renderPrescriptionTable = (details: PrescriptionDetailResponse[]) => (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tên thuốc</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Số lượng</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Liều lượng</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Ghi chú</Text>
      </View>
      {/* Table Rows */}
      {details.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>{item.medicineName}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{item.dosage}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{item.notes || 'Không có'}</Text>
        </View>
      ))}
    </View>
  );

  const renderRecordItem = ({ item }: { item: MedicalRecordResponse }) => {
    const isExpanded = selectedRecordId === item.id;
    return (
      <View style={styles.recordWrapper}>
        <TouchableOpacity
          style={[styles.recordCard, isExpanded && styles.recordCardExpanded]}
          onPress={() => toggleRecord(item.id)}
        >
          <View style={styles.recordContent}>
            <View>
              <Text style={styles.recordText}>
                <Text style={styles.recordLabel}>Ngày khám: </Text>
                {new Date(item.visitDate).toLocaleDateString('vi-VN')}
              </Text>
              <Text style={styles.recordText}>
                <Text style={styles.recordLabel}>Bác sĩ: </Text>
                {item.doctorName}
              </Text>
              <Text style={styles.recordText}>
                <Text style={styles.recordLabel}>Triệu chứng: </Text>
                {item.initialSymptoms}
              </Text>
              <Text style={styles.recordText}>
                <Text style={styles.recordLabel}>Chẩn đoán: </Text>
                {item.diagnosis}
              </Text>
            </View>
            <Icon
              name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.primary}
              style={isExpanded && styles.iconExpanded}
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.prescriptionContainer}>
            {prescriptionLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : prescription && prescription.details.length > 0 ? (
              renderPrescriptionTable(prescription.details)
            ) : (
              <Text style={styles.noPrescriptionText}>Không có đơn thuốc</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả khám bệnh</Text>
      </View>
      {/* Records List */}
      {records.length > 0 ? (
        <FlatList
          data={records}
          renderItem={renderRecordItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.recordList}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <Text style={styles.noRecordsText}>Không có phiếu khám nào</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 16,
  },
  recordList: {
    flex: 1,
  },
  recordWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  recordCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recordCardExpanded: {
    borderColor: colors.primary,
    backgroundColor: '#F8FBFF',
  },
  recordContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  recordLabel: {
    fontWeight: '700',
    color: colors.secondary,
  },
  iconExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  prescriptionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  tableCell: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'left',
  },
  noPrescriptionText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    paddingVertical: 16,
  },
  noRecordsText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default MedicalRecordsScreen;