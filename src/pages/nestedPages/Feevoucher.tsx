import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const Feevoucher: React.FC = () => {
  const [feeSubmissions, setFeeSubmissions] = useState<FeeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeeSubmissions();
  }, []);

  const fetchFeeSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'FeeSubmission'));
      const feeSubmissionList: FeeSubmission[] = [];
      querySnapshot.forEach((doc) => {
        feeSubmissionList.push({ id: doc.id, ...doc.data() } as FeeSubmission);
      });
      setFeeSubmissions(feeSubmissionList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching fee submissions: ', err);
      setError('Failed to fetch fee submissions. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading fee vouchers...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Fee Vouchers</Title>
      {feeSubmissions.length === 0 ? (
        <NoDataMessage>No fee submissions found.</NoDataMessage>
      ) : (
        <VoucherGrid>
          {feeSubmissions.map((submission) => (
            <VoucherCard key={submission.id}>
              <StudentName>{submission.studentName}</StudentName>
              <VoucherDetail>
                <Label>Amount:</Label>
                <Value>${submission.amount.toFixed(2)}</Value>
              </VoucherDetail>
              <VoucherDetail>
                <Label>Payment Date:</Label>
                <Value>{submission.paymentDate}</Value>
              </VoucherDetail>
              <VoucherDetail>
                <Label>Payment Method:</Label>
                <Value>{submission.paymentMethod}</Value>
              </VoucherDetail>
              <VoucherNumber>Voucher #: {submission.id.slice(0, 8)}</VoucherNumber>
            </VoucherCard>
          ))}
        </VoucherGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
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
  margin-bottom: 30px;
  font-size: 2.5rem;
`;

const VoucherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const VoucherCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StudentName = styled.h2`
  color: #3498db;
  margin-bottom: 15px;
  font-size: 1.5rem;
`;

const VoucherDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  color: #7f8c8d;
  font-weight: bold;
`;

const Value = styled.span`
  color: #2c3e50;
`;

const VoucherNumber = styled.div`
  margin-top: 15px;
  text-align: right;
  font-size: 0.9rem;
  color: #95a5a6;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #3498db;
  margin-top: 50px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #e74c3c;
  margin-top: 50px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-top: 50px;
`;

export default Feevoucher;