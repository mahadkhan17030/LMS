import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';
import styled from 'styled-components';

// Initialize Firebase (replace with your config)
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

interface FeeStructure {
  id: string;
  class: string;
  tuitionFee: number;
  libraryFee: number;
  sportsFee: number;
  computerFee: number;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f0f7ff;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c5282;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3182ce;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #4299e1;
  color: white;
  padding: 0.75rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background-color: #48bb78;
  color: white;

  &:hover {
    background-color: #38a169;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #f56565;
  color: white;

  &:hover {
    background-color: #e53e3e;
  }
`;

const DetailButton = styled(ActionButton)`
  background-color: #4299e1;
  color: white;

  &:hover {
    background-color: #3182ce;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
`;

const CloseButton = styled.button`
  background-color: #e2e8f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const FeeStructure: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [newFee, setNewFee] = useState({
    class: '',
    tuitionFee: '',
    libraryFee: '',
    sportsFee: '',
    computerFee: ''
  });
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [detailFee, setDetailFee] = useState<FeeStructure | null>(null);

  useEffect(() => {
    const feeStructuresRef = ref(db, 'feeStructures');
    onValue(feeStructuresRef, (snapshot) => {
      const data = snapshot.val();
      const loadedFeeStructures: FeeStructure[] = [];
      for (const key in data) {
        loadedFeeStructures.push({ id: key, ...data[key] });
      }
      setFeeStructures(loadedFeeStructures);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingFee) {
      setEditingFee({ ...editingFee, [name]: name === 'class' ? value : parseFloat(value) });
    } else {
      setNewFee({ ...newFee, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFee) {
      const feeStructureRef = ref(db, `feeStructures/${editingFee.id}`);
      update(feeStructureRef, {
        class: editingFee.class,
        tuitionFee: editingFee.tuitionFee,
        libraryFee: editingFee.libraryFee,
        sportsFee: editingFee.sportsFee,
        computerFee: editingFee.computerFee
      });
      setEditingFee(null);
    } else {
      const feeStructuresRef = ref(db, 'feeStructures');
      push(feeStructuresRef, {
        class: newFee.class,
        tuitionFee: parseFloat(newFee.tuitionFee),
        libraryFee: parseFloat(newFee.libraryFee),
        sportsFee: parseFloat(newFee.sportsFee),
        computerFee: parseFloat(newFee.computerFee)
      });
    }
    setNewFee({
      class: '',
      tuitionFee: '',
      libraryFee: '',
      sportsFee: '',
      computerFee: ''
    });
  };

  const handleDelete = (id: string) => {
    const feeStructureRef = ref(db, `feeStructures/${id}`);
    remove(feeStructureRef);
  };

  const handleEdit = (fee: FeeStructure) => {
    setEditingFee(fee);
    setNewFee({
      class: fee.class,
      tuitionFee: fee.tuitionFee.toString(),
      libraryFee: fee.libraryFee.toString(),
      sportsFee: fee.sportsFee.toString(),
      computerFee: fee.computerFee.toString()
    });
  };

  const handleDetail = (fee: FeeStructure) => {
    setDetailFee(fee);
  };

  return (
    <Container>
      <Title>Fee Structure Management</Title>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="class"
            value={editingFee ? editingFee.class : newFee.class}
            onChange={handleInputChange}
            placeholder="Class"
            required
          />
          <Input
            type="number"
            name="tuitionFee"
            value={editingFee ? editingFee.tuitionFee : newFee.tuitionFee}
            onChange={handleInputChange}
            placeholder="Tuition Fee"
            required
          />
          <Input
            type="number"
            name="libraryFee"
            value={editingFee ? editingFee.libraryFee : newFee.libraryFee}
            onChange={handleInputChange}
            placeholder="Library Fee"
            required
          />
          <Input
            type="number"
            name="sportsFee"
            value={editingFee ? editingFee.sportsFee : newFee.sportsFee}
            onChange={handleInputChange}
            placeholder="Sports Fee"
            required
          />
          <Input
            type="number"
            name="computerFee"
            value={editingFee ? editingFee.computerFee : newFee.computerFee}
            onChange={handleInputChange}
            placeholder="Computer Fee"
            required
          />
          <Button type="submit">{editingFee ? 'Update' : 'Add'} Fee Structure</Button>
        </Form>
      </FormContainer>

      <Table>
        <thead>
          <tr>
            <Th>Class</Th>
            <Th>Tuition Fee</Th>
            <Th>Library Fee</Th>
            <Th>Sports Fee</Th>
            <Th>Computer Fee</Th>
            <Th>Total</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.map((fee) => (
            <tr key={fee.id}>
              <Td>{fee.class}</Td>
              <Td>${fee.tuitionFee}</Td>
              <Td>${fee.libraryFee}</Td>
              <Td>${fee.sportsFee}</Td>
              <Td>${fee.computerFee}</Td>
              <Td>${fee.tuitionFee + fee.libraryFee + fee.sportsFee + fee.computerFee}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(fee)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(fee.id)}>Delete</DeleteButton>
                <DetailButton onClick={() => handleDetail(fee)}>Detail</DetailButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {detailFee && (
        <Modal>
          <ModalContent>
            <h2>Fee Structure Details</h2>
            <p><strong>Class:</strong> {detailFee.class}</p>
            <p><strong>Tuition Fee:</strong> ${detailFee.tuitionFee}</p>
            <p><strong>Library Fee:</strong> ${detailFee.libraryFee}</p>
            <p><strong>Sports Fee:</strong> ${detailFee.sportsFee}</p>
            <p><strong>Computer Fee:</strong> ${detailFee.computerFee}</p>
            <p><strong>Total Fee:</strong> ${detailFee.tuitionFee + detailFee.libraryFee + detailFee.sportsFee + detailFee.computerFee}</p>
            <CloseButton onClick={() => setDetailFee(null)}>Close</CloseButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default FeeStructure;