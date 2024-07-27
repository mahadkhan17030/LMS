import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, update, remove, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Student {
  id: string;
  name: string;
  currentClass: string;
}

const classOptions = [
  'Prep', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Matric'
];

const TransferStudent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [targetClass, setTargetClass] = useState<string>('');
  const [transferredStudents, setTransferredStudents] = useState<{[key: string]: Student[]}>({});

  useEffect(() => {
    const studentsRef = ref(database, 'StudentsaddEdit');
    const transferredStudentsRef = ref(database, 'transferredStudents');

    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).map(([id, student]: [string, any]) => ({
          id,
          name: student.name,
          currentClass: student.currentClass,
        }));
        setStudents(studentList);
      }
    });

    onValue(transferredStudentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const grouped = Object.entries(data).reduce((acc, [id, student]: [string, any]) => {
          const { currentClass } = student;
          if (!acc[currentClass]) {
            acc[currentClass] = [];
          }
          acc[currentClass].push({ id, ...student });
          return acc;
        }, {} as {[key: string]: Student[]});
        setTransferredStudents(grouped);
      }
    });
  }, []);

  const handleTransfer = () => {
    if (selectedStudent && targetClass) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        const transferredStudentsRef = ref(database, 'transferredStudents');
        push(transferredStudentsRef, {
          name: student.name,
          previousClass: student.currentClass,
          currentClass: targetClass,
        })
          .then(() => {
            const studentRef = ref(database, `StudentsaddEdit/${selectedStudent}`);
            return update(studentRef, { currentClass: targetClass });
          })
          .then(() => {
            alert('Student transferred successfully!');
            setSelectedStudent('');
            setTargetClass('');
          })
          .catch((error) => {
            console.error('Error transferring student:', error);
            alert('Failed to transfer student. Please try again.');
          });
      }
    }
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const studentRef = ref(database, `transferredStudents/${studentId}`);
      remove(studentRef)
        .then(() => {
          alert('Student deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        });
    }
  };

  const handleEdit = (student: Student) => {
    // Implement edit functionality here
    console.log('Editing student:', student);
  };

  return (
    <Container>
      <Title>Transfer Student</Title>
      <TransferForm>
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} (Current Class: {student.currentClass})
            </option>
          ))}
        </Select>
        <Select
          value={targetClass}
          onChange={(e) => setTargetClass(e.target.value)}
        >
          <option value="">Select Target Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </Select>
        <TransferButton onClick={handleTransfer}>Transfer</TransferButton>
      </TransferForm>
      <TransferredStudentsContainer>
        <h2>Transferred Students</h2>
        {Object.entries(transferredStudents).map(([className, studentsInClass]) => (
          <ClassBox key={className}>
            <h3>{className}</h3>
            {studentsInClass.map((student) => (
              <StudentItem key={student.id}>
                <span>{student.name}</span>
                <ButtonGroup>
                  <DetailButton onClick={() => alert(`Student Details: ${JSON.stringify(student)}`)}>
                    Detail
                  </DetailButton>
                  <EditButton onClick={() => handleEdit(student)}>Edit</EditButton>
                  <DeleteButton onClick={() => handleDelete(student.id)}>Delete</DeleteButton>
                </ButtonGroup>
              </StudentItem>
            ))}
          </ClassBox>
        ))}
      </TransferredStudentsContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const TransferForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #3498db;
  border-radius: 4px;
  font-size: 1rem;
`;

const TransferButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const TransferredStudentsContainer = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const ClassBox = styled.div`
  background-color: #ecf0f1;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;

  h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
`;

const StudentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #bdc3c7;

  &:last-child {
    border-bottom: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const DetailButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
  }
`;

const EditButton = styled(Button)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

export default TransferStudent;