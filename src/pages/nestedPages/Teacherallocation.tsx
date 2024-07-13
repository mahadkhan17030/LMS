import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import app from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Teacher {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

interface Allocation {
  id: string;
  teacherId: string;
  courseId: string;
}

const TeacherAllocation: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    const teachersRef = ref(database, 'TeachersAddEdit');
    const coursesRef = ref(database, 'SubjectAddEdit');
    const allocationsRef = ref(database, 'Allocations');

    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teacherList = Object.entries(data).map(([id, teacher]: [string, any]) => ({
          id,
          name: teacher.name,
        }));
        setTeachers(teacherList);
      }
    });

    onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const courseList = Object.entries(data).map(([id, course]: [string, any]) => ({
          id,
          name: course.name,
        }));
        setCourses(courseList);
      }
    });

    onValue(allocationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allocationList = Object.entries(data).map(([id, allocation]: [string, any]) => ({
          id,
          teacherId: allocation.teacherId,
          courseId: allocation.courseId,
        }));
        setAllocations(allocationList);
      }
    });
  }, []);

  const handleAllocate = () => {
    if (selectedTeacher && selectedCourse) {
      const newAllocation = {
        teacherId: selectedTeacher,
        courseId: selectedCourse,
      };
      push(ref(database, 'Allocations'), newAllocation);
      setSelectedTeacher('');
      setSelectedCourse('');
    }
  };

  const handleDeallocate = (allocationId: string) => {
    remove(ref(database, `Allocations/${allocationId}`));
  };

  return (
    <Container>
      <Title>Teacher Allocation</Title>
      <AllocationForm>
        <Select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </Select>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Select>
        <AllocateButton onClick={handleAllocate}>Allocate</AllocateButton>
      </AllocationForm>
      <AllocationList>
        <h2>Current Allocations</h2>
        {allocations.map((allocation) => (
          <AllocationItem key={allocation.id}>
            <span>
              {teachers.find((t) => t.id === allocation.teacherId)?.name} -{' '}
              {courses.find((c) => c.id === allocation.courseId)?.name}
            </span>
            <DeallocateButton onClick={() => handleDeallocate(allocation.id)}>
              Deallocate
            </DeallocateButton>
          </AllocationItem>
        ))}
      </AllocationList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
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

const AllocationForm = styled.div`
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

const AllocateButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27ae60;
  }
`;

const AllocationList = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const AllocationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

const DeallocateButton = styled.button`
  padding: 0.3rem 0.6rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c0392b;
  }
`;

export default TeacherAllocation;