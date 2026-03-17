import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function StudentLookup() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStudent(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId.trim())
        .single();

      if (fetchError || !data) {
        throw new Error('학번을 찾을 수 없습니다.');
      }

      setStudent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim()
      });

      if (otpError) throw otpError;

      // Navigate to verify page, passing student info and email
      navigate('/verify', { state: { student, email: email.trim() } });
    } catch (err) {
      setError('인증 이메일 발송에 실패했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card MC-container">
      <h2>마인크래프트 계정 신청</h2>
      {!student ? (
        <form onSubmit={handleLookup} className="mc-form">
          <label htmlFor="studentId">학번을 입력하세요</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 202104177"
            required
            className="mc-input"
          />
          <button type="submit" disabled={loading} className="mc-btn btn-primary">
            {loading ? '검색 중...' : '확인'}
          </button>
          {error && <div className="error-msg">{error}</div>}
        </form>
      ) : (
        <div className="student-info">
          <div className="welcome-text">
            반갑습니다, <strong>{student.name}</strong> 님!
          </div>
          {student.email_verified ? (
            <div className="success-msg">
              <p>이미 계정 신청이 완료되었습니다.</p>
              <button onClick={() => navigate('/status')} className="mc-btn btn-secondary">
                현황 보기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendOTP} className="mc-form">
              <label htmlFor="email">학교 이메일을 입력하세요</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@pusan.ac.kr"
                required
                className="mc-input"
              />
              <button type="submit" disabled={loading} className="mc-btn btn-success">
                {loading ? '발송 중...' : '인증 코드 받기'}
              </button>
              {error && <div className="error-msg">{error}</div>}
              <button 
                type="button" 
                onClick={() => setStudent(null)} 
                className="mc-btn btn-danger mt-2"
                style={{marginTop: '10px'}}
              >
                다시 검색
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
