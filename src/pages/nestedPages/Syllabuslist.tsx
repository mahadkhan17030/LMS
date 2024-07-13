import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import styled from 'styled-components';

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
const database = getDatabase(app);

interface Syllabus {
  id: string;
  course: string;
  instructor: string;
  description: string;
  topics: string[];
  duration: string;
}

export default function SyllabusList() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const syllabusRef = ref(database, 'Syllabus');
    onValue(syllabusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const syllabusList = Object.entries(data).map(([id, syllabus]: [string, any]) => ({
          id,
          ...syllabus,
        }));
        setSyllabuses(syllabusList);
      }
    });
  }, []);

  const handleDelete = (id: string) => {
    const syllabusRef = ref(database, `Syllabus/${id}`);
    remove(syllabusRef);
  };

  const handleEdit = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
    setIsEditing(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSyllabus) {
      const syllabusRef = ref(database, `Syllabus/${selectedSyllabus.id}`);
      update(syllabusRef, selectedSyllabus);
      setIsEditing(false);
      setSelectedSyllabus(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedSyllabus) {
      setSelectedSyllabus({
        ...selectedSyllabus,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <Container>
      <Title>Syllabus List</Title>
      {syllabuses.map((syllabus) => (
        <SyllabusItem key={syllabus.id}>
          <SyllabusInfo>
            <h3>{syllabus.course}</h3>
            <p>Instructor: {syllabus.instructor}</p>
            <p>Duration: {syllabus.duration}</p>
          </SyllabusInfo>
          <ButtonGroup>
            <Button onClick={() => setSelectedSyllabus(syllabus)}>Details</Button>
            <Button onClick={() => handleEdit(syllabus)}>Edit</Button>
            <Button onClick={() => handleDelete(syllabus.id)}>Delete</Button>
          </ButtonGroup>
        </SyllabusItem>
      ))}

      {selectedSyllabus && !isEditing && (
        <Modal>
          <ModalContent>
            <h2>{selectedSyllabus.course}</h2>
            <p>Instructor: {selectedSyllabus.instructor}</p>
            <p>Description: {selectedSyllabus.description}</p>
            <p>Topics: {selectedSyllabus.topics.join(', ')}</p>
            <p>Duration: {selectedSyllabus.duration}</p>
            <Button onClick={() => setSelectedSyllabus(null)}>Close</Button>
          </ModalContent>
        </Modal>
      )}

      {isEditing && selectedSyllabus && (
        <Modal>
          <ModalContent>
            <form onSubmit={handleUpdate}>
              <Input
                type="text"
                name="course"
                value={selectedSyllabus.course}
                onChange={handleInputChange}
                placeholder="Course Name"
              />
              <Input
                type="text"
                name="instructor"
                value={selectedSyllabus.instructor}
                onChange={handleInputChange}
                placeholder="Instructor Name"
              />
              <TextArea
                name="description"
                value={selectedSyllabus.description}
                onChange={handleInputChange}
                placeholder="Description"
              />
              <Input
                type="text"
                name="topics"
                value={selectedSyllabus.topics.join(', ')}
                onChange={(e) => setSelectedSyllabus({
                  ...selectedSyllabus,
                  topics: e.target.value.split(',').map(topic => topic.trim())
                })}
                placeholder="Topics (comma-separated)"
              />
              <Input
                type="text"
                name="duration"
                value={selectedSyllabus.duration}
                onChange={handleInputChange}
                placeholder="Duration"
              />
              <Button type="submit">Update</Button>
              <Button onClick={() => {
                setIsEditing(false);
                setSelectedSyllabus(null);
              }}>Cancel</Button>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

const SyllabusItem = styled.div`
  background-color: #f0f8ff;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SyllabusInfo = styled.div`
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
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
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1 px solid #ccc;
  border-radius: 3px;
  min-height: 100px;
`;