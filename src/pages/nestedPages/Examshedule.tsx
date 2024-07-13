import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0oDfjQY_7SToBfMjHUybvOXjltA1HgFY",
    authDomain: "software-lms-cada3.firebaseapp.com",
    databaseURL: "https://software-lms-cada3-default-rtdb.firebaseio.com",
    projectId: "software-lms-cada3",
    storageBucket: "software-lms-cada3.appspot.com",
    messagingSenderId: "595895974186",
    appId: "1:595895974186:web:f944bd9f8d7dd663ce0653",
    measurementId: "G-ZYJ18KKD7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface ExamScheduleItem {
  id: string;
  className: string;
  subject: string;
  date: string;
  time: string;
}

const ExamSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>([]);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const querySnapshot = await getDocs(collection(db, 'ExamSchedule'));
    const scheduleList: ExamScheduleItem[] = [];
    querySnapshot.forEach((doc) => {
      scheduleList.push({ id: doc.id, ...doc.data() } as ExamScheduleItem);
    });
    setSchedules(scheduleList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'ExamSchedule', editingId), {
          className,
          subject,
          date,
          time,
        });
        setSchedules(schedules.map(schedule => 
          schedule.id === editingId ? { ...schedule, className, subject, date, time } : schedule
        ));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'ExamSchedule'), {
          className,
          subject,
          date,
          time,
        });
        const newSchedule: ExamScheduleItem = {
          id: docRef.id,
          className,
          subject,
          date,
          time,
        };
        setSchedules([...schedules, newSchedule]);
      }
      setClassName('');
      setSubject('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Error adding/updating exam schedule: ', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ExamSchedule', id));
      setSchedules(schedules.filter(schedule => schedule.id !== id));
    } catch (error) {
      console.error('Error deleting exam schedule: ', error);
    }
  };

  const handleEdit = (schedule: ExamScheduleItem) => {
    setClassName(schedule.className);
    setSubject(schedule.subject);
    setDate(schedule.date);
    setTime(schedule.time);
    setEditingId(schedule.id);
  };

  const handleDetail = (id: string) => {
    setDetailId(id === detailId ? null : id);
  };

  return (
    <Container>
      <Title>Exam Schedule</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <SubmitButton type="submit">{editingId ? 'Update' : 'Add'} Exam</SubmitButton>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>Class Name</Th>
            <Th>Subject</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <React.Fragment key={schedule.id}>
              <tr>
                <Td>{schedule.className}</Td>
                <Td>{schedule.subject}</Td>
                <Td>{schedule.date}</Td>
                <Td>{schedule.time}</Td>
                <Td>
                  <ActionButton onClick={() => handleEdit(schedule)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDelete(schedule.id)}>Delete</ActionButton>
                  <ActionButton onClick={() => handleDetail(schedule.id)}>
                    {detailId === schedule.id ? 'Hide' : 'Details'}
                  </ActionButton>
                </Td>
              </tr>
              {detailId === schedule.id && (
                <tr>
                  <DetailTd colSpan={5}>
                    <strong>ID:</strong> {schedule.id}<br />
                    <strong>Class Name:</strong> {schedule.className}<br />
                    <strong>Subject:</strong> {schedule.subject}<br />
                    <strong>Date:</strong> {schedule.date}<br />
                    <strong>Time:</strong> {schedule.time}
                  </DetailTd>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #3498db;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #bdc3c7;
  padding: 10px;
`;

const DetailTd = styled(Td)`
  background-color: #f8f9fa;
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5px;

  &:hover {
    background-color: #2980b9;
  }
`;

export default ExamSchedule;