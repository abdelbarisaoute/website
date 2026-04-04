import { useState, FormEvent } from 'react';

interface Course {
  id: number;
  title: string;
  subject: string;
  description: string;
}

export default function App() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: 'Basic Algebra', subject: 'Math', description: 'Introduction to variables and equations.' },
    { id: 2, title: 'Newtonian Physics', subject: 'Physics', description: 'Laws of motion and gravity.' },
  ]);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Math');
  const [description, setDescription] = useState('');

  const addCourse = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    const newCourse = {
      id: Date.now(),
      title,
      subject,
      description,
    };
    
    setCourses([...courses, newCourse]);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <header className="mb-10 border-b pb-4">
        <h1 className="text-3xl font-bold">Free Courses</h1>
        <p className="text-gray-600">Physics and Math resources for everyone.</p>
      </header>

      <section className="mb-12 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Upload a Course</h2>
        <form onSubmit={addCourse} className="space-y-4">
          <input 
            type="text" 
            placeholder="Course Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="Math">Math</option>
            <option value="Physics">Physics</option>
          </select>
          <textarea 
            placeholder="Description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-24"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            Add Course
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6">Available Courses</h2>
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course.id} className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{course.title}</h3>
                <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-200 rounded">{course.subject}</span>
              </div>
              <p className="text-gray-700">{course.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

