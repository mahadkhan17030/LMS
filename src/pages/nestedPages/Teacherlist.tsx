import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Teacher {
  key: string;
  name: string;
  email: string;
  subject: string;
  qualification: string;
  teacherId: string;
}

const TeacherTable: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const teachersRef = ref(database, 'TeachersAddEdit');
    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teacherList: Teacher[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          key,
          ...value
        }));
        setTeachers(teacherList);
      }
    });
  }, []);

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);
  };

  const handleDelete = (teacher: Teacher) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const teacherRef = ref(database, `TeachersAddEdit/${teacher.key}`);
      remove(teacherRef);
    }
  };

  const handleSave = (updatedTeacher: Teacher) => {
    const teacherRef = ref(database, `TeachersAddEdit/${updatedTeacher.key}`);
    update(teacherRef, updatedTeacher);
    setSelectedTeacher(null);
    setIsEditing(false);
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>Teacher List</Title>
      <SearchBar
        type="text"
        placeholder="Search by name or subject"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredTeachers.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Subject</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <Tr key={teacher.key}>
                <Td>{teacher.name}</Td>
                <Td>{teacher.subject}</Td>
                <Td>
                  <ButtonGroup>
                    <DetailButton onClick={() => setSelectedTeacher(teacher)}>Detail</DetailButton>
                    <EditButton onClick={() => handleEdit(teacher)}>Edit</EditButton>
                    <DeleteButton onClick={() => handleDelete(teacher)}>Delete</DeleteButton>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoTeachersMessage>No teachers found.</NoTeachersMessage>
      )}
      {selectedTeacher && !isEditing && (
        <Modal>
          <ModalContent>
            <h2>Teacher Details</h2>
            <p>Name: {selectedTeacher.name}</p>
            <p>Email: {selectedTeacher.email}</p>
            <p>Subject: {selectedTeacher.subject}</p>
            <p>Qualification: {selectedTeacher.qualification}</p>
            <p>Teacher ID: {selectedTeacher.teacherId}</p>
            <CloseButton onClick={() => setSelectedTeacher(null)}>Close</CloseButton>
          </ModalContent>
        </Modal>
      )}
      {isEditing && selectedTeacher && (
        <Modal>
          <ModalContent>
            <h2>Edit Teacher</h2>
            <Input
              value={selectedTeacher.name}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
              placeholder="Name"
            />
            <Input
              value={selectedTeacher.email}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
              placeholder="Email"
            />
            <Input
              value={selectedTeacher.subject}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subject: e.target.value })}
              placeholder="Subject"
            />
            <Input
              value={selectedTeacher.qualification}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, qualification: e.target.value })}
              placeholder="Qualification"
            />
            <Input
              value={selectedTeacher.teacherId}
              onChange={(e) => setSelectedTeacher({ ...selectedTeacher, teacherId: e.target.value })}
              placeholder="Teacher ID"
            />
            <ButtonGroup>
              <SaveButton onClick={() => handleSave(selectedTeacher)}>Save</SaveButton>
              <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #f0f4f8;
  padding: 2rem;
  border-radius: 12px;
  margin: 2rem auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 95%;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: bold;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border: 1px solid #3498db;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 1.2rem;
  text-align: left;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 1rem;
  background-color: #ffffff;
  border-top: 1px solid #ecf0f1;
`;

const Tr = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background-color: #f7f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
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
  padding: 2.5rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h2 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.8rem;
  }

  p {
    margin: 0.8rem 0;
    color: #34495e;
    font-size: 1.1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const SaveButton = styled(Button)`
  background-color: #3498db;
  color: white;

  &:hover {
    background-color: #2980b9;
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
  background-color: #3498db;
  color: white;
  margin-top: 1.5rem;

  &:hover {
    background-color: #2980b9;
  }
`;

const NoTeachersMessage = styled.p`
  text-align: center;
  font-size: 1.3rem;
  color: #7f8c8d;
  margin-top: 2.5rem;
`;

export default TeacherTable;