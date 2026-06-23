import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function StatusBoard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = students.filter(s => s.email_verified).length;
  const totalCount = students.length;

  return (
    <div className="card MC-container wide">
      <h2>제출 현황 게시판</h2>
      
      <div className="stats-box">
        <div className="stat-item">
          <span>📋 전체 인원</span>
          <strong className="text-gold">{totalCount} 명</strong>
        </div>
        <div className="stat-item">
          <span>✅ 제출 완료</span>
          <strong className="text-success">{completedCount} 명</strong>
        </div>
        <div className="stat-item">
          <span>⏳ 미제출</span>
          <strong className="text-danger">{totalCount - completedCount} 명</strong>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">데이터를 불러오는 중...</p>
      ) : (
        <>
          <div className="student-grid mt-4">
            {students.map(student => (
              <div key={student.id} className={`student-card ${student.email_verified ? 'verified' : 'pending'}`}>
                <div className="student-status-icon">
                  {student.email_verified ? '✅' : '⏳'}
                </div>
                <div className="student-details">
                  <div className="student-name">{student.name}</div>
                  <div className="student-id">{student.student_id}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mc-nav">
            <button onClick={() => navigate('/')} className="mc-btn btn-primary mc-nav-btn">
              🏠 계정 신청하러 가기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

