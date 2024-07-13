import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Student {
  key: string;
  name: string;
  fatherName: string;
  email: string;
  age: number;
  classLevel: string;
  studentId: string;
}

const StudentTable: React.FC = () => {
  const [students, setStudents] = useState<{ [key: string]: Student[] }>({});
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const studentsRef = ref(database, 'StudentsaddEdit');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const groupedStudents: { [key: string]: Student[] } = {};
        Object.entries(data).forEach(([key, student]: [string, any]) => {
          if (!groupedStudents[student.classLevel]) {
            groupedStudents[student.classLevel] = [];
          }
          groupedStudents[student.classLevel].push({ ...student, key });
        });
        setStudents(groupedStudents);
      }
    });
  }, []);

  const classLevels = [
    'Prep', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 (Matric)'
  ];

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const handleDelete = (student: Student) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const studentRef = ref(database, `StudentsaddEdit/${student.key}`);
      remove(studentRef);
    }
  };

  const handleSave = (updatedStudent: Student) => {
    const studentRef = ref(database, `StudentsaddEdit/${updatedStudent.key}`);
    update(studentRef, updatedStudent);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  const filteredStudents = selectedClass && students[selectedClass]
    ? students[selectedClass].filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Container>
      <Title>Students by Class</Title>
      <ClassBoxContainer>
        {classLevels.map((level) => (
          <ClassBox
            key={level}
            onClick={() => setSelectedClass(level)}
            isSelected={selectedClass === level}
          >
            <ClassName>Class {level}</ClassName>
            <TotalStudents>Total Students:</TotalStudents>
            <StudentCount isSelected={selectedClass === level}>
              {students[level] ? students[level].length : 0}
            </StudentCount>
          </ClassBox>
        ))}
      </ClassBoxContainer>
      {selectedClass && (
        <>
          <SearchBar
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredStudents.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Student ID</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <Tr key={student.key}>
                    <Td>{student.name}</Td>
                    <Td>{student.studentId}</Td>
                    <Td>
                      <ButtonGroup>
                        <DetailButton onClick={() => setSelectedStudent(student)}>Detail</DetailButton>
                        <EditButton onClick={() => handleEdit(student)}>Edit</EditButton>
                        <DeleteButton onClick={() => handleDelete(student)}>Delete</DeleteButton>
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoStudentsMessage>No students added to this class.</NoStudentsMessage>
          )}
        </>
      )}
      {selectedStudent && !isEditing && (
        <Modal>
          <ModalContent>
            <h2>Student Details</h2>
            <p>Name: {selectedStudent.name}</p>
            <p>Father's Name: {selectedStudent.fatherName}</p>
            <p>Email: {selectedStudent.email}</p>
            <p>Age: {selectedStudent.age}</p>
            <p>Class: {selectedStudent.classLevel}</p>
            <p>Student ID: {selectedStudent.studentId}</p>
            <CloseButton onClick={() => setSelectedStudent(null)}>Close</CloseButton>
          </ModalContent>
        </Modal>
      )}
      {isEditing && selectedStudent && (
        <Modal>
          <ModalContent>
            <h2>Edit Student</h2>
            <Input
              value={selectedStudent.name}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={selectedStudent.fatherName}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, fatherName: e.target.value })}
              placeholder="Father's Name"
            />
            <Input
              value={selectedStudent.email}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={selectedStudent.age}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, age: Number(e.target.value) })}
              placeholder="Age"
              type="number"
            />
            <Select
              value={selectedStudent.classLevel}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, classLevel: e.target.value })}
            >
              {classLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
            <Input
              value={selectedStudent.studentId}
              onChange={(e) => setSelectedStudent({ ...selectedStudent, studentId: e.target.value })}
              placeholder="Student ID"
            />
            <ButtonGroup>
              <SaveButton onClick={() => handleSave(selectedStudent)}>Save</SaveButton>
              <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1.5rem auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 95%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #054bb4;
  font-size: 2.2rem;
  font-weight: bold;
`;

const ClassBoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ClassBox = styled.div<{ isSelected: boolean }>`
  background-color: ${props => props.isSelected ? '#054bb4' : '#ffffff'};
  color: ${props => props.isSelected ? '#ffffff' : '#054bb4'};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ClassName = styled.span`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TotalStudents = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const StudentCount = styled.span<{ isSelected: boolean }>`
  font-size: 1.5rem;
  margin-top: 0.3rem;
  color: ${props => props.isSelected ? '#ffffff' : '#00CED1'};
  font-weight: bold;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #054bb4;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #054bb4;
    box-shadow: 0 0 0 2px rgba(5, 75, 180, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #054bb4;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  font-weight: bold;
  font-size: 0.8rem;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DetailButton = styled(Button)`
  background-color: #054bb4;
  color: white;

  &:hover {
    background-color: #043584;
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
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1.2rem;
    color: #054bb4;
    font-size: 1.5rem;
  }

  p {
    margin: 0.6rem 0;
    color: #34495e;
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: #054bb4;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease-in-out;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #054bb4;
  }
`;

const SaveButton = styled(Button)`
  background-color: #054bb4;
  color: white;

  &:hover {
    background-color: #043584;
  }
`;

const CancelButton = styled(Button)`
  background-color: #95a5a6;
  color: white;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const CloseButton = styled(Button)`
  background-color: #054bb4;
  color: white;
  margin-top: 1rem;

  &:hover {
    background-color: #043584;
  }
`;

const NoStudentsMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-top: 2rem;
`;

export default StudentTable;