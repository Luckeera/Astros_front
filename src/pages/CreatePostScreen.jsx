import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Check } from 'lucide-react';
import OrbitIcon from '../icons/OrbitIcon';
import { useAuth } from '../context/AuthContext';
import { postService, courseService } from '../services/api';

const CreatePostScreen = ({ onCancel }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses(token);
        setAvailableCourses(data);
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
      }
    };
    fetchCourses();
  }, [token]);

  const toggleCourse = (courseId) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  const toggleArea = (areaName, areaCourses) => {
    const areaCourseIds = areaCourses.map(c => c.course_id);
    const allSelected = areaCourseIds.every(id => selectedCourseIds.includes(id));
    
    if (allSelected) {
      setSelectedCourseIds(prev => prev.filter(id => !areaCourseIds.includes(id)));
    } else {
      setSelectedCourseIds(prev => [...new Set([...prev, ...areaCourseIds])]);
    }
  };

  const coursesByArea = availableCourses.reduce((acc, course) => {
    if (!acc[course.area]) acc[course.area] = [];
    acc[course.area].push(course);
    return acc;
  }, {});

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await postService.createPost(token, {
        title,
        content,
        is_collaborative: isCollaborative,
        target_courses: selectedCourseIds
      });
      onCancel(); 
    } catch (err) {
      console.error('Erro ao criar post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="flex items-center gap-6 mb-12">
        <div className="h-18 w-18 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-gray-300">
          <Plus className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">Nova Publicação</h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.25em] text-[10px] mt-2.5">Conecte sua pesquisa ao ecossistema Astros</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-12 space-y-10 shadow-2xl shadow-gray-200/50 ring-1 ring-black/5">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-3">Título do Post</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que o mundo acadêmico deve saber hoje?" 
            className="w-full px-10 py-6 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-8 focus:ring-[#FFA900]/5 focus:border-[#FFA900] focus:bg-white transition-all font-black text-gray-800 placeholder:text-gray-300 text-lg shadow-inner"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 ml-3">Corpo do Artigo / Projeto</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Articule suas ideias, hipóteses ou necessidades de colaboração..." 
            className="w-full h-72 px-10 py-8 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-8 focus:ring-[#FFA900]/5 focus:border-[#FFA900] focus:bg-white transition-all text-gray-700 font-medium leading-relaxed resize-none placeholder:text-gray-300 shadow-inner text-base"
          />
        </div>

        <div className="space-y-8">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 ml-3">Cursos Alvo (Onde seu post aparecerá)</label>
          {Object.entries(coursesByArea).map(([area, courses]) => {
            const areaCourseIds = courses.map(c => c.course_id);
            const isAreaSelected = areaCourseIds.every(id => selectedCourseIds.includes(id));
            
            return (
              <div key={area} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <button 
                  type="button"
                  onClick={() => toggleArea(area, courses)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 transition-colors ${isAreaSelected ? 'text-[#FFA900]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <div className={`h-2 w-2 rounded-full ${isAreaSelected ? 'bg-[#FFA900]' : 'bg-gray-200'}`} />
                  Área: {area} {isAreaSelected ? '(Toda Selecionada)' : '(Selecionar Tudo)'}
                </button>
                <div className="flex flex-wrap gap-3">
                  {courses.map(course => (
                    <button
                      key={course.course_id}
                      type="button"
                      onClick={() => toggleCourse(course.course_id)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                        selectedCourseIds.includes(course.course_id)
                          ? 'bg-white border-[#FFA900] text-black shadow-sm'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      {selectedCourseIds.includes(course.course_id) && <Check className="h-3 w-3 text-[#FFA900]" />}
                      {course.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <label 
          onClick={() => setIsCollaborative(!isCollaborative)}
          className={`flex items-center justify-between p-8 rounded-2xl border cursor-pointer group transition-all border-dashed ring-1 ring-transparent ${isCollaborative ? 'bg-orange-50 border-[#FFA900] ring-[#FFA900]/20' : 'bg-gray-50/50 border-gray-100 hover:bg-orange-50/50 hover:border-[#FFA900] hover:ring-[#FFA900]/10'}`}
        >
          <div className="flex items-center gap-6">
            <div className={`p-5 rounded-xl shadow-lg transition-all border ${isCollaborative ? 'bg-[#FFA900] text-black border-transparent scale-110 rotate-3' : 'bg-white text-[#FFA900] border-gray-50 group-hover:scale-110 group-hover:rotate-12'}`}>
              <OrbitIcon className="h-8 w-8" />
            </div>
            <div>
              <span className="block text-lg font-black text-gray-900 uppercase tracking-tighter leading-none">Colaboração Acadêmica</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5 block">Habilitar busca por parceiros de projeto</span>
            </div>
          </div>
          <div className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center transition-colors ${isCollaborative ? 'bg-[#FFA900] border-[#FFA900]' : 'bg-white border-gray-200 group-hover:border-[#FFA900]'}`}>
            <Sparkles className={`h-5 w-5 transition-colors ${isCollaborative ? 'text-black' : 'text-gray-200 group-hover:text-[#FFA900]'}`} />
          </div>
        </label>

        <div className="flex flex-col sm:flex-row justify-end gap-6 pt-6">
          <button 
            onClick={onCancel} 
            disabled={isSubmitting}
            className="px-10 py-5 text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.3em] transition-colors hover:underline underline-offset-8 decoration-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-16 py-5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 shadow-gray-300 disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostScreen;
