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

interface FeeSubmission {
  id: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

const FeeSubmissionForm: React.FC = () => {
  const [feeSubmissions, setFeeSubmissions] = useState<FeeSubmission[]>([]);
  const [studentName, setStudentName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetchFeeSubmissions();
  }, []);

  const fetchFeeSubmissions = async () => {
    const querySnapshot = await getDocs(collection(db, 'FeeSubmission'));
    const feeSubmissionList: FeeSubmission[] = [];
    querySnapshot.forEach((doc) => {
      feeSubmissionList.push({ id: doc.id, ...doc.data() } as FeeSubmission);
    });
    setFeeSubmissions(feeSubmissionList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'FeeSubmission'), {
        studentName,
        amount: parseFloat(amount),
        paymentDate,
        paymentMethod,
      });
      setStudentName('');
      setAmount('');
      setPaymentDate('');
      setPaymentMethod('');
      fetchFeeSubmissions();
    } catch (error) {
      console.error('Error adding fee submission: ', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'FeeSubmission', id));
      fetchFeeSubmissions();
    } catch (error) {
      console.error('Error deleting fee submission: ', error);
    }
  };

  const handleEdit = async (feeSubmission: FeeSubmission) => {
    const newAmount = prompt('Enter new amount', feeSubmission.amount.toString());
    if (newAmount) {
      try {
        await updateDoc(doc(db, 'FeeSubmission', feeSubmission.id), { amount: parseFloat(newAmount) });
        fetchFeeSubmissions();
      } catch (error) {
        console.error('Error updating fee submission: ', error);
      }
    }
  };

  return (
    <Container>
      <Title>Fee Submission Form</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          type="date"
          placeholder="Payment Date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          required
        />
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </Select>
        <SubmitButton type="submit">Submit Fee</SubmitButton>
      </Form>
      <Table>
        <thead>
          <tr>
            <Th>Student Name</Th>
            <Th>Amount</Th>
            <Th>Payment Date</Th>
            <Th>Payment Method</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {feeSubmissions.map((submission) => (
            <tr key={submission.id}>
              <Td>{submission.studentName}</Td>
              <Td>${submission.amount.toFixed(2)}</Td>
              <Td>{submission.paymentDate}</Td>
              <Td>{submission.paymentMethod}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(submission)}>Edit</ActionButton>
                <ActionButton onClick={() => handleDelete(submission.id)}>Delete</ActionButton>
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
  font-family: 'Roboto', sans-serif;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 12px;
  text-align: left;
  border-radius: 6px 6px 0 0;
`;

const Td = styled.td`
  background-color: white;
  padding: 12px;
  border-top: 1px solid #ecf0f1;
  border-bottom: 1px solid #ecf0f1;

  &:first-child {
    border-left: 1px solid #ecf0f1;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &:last-child {
    border-right: 1px solid #ecf0f1;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const ActionButton = styled.button`
  margin-right: 5px;
  padding: 6px 12px;
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

export default FeeSubmissionForm;