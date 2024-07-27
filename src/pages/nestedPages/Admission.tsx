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

interface Admission {
  id: string;
  name: string;
  email: string;
  course: string;
  dateOfBirth: string;
}

const AdmissionForm: React.FC = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    const querySnapshot = await getDocs(collection(db, 'Admission'));
    const admissionsList: Admission[] = [];
    querySnapshot.forEach((doc) => {
      admissionsList.push({ id: doc.id, ...doc.data() } as Admission);
    });
    setAdmissions(admissionsList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Admission'), {
        name,
        email,
        course,
        dateOfBirth,
      });
      setName('');
      setEmail('');
      setCourse('');
      setDateOfBirth('');
      fetchAdmissions();
    } catch (error) {
      console.error('Error adding admission: ', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Admission', id));
      fetchAdmissions();
    } catch (error) {
      console.error('Error deleting admission: ', error);
    }
  };

  const handleEdit = async (admission: Admission) => {
    const newName = prompt('Enter new name', admission.name);
    if (newName) {
      try {
        await updateDoc(doc(db, 'Admission', admission.id), { name: newName });
        fetchAdmissions();
      } catch (error) {
        console.error('Error updating admission: ', error);
      }
    }
  };

  return (
    <Container>
      <Title>Admission Form</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <Input
          type="date"
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Course</Th>
            <Th>Date of Birth</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission) => (
            <tr key={admission.id}>
              <Td>{admission.name}</Td>
              <Td>{admission.email}</Td>
              <Td>{admission.course}</Td>
              <Td>{admission.dateOfBirth}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(admission)}>Edit</ActionButton>
                <ActionButton onClick={() => handleDelete(admission.id)}>Delete</ActionButton>
                <ActionButton onClick={() => alert(JSON.stringify(admission, null, 2))}>
                  Details
                </ActionButton>
              </Td>
            </tr>
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
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ecf0f1;
  padding: 10px;
`;

const ActionButton = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

export default AdmissionForm;